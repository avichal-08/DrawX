import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db/client";
import type { ChatMessage } from "../../../../chat/types";

export async function GET(req: NextRequest)  {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ message: "Slug not found" }, { status: 400 });
  }

  try{
  const room = await prismaClient.room.findFirst({
      where: { slug },
      include: {
      chat: {
        orderBy: { createdAt: "asc" }
      }
      }
  });

  if (room) {
    const filteredChat: ChatMessage[] = room.chat.map((chat) => ({
          message: chat.message,
          email: chat.senderEmail,
          name: chat.senderName
      }));

    return NextResponse.json({ filteredChat }, { status: 200 });
  }

  return NextResponse.json({ message: "Room not found" },{ status: 400 });
  }catch(error){
  console.log("Error while fetching chats from db")
  return NextResponse.json({ message: "Internal server error while fetching chats from DB" },{ status: 500 });
  }
};