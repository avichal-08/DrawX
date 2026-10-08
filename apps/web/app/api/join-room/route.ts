import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";
import { requireUser } from "../../lib/session";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const slug = body?.slug;
  if (!slug || typeof slug !== "string" || slug.length > 100) {
    return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
  }

  try {
    const room = await prismaClient.room.findUnique({
      where: { slug },
      select: { admin: { select: { email: true } } },
    });

    if (!room) return NextResponse.json({ found: false }, { status: 200 });
    return NextResponse.json({ found: true, adminEmail: room.admin.email });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
