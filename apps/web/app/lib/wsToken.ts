import { createHmac } from "crypto";

export const WS_AUDIENCE = "drawx-ws";

export type WsTokenClaims = {
  email: string;
  name: string;
  room: string;
  role: "admin" | "member";
};

const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");

/**
 * Signs a short-lived HS256 JWT that the WebSocket server (apps/api) verifies
 * with the same WS_TOKEN_SECRET. It is only used to open a socket, so the
 * default lifetime is one minute.
 */
export function signWsToken(
  claims: WsTokenClaims,
  ttlSeconds = 60,
  secret: string | undefined = process.env.WS_TOKEN_SECRET
): string {
  if (!secret) throw new Error("WS_TOKEN_SECRET is not set");
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: "HS256", typ: "JWT" });
  const body = b64({ ...claims, aud: WS_AUDIENCE, iat: now, exp: now + ttlSeconds });
  const sig = createHmac("sha256", secret).update(`${head}.${body}`).digest("base64url");
  return `${head}.${body}.${sig}`;
}
