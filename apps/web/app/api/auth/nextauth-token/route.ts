import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ 
            req, 
            secret: process.env.NEXTAUTH_SECRET 
        });
        
        console.log("NextAuth token from getToken():", token);
        
        if (!token) {
            return NextResponse.json({ error: "No session found" }, { status: 401 });
        }
        
        return NextResponse.json({ 
            nextAuthToken: token,
            user: {
                email: token.email,
                name: token.name,
                id: token.sub
            }
        });
        
    } catch (error) {
        console.error("Error getting NextAuth token:", error);
        return NextResponse.json(
            { error: "Failed to get token" }, 
            { status: 500 }
        );
    }
}