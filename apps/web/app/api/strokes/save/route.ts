import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";
import { requireUser } from "../../../lib/session";
import { isValidShape, isValidStrokeId } from "../../../lib/validate";

const MAX_BATCH = 200;

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { slug, strokesDetail } = await req.json();

    if (
      typeof slug !== "string" ||
      !Array.isArray(strokesDetail) ||
      strokesDetail.length === 0 ||
      strokesDetail.length > MAX_BATCH ||
      !strokesDetail.every((s) => s && isValidStrokeId(s.strokeId) && isValidShape(s.shape))
    ) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const room = await prismaClient.room.findUnique({ where: { slug } });
    if (!room) return NextResponse.json({ message: "Room not found" }, { status: 404 });

    // skipDuplicates makes retries (and double-saves) idempotent.
    await prismaClient.stroke.createMany({
      data: strokesDetail.map((s: { strokeId: string; shape: unknown }) => ({
        strokeId: s.strokeId,
        data: JSON.stringify(s.shape),
        roomId: room.id,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Strokes saved" }, { status: 200 });
  } catch (err) {
    console.error("Error saving strokes:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
