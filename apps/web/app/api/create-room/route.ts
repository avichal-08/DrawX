import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";
import Slug from "../../lib/slug";

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const { name, adminID } = body;

        if (!name || !adminID || typeof name !== "string" || typeof adminID !== "string") {
            return NextResponse.json({ error: "Invalid room or Admin ID" }, { status: 400 });
        }

        const slug = await Slug(name);

        const room = await prismaClient.room.create({
            data: {
                name,
                slug,
                adminId: adminID
            }
        });

        return NextResponse.json({
            roomSlug: room.slug
        });
    }catch(error){
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
