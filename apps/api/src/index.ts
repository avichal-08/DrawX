import dotenv from "dotenv";
dotenv.config();

import express,{Request,Response} from "express";
import jwt from "jsonwebtoken";
import { Authentication } from "./authMiddleware";
const app=express();

app.use(express.json());

interface AuthenticatedRequest extends Request{
    user?:{email:String};
}

app.post('/auth/token', (req: Request, res: Response) => {
    const { nextAuthToken } = req.body;
    
    if (!nextAuthToken) {
        return res.status(400).json({message: "NextAuth token required"});
    }
    
    if (!nextAuthToken.email) {
        return res.status(400).json({message: "Invalid token format - missing email"});
    }
    
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        return res.status(500).json({message: "JWT secret not configured"});
    }
    
    try {
        const customToken = jwt.sign(
            { email: nextAuthToken.email },
            secret,
            { expiresIn: '1h' }
        );
        
        res.cookie('token', customToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000
        });
        
        res.json({
            message: "Token created successfully",
            token: customToken,
            user: { email: nextAuthToken.email }
        });
        
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({message: "Invalid NextAuth token"});
    }
});

app.get('/',Authentication,(req:AuthenticatedRequest,res:Response)=>{
    res.json({message:"hello you are authenticated" , user:req.user});
})

app.listen(3000,()=>{
    console.log(`Server Started`)
})
