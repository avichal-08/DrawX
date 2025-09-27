import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";

interface AuthenticatedRequest extends Request{
    user?:{email:String};
}

export function Authentication(req:AuthenticatedRequest , res:Response , next:NextFunction){
    const cookies=req.headers.cookie;

    if(!cookies){
        return res.status(401).json({message:"No cookie found"});
    }

    const {token} = cookie.parse(cookies);

    if(!token){
        return res.status(401).json({message:"Token not found"});
    }

    try{
        const decoded=jwt.verify(token,process.env.AUTH_SECRET as string) as {email :string};
        req.user={email : decoded.email};
        next();
    }catch(err){
        return res.status(401).json({message:`${err}`})
    }
}