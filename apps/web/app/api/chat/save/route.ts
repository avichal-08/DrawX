import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";
import { requireUser } from "../../../lib/session";

const MAX_CHAT_LENGTH = 2000;

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const slug = body?.slug;
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (typeof slug !== "string" || !message || message.length > MAX_CHAT_LENGTH) {
    return NextResponse.json({ message: "Invalid inputs" }, { status: 400 });
  }

  try {
    const room = await prismaClient.room.findUnique({ where: { slug } });
    if (!room) return NextResponse.json({ message: "Room Not found" }, { status: 404 });

    // Sender identity comes from the session, not the request body.
    await prismaClient.chat.create({
      data: { message, senderName: user.name, senderEmail: user.email, roomId: room.id },
    });

    return NextResponse.json({ message: "Chat created successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error while creating chats in db", error);
    return NextResponse.json({ message: "Chat message not saved due to an internal server error" }, { status: 500 });
  }
}
