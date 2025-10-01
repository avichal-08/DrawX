import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

interface AuthenticatedRequest extends Request{
    user?:{email:string};
}

export function Authentication(req:AuthenticatedRequest , res:Response , next:NextFunction){
    const cookies=req.headers.cookie;

    if(!cookies){
        return res.status(401).json({message:"No cookie found"});
    }

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;

    if(!token){
        return res.status(401).json({message:"Token not found"});
    }

    if(token === "undefined" || token === "null"){
        return res.status(401).json({message:"Token is undefined or null"});
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if(!secret){
        return res.status(500).json({message:"JWT secret not configured"});
    }

    try{
        const decoded=jwt.verify(token, secret) as {email :string};
        req.user={email : decoded.email};
        next();
    }catch(err){
        return res.status(401).json({message:`Invalid token: ${err}`})
    }
}