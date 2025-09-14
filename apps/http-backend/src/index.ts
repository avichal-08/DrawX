import express from "express";
const app=express();
const PORT= 3000;

app.get('/',(req:any,res:any)=>{
    res.send("hello")
})

app.listen(PORT,():any=>{
    console.log(`Server started at http://localhost:${PORT}`)
})