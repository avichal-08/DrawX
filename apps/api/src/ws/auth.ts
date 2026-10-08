import jwt from "jsonwebtoken";

export const WS_AUDIENCE = "drawx-ws";

export type WsClaims = {
  email: string;
  name: string;
  /** Room slug this ticket is valid for. */
  room: string;
  role: "admin" | "member";
};

/**
 * Verifies a short-lived WebSocket ticket minted by the web app
 * (`GET /api/ws-token`). Returns null for anything missing, expired,
 * tampered with, signed with another secret, or malformed.
 */
export function verifyWsToken(
  token: string | null | undefined,
  secret: string | undefined = process.env.WS_TOKEN_SECRET
): WsClaims | null {
  if (!token || !secret) return null;
  try {
    const p = jwt.verify(token, secret, {
      algorithms: ["HS256"],
      audience: WS_AUDIENCE,
      // Vercel and the WS host don't share a clock.
      clockTolerance: 30,
    }) as Record<string, unknown>;

    if (
      typeof p.email !== "string" ||
      typeof p.name !== "string" ||
      typeof p.room !== "string" ||
      (p.role !== "admin" && p.role !== "member")
    ) {
      return null;
    }
    return { email: p.email, name: p.name, room: p.room, role: p.role };
  } catch {
    return null;
  }
}
