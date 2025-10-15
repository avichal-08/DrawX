import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";

import { ShapeDetail } from "../../../../draw/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, strokesDetail } = body;

    if (!slug || !strokesDetail || !Array.isArray(strokesDetail)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const room = await prismaClient.room.findUnique({ where: { slug } });
    
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    const strokeRecords = strokesDetail.map((stroke: ShapeDetail) => ({
      strokeId: stroke.strokeId,
      data: JSON.stringify(stroke.shape),
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
