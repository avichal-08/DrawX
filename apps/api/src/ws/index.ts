import type { Server } from "http";
import crypto from "crypto";
import { WebSocketServer, WebSocket } from "ws";
import { verifyWsToken, type WsClaims } from "./auth";

const MAX_PAYLOAD_BYTES = 1024 * 1024; // pencil strokes can be large, 1 MiB is plenty
const MAX_MSGS_PER_SEC = 50;
const MAX_CHAT_LENGTH = 2000;
const SHAPE_TYPES = new Set(["rect", "circle", "line", "text", "arrow", "pencil"]);

type Client = {
  socket: WebSocket;
  clientId: string;
  claims: WsClaims;
  roomId: string | null;
  windowStart: number;
  windowCount: number;
};

export type WebSktOptions = {
  /** Comma-separated list of allowed Origins. Empty/undefined = don't check. */
  allowedOrigins?: string;
  /** Overrides process.env.WS_TOKEN_SECRET (used by tests). */
  tokenSecret?: string;
};

const isId = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0 && v.length <= 64;

function isDrawData(d: any): d is { strokeId: string; shape: { type: string } } {
  return (
    d &&
    typeof d === "object" &&
    isId(d.strokeId) &&
    d.shape &&
    typeof d.shape === "object" &&
    SHAPE_TYPES.has(d.shape.type)
  );
}

export function WebSkt(server: Server, opts: WebSktOptions = {}) {
  const wss = new WebSocketServer({ server, maxPayload: MAX_PAYLOAD_BYTES });

  const allowedOrigins = (opts.allowedOrigins ?? process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const clients = new Map<string, Client>();
  const rooms = new Map<string, Set<string>>();

  const send = (c: Client, msg: unknown) => {
    if (c.socket.readyState === WebSocket.OPEN) c.socket.send(JSON.stringify(msg));
  };

  const roster = (roomId: string) => {
    const list: { name: string; email: string }[] = [];
    for (const id of rooms.get(roomId) ?? []) {
      const c = clients.get(id);
      if (c && c.socket.readyState === WebSocket.OPEN) {
        list.push({ name: c.claims.name, email: c.claims.email });
      }
    }
    return list;
  };

  const broadcast = (roomId: string, msg: unknown, exceptId?: string) => {
    for (const id of rooms.get(roomId) ?? []) {
      if (id === exceptId) continue;
      const c = clients.get(id);
      if (c) send(c, msg);
    }
  };

  const reject = (socket: WebSocket, code: number, reason: string) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "not-allowed" }));
    }
    socket.close(code, reason);
  };

  wss.on("connection", (socket, req) => {
    if (allowedOrigins.length && !allowedOrigins.includes(req.headers.origin ?? "")) {
      return reject(socket, 4403, "origin not allowed");
    }

    const token = new URL(req.url ?? "/", "http://localhost").searchParams.get("token");
    const claims = verifyWsToken(token, opts.tokenSecret);
    if (!claims) return reject(socket, 4401, "unauthorized");

    const clientId = crypto.randomUUID();
    const self: Client = {
      socket,
      clientId,
      claims,
      roomId: null,
      windowStart: Date.now(),
      windowCount: 0,
    };
    clients.set(clientId, self);

    socket.on("message", (raw) => {
      // Simple fixed-window rate limit per connection.
      const now = Date.now();
      if (now - self.windowStart >= 1000) {
        self.windowStart = now;
        self.windowCount = 0;
      }
      if (++self.windowCount > MAX_MSGS_PER_SEC) {
        if (self.windowCount > MAX_MSGS_PER_SEC * 4) socket.close(4429, "rate limit");
        return;
      }

      let msg: any;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }
      if (!msg || typeof msg !== "object") return;
      const { type, roomId, data } = msg;

      if (type === "join-room") {
        // Identity and room come from the signed ticket, never from the message.
        if (self.roomId || roomId !== claims.room) {
          return reject(socket, 4403, "room not allowed");
        }
        self.roomId = claims.room;
        if (!rooms.has(claims.room)) rooms.set(claims.room, new Set());
        rooms.get(claims.room)!.add(clientId);

        const existingClients = roster(claims.room);
        broadcast(
          claims.room,
          { type: "room-joined", name: claims.name, email: claims.email, existingClients },
          clientId
        );
        send(self, { type: "existing-client", existingClients });
        return;
      }

      // Everything below requires having joined the room.
      const room = self.roomId;
      if (!room) return;

      switch (type) {
        case "draw-update":
          if (!isDrawData(data)) return;
          broadcast(room, { type, data: { strokeId: data.strokeId, shape: data.shape } }, clientId);
          break;

        case "erase-update":
          if (!data || !isId(data.strokeId)) return;
          broadcast(room, { type, data: { strokeId: data.strokeId } }, clientId);
          break;

        case "chat-update": {
          const message = typeof data?.message === "string" ? data.message.trim() : "";
          if (!message || message.length > MAX_CHAT_LENGTH) return;
          // Sender identity is stamped by the server so it can't be spoofed.
          broadcast(
            room,
            { type, data: { message, name: claims.name, email: claims.email } },
            clientId
          );
          break;
        }

        case "remove-user": {
          if (claims.role !== "admin") return;
          const targetEmail = data?.email;
          if (typeof targetEmail !== "string" || targetEmail === claims.email) return;

          broadcast(room, { type, data: { email: targetEmail } }, clientId);
          for (const id of rooms.get(room) ?? []) {
            const c = clients.get(id);
            if (c && c.claims.email === targetEmail) c.socket.close(4403, "removed by admin");
          }
          break;
        }
      }
    });

    socket.on("close", () => {
      clients.delete(clientId);
      const roomId = self.roomId;
      if (!roomId) return;

      const members = rooms.get(roomId);
      members?.delete(clientId);
      if (members && members.size === 0) rooms.delete(roomId);

      broadcast(roomId, {
        type: "room-left",
        name: claims.name,
        email: claims.email,
        existingClients: roster(roomId),
      });
    });
  });

  return wss;
}
