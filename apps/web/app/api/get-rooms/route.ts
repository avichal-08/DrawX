import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminId = body.adminId;
    if(!adminId || typeof adminId !== "string") {
        return NextResponse.json({ message: "Invalid Admin ID" }, { status: 301 });
    }

    const rooms = await prismaClient.room.findMany({
      where: { adminId },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
