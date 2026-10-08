import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { signWsToken, WS_AUDIENCE } from "../app/lib/wsToken.ts";

const claims = { email: "a@x.com", name: "A", room: "r1", role: "admin" as const };

test("produces a verifiable HS256 JWT with claims, audience and expiry", () => {
  const token = signWsToken(claims, 60, "s3cret");
  const [head, body, sig] = token.split(".");
  assert.deepEqual(JSON.parse(Buffer.from(head!, "base64url").toString()), { alg: "HS256", typ: "JWT" });

  const expected = createHmac("sha256", "s3cret").update(`${head}.${body}`).digest("base64url");
  assert.equal(sig, expected);

  const payload = JSON.parse(Buffer.from(body!, "base64url").toString());
  assert.equal(payload.aud, WS_AUDIENCE);
  assert.equal(payload.email, "a@x.com");
  assert.equal(payload.room, "r1");
  assert.equal(payload.role, "admin");
  assert.equal(payload.exp - payload.iat, 60);
});

test("refuses to sign without a secret", () => {
  const prev = process.env.WS_TOKEN_SECRET;
  delete process.env.WS_TOKEN_SECRET;
  assert.throws(() => signWsToken(claims), /WS_TOKEN_SECRET/);
  if (prev !== undefined) process.env.WS_TOKEN_SECRET = prev;
});

test("defaults to a five-minute lifetime", () => {
  const body = JSON.parse(Buffer.from(signWsToken(claims, undefined, "k").split(".")[1]!, "base64url").toString());
  assert.equal(body.exp - body.iat, 300);
});
