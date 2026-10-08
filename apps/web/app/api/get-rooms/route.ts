import { NextResponse } from "next/server";
import { prismaClient } from "@repo/db";
import { requireUser } from "../../lib/session";

// Lists the rooms administered by the signed-in user (body is ignored).
export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const rooms = await prismaClient.room.findMany({
      where: { adminId: user.id },
      select: { id: true, name: true, slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
