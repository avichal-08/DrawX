"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { GoSidebarExpand } from "react-icons/go";
import { GoSidebarCollapse } from "react-icons/go";
import { PiHandGrabbingDuotone } from "react-icons/pi";
import { CiText } from "react-icons/ci";
import { FaRegCircle } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { RiRectangleLine } from "react-icons/ri";

import { initDraw } from "../../../draw";
import type { Shape } from "../../../draw/types";
import type { ChatMessage } from "../../../chat/types";
import { Chat } from "../../../chat"

export default function Whiteboard() {

  const params = useParams();
  const roomId = params.slug;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);

  const [chat, setChat] = useState(true);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [shapeMode, setShapeMode] = useState<"rect" | "circle" | "line" | "text" | "pan">("rect");
  const [socket, setSocket] = useState<WebSocket | null>(null);

   useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    ws.onopen = () => {
      ws.send(JSON.stringify({ 
        type: "join-room",
        roomId,
        data: ""
      }));
      console.log("WebSocket connected")
    };
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.log("WebSocket error:", err);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 2;


    const cleanup = initDraw(canvas, mode, shapeMode, shapesRef.current, socket);

    return cleanup;
  }, [mode, shapeMode]);

  return (
    <div className="relative">
    <div className={`${shapeMode === "pan" ? "cursor-grab" : "cursor-default"} w-full h-screen relative`}>
      {!chat&&<div className={`${mode==="dark"?"text-white":""} absolute top-2 right-2 cursor-pointer`} onClick={()=>setChat(true)}>
        <GoSidebarExpand size={25}/>
      </div>}

      {chat&&<div className={`${mode==="dark"?"text-white":""} absolute top-2 right-90 cursor-pointer`} onClick={()=>setChat(false)}>
        <GoSidebarCollapse size={25}/>
      </div>}

      <div className={`absolute bottom-4 ${chat ? "left-70": "left-110"} flex gap-1 z-10 bg-gray-300 rounded-2xl px-4 py-1 border-2`}>
      
        <button
          className={`bg-white text-black text-lg rounded-2xl px-2 py-1 cursor-pointer shadow-2xl`}
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
          {mode === "dark"?<MdLightMode size={25}/>:<MdDarkMode size={25}/>}
        </button>
      
        <button
          className={`${shapeMode === "pan"?"bg-black text-white":"bg-white text-black"}  text-lg rounded-2xl px-4 py-2 cursor-pointer shadow`}
          onClick={() => {setShapeMode("pan");}}> <PiHandGrabbingDuotone size={35}/>
        </button>
        <button

          className={`${shapeMode === "circle"?"bg-black text-white":"bg-white text-black"}  text-lg rounded-2xl px-4 py-2 cursor-pointer shadow`}
          onClick={() => {setShapeMode("circle");}}><FaRegCircle size={25}/>
        </button>

        <button
          className={`${shapeMode === "line"?"bg-black text-white":"bg-white  text-black"}  text-2xl font-extrabold rounded-2xl px-4 py-2 cursor-pointer shadow`}
          onClick={() => {setShapeMode("line");}}> /
        </button>

        <button
          className={`${shapeMode === "rect"?"bg-black text-white":"bg-white text-black"}  text-lg rounded-2xl px-4 py-2 cursor-pointer shadow`}
          onClick={() => {setShapeMode("rect");}}><RiRectangleLine size={28}/>
        </button>

        <button
          className={`${shapeMode === "text"?"bg-black text-white":"bg-white text-black"}  text-lg rounded-2xl px-4 py-2 cursor-pointer shadow`}
          onClick={() => {setShapeMode("text");}}> <CiText size={25}/>
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="border border-gray-400 w-full h-full"
      />
    </div>
    {chat&&<div className="absolute z-1 top-0 right-0">
      <Chat mode={mode} socket={socket} messages={messagesRef.current}/>
    </div>}
    </div>
  );
}
