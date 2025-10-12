import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db/client";

export async function POST(req: NextRequest)  {
    const body = await req.json();
    const { slug, message, senderName, senderEmail } = body;

    if (!slug || !message || !senderName || !senderEmail || 
        typeof slug !== "string" || typeof message !== "string" 
        || typeof senderName !== "string" || typeof senderEmail !== "string"
    ) {
      return NextResponse.json({ message: "Invalid inputs" }, { status: 400 });
    }

   try{

    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    if(!room){
        return NextResponse.json({ message: "Room Not found"},{ status: 401 })
    }

    const roomId = room.id;

    await prismaClient.chat.create({
        data: {
            message,
            senderName,
            senderEmail,
            roomId
        }
    });

    return NextResponse.json({ message: "Chat created successfully" }, { status: 200 });

   }catch(error){
    console.log("Error while creating chats in db")
    return NextResponse.json({ message: "Chat message not saved in DB due internal server error" }, { status: 500 });
   }
};