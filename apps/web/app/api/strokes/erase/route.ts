import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eraseStrokeId } = body;

        if (!eraseStrokeId || typeof eraseStrokeId !== "string") {
            return NextResponse.json({ message: "Invalid stroke id"}, { status: 400 });
        }

        await prismaClient.stroke.delete({
            where: {
                strokeId: eraseStrokeId
            }
        });

        return NextResponse.json({ message: "Stroke deleted" });
    }catch(error) {
        console.log(`error while deleting stroke in db: ${error}`);
        return NextResponse.json({ message: "Server error while deleting stroke from db"}, { status: 500 } )
    }
}