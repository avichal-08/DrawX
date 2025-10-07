import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db/client";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { slug } = body;

    if(!slug){
        return NextResponse.json({message: "No slug found"}, { status: 400 });
    }

    try {
        const user = await prismaClient.user.findFirst({
        where: {
            rooms: {
                some: { slug },
            },
        },
    });

    if(user) {
        return NextResponse.json({
            found: true,
            adminName: user?.name
        });
    }
    }catch(error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}