import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db/client";
import Slug from "../../lib/slug";

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const { name, ID } = body;

        if (!name || !ID) {
            return NextResponse.json({ error: "Missing name of room or ID" }, { status: 400 });
        }

        const slug = await Slug(name);

        const room = await prismaClient.room.create({
            data: {
                name,
                slug,
                adminId: ID
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