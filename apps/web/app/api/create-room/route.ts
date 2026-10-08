import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";
import Slug from "../../lib/slug";
import { requireUser } from "../../lib/session";

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name } = await req.json();
    if (typeof name !== "string" || !name.trim() || name.length > 60) {
      return NextResponse.json({ error: "Invalid room name" }, { status: 400 });
    }

    const slug = await Slug(name);

    // The admin is always the signed-in user; never trust an id from the body.
    const room = await prismaClient.room.create({
      data: { name: name.trim(), slug, adminId: user.id },
    });

    return NextResponse.json({ roomSlug: room.slug });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
