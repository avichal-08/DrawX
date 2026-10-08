import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";
import { requireUser } from "../../lib/session";
import { signWsToken } from "../../lib/wsToken";

// GET /api/ws-token?slug=<room>
// Issues a one-minute ticket for the WebSocket server. The role comes from the
// database, so a client can't claim to be the room admin.
export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ message: "Slug required" }, { status: 400 });

  const room = await prismaClient.room.findUnique({
    where: { slug },
    select: { admin: { select: { email: true } } },
  });
  if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 });

  try {
    const token = signWsToken({
      email: user.email,
      name: user.name,
      room: slug,
      role: room.admin.email === user.email ? "admin" : "member",
    });
    return NextResponse.json({ token });
  } catch (error) {
    console.error("ws-token:", error);
    return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
  }
}
