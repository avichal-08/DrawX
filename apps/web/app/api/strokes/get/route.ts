import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";

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
      strokes: {
        orderBy: { createdAt: "asc" }
      }
      }
  });

  if(room){
   const strokesDetail = room.strokes.map(s => {
    const dbstroke = JSON.parse(s.data);
    return {
      strokeId: s.strokeId,
      shape: dbstroke
    }
  });
    return NextResponse.json({ strokesDetail }, { status: 200 });
  }

  return NextResponse.json({ message: "Room not found" },{ status: 400 });
  }catch(error){
  console.log("Error while fetching strokes from db")
  return NextResponse.json({ message: "Internal server error while strokes chats from DB" },{ status: 500 });
  }
};
