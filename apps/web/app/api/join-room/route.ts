import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
    }

    try {
        const roomAdmin = await prismaClient.user.findFirst({
        where: {
            rooms: {
                some: { slug },
            },
        },
    });

    if (!roomAdmin) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    
    return NextResponse.json({
        found: true,
        adminEmail: roomAdmin?.email
    });

    }catch(error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
