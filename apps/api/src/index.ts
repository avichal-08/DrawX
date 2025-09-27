import express,{Request,Response} from "express";
import { Authentication } from "./authMiddleware";
const app=express();

interface AuthenticatedRequest extends Request{
    user?:{email:String};
}

app.get('/',Authentication,(req:AuthenticatedRequest,res:Response)=>{
    res.json({message:"hello you are authenticated" , user:req.user});
})

app.listen(3000,()=>{
    console.log(`Server Started`)
})
