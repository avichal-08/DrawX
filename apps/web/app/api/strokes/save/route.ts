
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, strokes } = body;

    if (!slug || !strokes || !Array.isArray(strokes)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const room = await prismaClient.room.findUnique({ where: { slug } });
    
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    const strokeRecords = strokes.map((stroke: any) => ({
      data: JSON.stringify(stroke),
      roomId: room.id,
    }));

    await prismaClient.stroke.createMany({
      data: strokeRecords,
    });

    return NextResponse.json({ message: "Strokes saved" }, { status: 200 });
  } catch (err) {
    console.error("Error saving strokes:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
