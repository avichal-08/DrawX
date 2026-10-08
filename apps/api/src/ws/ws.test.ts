import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "http";
import type { AddressInfo } from "net";
import jwt from "jsonwebtoken";
import WebSocket from "ws";
import { WebSkt } from "./index";
import { WS_AUDIENCE } from "./auth";

const SECRET = "test-secret";
let server: http.Server;
let port: number;

before(async () => {
  server = http.createServer();
  WebSkt(server, { tokenSecret: SECRET });
  await new Promise<void>((r) => server.listen(0, r));
  port = (server.address() as AddressInfo).port;
});

after(() => {
  server.closeAllConnections?.();
  server.close();
});

const ticket = (
  claims: { email: string; name?: string; room: string; role?: "admin" | "member" },
  secret = SECRET
) =>
  jwt.sign(
    { name: claims.name ?? claims.email, role: "member", ...claims },
    secret,
    { audience: WS_AUDIENCE, expiresIn: 60 }
  );

type Conn = {
  ws: WebSocket;
  msgs: any[];
  closed: Promise<number>;
  next: (type: string) => Promise<any>;
};

function connect(token: string | null): Promise<Conn> {
  const url = `ws://127.0.0.1:${port}/${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  const ws = new WebSocket(url);
  const msgs: any[] = [];
  const waiters: { type: string; resolve: (m: any) => void }[] = [];

  ws.on("message", (raw) => {
    const m = JSON.parse(raw.toString());
    const i = waiters.findIndex((w) => w.type === m.type);
    if (i >= 0) waiters.splice(i, 1)[0]!.resolve(m);
    else msgs.push(m);
  });

  const closed = new Promise<number>((r) => ws.on("close", (code) => r(code)));
  const next = (type: string) =>
    new Promise<any>((resolve, reject) => {
      const i = msgs.findIndex((m) => m.type === type);
      if (i >= 0) return resolve(msgs.splice(i, 1)[0]);
      const t = setTimeout(() => reject(new Error(`timeout waiting for ${type}`)), 2000);
      waiters.push({ type, resolve: (m) => (clearTimeout(t), resolve(m)) });
    });

  return new Promise((resolve, reject) => {
    ws.on("open", () => resolve({ ws, msgs, closed, next }));
    ws.on("error", reject);
  });
}

async function join(token: string, room: string) {
  const c = await connect(token);
  c.ws.send(JSON.stringify({ type: "join-room", roomId: room }));
  await c.next("existing-client");
  return c;
}

const quiet = (ms = 150) => new Promise((r) => setTimeout(r, ms));

test("rejects missing, forged and expired tickets", async () => {
  for (const token of [
    null,
    "garbage",
    ticket({ email: "a@x.com", room: "r1" }, "wrong-secret"),
    jwt.sign({ email: "a@x.com", name: "A", room: "r1", role: "member" }, SECRET, {
      audience: WS_AUDIENCE,
      expiresIn: -10,
    }),
  ]) {
    const c = await connect(token);
    assert.equal((await c.next("not-allowed")).type, "not-allowed");
    assert.equal(await c.closed, 4401);
  }
});

test("a ticket for one room cannot join another", async () => {
  const c = await connect(ticket({ email: "a@x.com", room: "r1" }));
  c.ws.send(JSON.stringify({ type: "join-room", roomId: "other-room" }));
  assert.equal(await c.closed, 4403);
});

test("draw/erase relay reaches the room but not the sender or other rooms", async () => {
  const a = await join(ticket({ email: "a@x.com", room: "relay-1" }), "relay-1");
  const b = await join(ticket({ email: "b@x.com", room: "relay-1" }), "relay-1");
  const outsider = await join(ticket({ email: "c@x.com", room: "relay-2" }), "relay-2");

  const shape = { type: "rect", x: 1, y: 2, width: 3, height: 4 };
  a.ws.send(JSON.stringify({ type: "draw-update", data: { strokeId: "s1", shape } }));
  const got = await b.next("draw-update");
  assert.deepEqual(got.data, { strokeId: "s1", shape });

  b.ws.send(JSON.stringify({ type: "erase-update", data: { strokeId: "s1" } }));
  assert.equal((await a.next("erase-update")).data.strokeId, "s1");

  await quiet();
  assert.equal(a.msgs.filter((m) => m.type === "draw-update").length, 0);
  assert.equal(outsider.msgs.filter((m) => /update/.test(m.type)).length, 0);
  [a, b, outsider].forEach((c) => c.ws.close());
});

test("malformed draw payloads are dropped", async () => {
  const a = await join(ticket({ email: "a@x.com", room: "bad-1" }), "bad-1");
  const b = await join(ticket({ email: "b@x.com", room: "bad-1" }), "bad-1");
  a.ws.send(JSON.stringify({ type: "draw-update", data: { strokeId: "s", shape: { type: "evil" } } }));
  a.ws.send(JSON.stringify({ type: "draw-update", data: "nope" }));
  await quiet();
  assert.equal(b.msgs.filter((m) => m.type === "draw-update").length, 0);
  [a, b].forEach((c) => c.ws.close());
});

test("chat sender identity comes from the ticket, not the message", async () => {
  const a = await join(ticket({ email: "a@x.com", name: "Alice", room: "chat-1" }), "chat-1");
  const b = await join(ticket({ email: "b@x.com", room: "chat-1" }), "chat-1");
  a.ws.send(
    JSON.stringify({
      type: "chat-update",
      data: { message: "hi", name: "Admin", email: "boss@x.com" },
    })
  );
  const got = await b.next("chat-update");
  assert.deepEqual(got.data, { message: "hi", name: "Alice", email: "a@x.com" });
  [a, b].forEach((c) => c.ws.close());
});

test("only the room admin can remove a user, and the target is disconnected", async () => {
  const admin = await join(ticket({ email: "admin@x.com", room: "kick-1", role: "admin" }), "kick-1");
  const bob = await join(ticket({ email: "bob@x.com", room: "kick-1" }), "kick-1");
  const eve = await join(ticket({ email: "eve@x.com", room: "kick-1" }), "kick-1");

  // A regular member tries to kick Bob: nothing happens.
  eve.ws.send(JSON.stringify({ type: "remove-user", data: { email: "bob@x.com" } }));
  await quiet();
  assert.equal(bob.msgs.filter((m) => m.type === "remove-user").length, 0);
  assert.equal(bob.ws.readyState, WebSocket.OPEN);

  // The admin can.
  admin.ws.send(JSON.stringify({ type: "remove-user", data: { email: "bob@x.com" } }));
  assert.equal((await bob.next("remove-user")).data.email, "bob@x.com");
  assert.equal(await bob.closed, 4403);
  [admin, eve].forEach((c) => c.ws.close());
});

test("room-left is broadcast with the updated roster", async () => {
  const a = await join(ticket({ email: "a@x.com", room: "left-1" }), "left-1");
  const b = await join(ticket({ email: "b@x.com", room: "left-1" }), "left-1");
  b.ws.close();
  const left = await a.next("room-left");
  assert.equal(left.email, "b@x.com");
  assert.deepEqual(left.existingClients.map((c: any) => c.email), ["a@x.com"]);
  a.ws.close();
});
