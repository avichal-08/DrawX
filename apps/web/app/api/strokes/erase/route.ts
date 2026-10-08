import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";
import { requireUser } from "../../../lib/session";
import { isValidStrokeId } from "../../../lib/validate";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { slug, eraseStrokeId } = await req.json();
    if (typeof slug !== "string" || !isValidStrokeId(eraseStrokeId)) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Scoped to the room, so a stroke id from another room can't be deleted.
    // deleteMany is idempotent: erasing an already-erased stroke is a no-op.
    await prismaClient.stroke.deleteMany({
      where: { strokeId: eraseStrokeId, room: { slug } },
    });

    return NextResponse.json({ message: "Stroke deleted" });
  } catch (error) {
    console.error(`error while deleting stroke in db: ${error}`);
    return NextResponse.json({ message: "Server error while deleting stroke" }, { status: 500 });
  }
}
