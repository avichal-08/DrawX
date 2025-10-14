"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

import { AiOutlineMessage } from "react-icons/ai";
import { CiLocationArrow1, CiText } from "react-icons/ci";
import { FaRegCircle } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiRectangleLine } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";
import { IoPeopleSharp } from "react-icons/io5";

import { initDraw } from "../../../draw";
import type { Shape } from "../../../draw/types";
import { Chat } from "../../../chat";
import { useDebouncedStrokeSave } from "../../../draw/dbFunctions";
import { Joined } from "../../../alerts/joined";
import { Left } from "../../../alerts/left";
import type { existingClients } from "../../../alerts/participants/types";
import { Participants } from "../../../alerts/participants";

export default function Whiteboard() {
  const params = useParams();
  const roomId = params.slug;
  const router = useRouter();
  const { data: session, status } = useSession();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const existingClientsRef = useRef<existingClients[]>([]);
  const shapesRef = useRef<Shape[]>([]);
  const joinedRef = useRef<{ email: string; name: string }>(null);
  const leftRef = useRef<{ email: string; name: string }>(null);
  const joinedTimeout = useRef<NodeJS.Timeout | null>(null);
  const leftTimeout = useRef<NodeJS.Timeout | null>(null);
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const panStartX = useRef(0);
  const panStartY = useRef(0);

  const [joined, setJoined] = useState(false);
  const [left, setLeft] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [chat, setChat] = useState(false);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [shapeMode, setShapeMode] = useState<"rect" | "circle" | "line" | "text" | "pan" | "arrow" | "pencil">("rect");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // const socketUrl = process.env.NEXT_WS_URL;

  const saveStroke = useDebouncedStrokeSave(roomId as string, isAdmin);

  const RoomCheck = async () => {
    try {
      const res = await axios.post("/api/join-room", { slug: roomId });
      if (!res.data.found) 
        router.push(`/choice`);
      else if (session?.user.email === res.data.adminEmail) 
        setIsAdmin(true);
    } catch (error) {
      console.log("Something went wrong in room's page.tsx");
    }
  };

  useEffect(() => {
    RoomCheck();
  }, [roomId, session]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const ws = new WebSocket("wss://drawx-t3sa.onrender.com");

    ws.onopen = () => {
      const email = session?.user.email;
      const name = session?.user.name;
      if (!email || !name) return;
      ws.send(
        JSON.stringify({ type: "join-room", roomId, data: "", email, name })
      );
      console.log("WebSocket connected");
    };

    ws.onmessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "room-joined") {
        joinedRef.current = { email: msg.email, name: msg.name };
        existingClientsRef.current = msg.existingClients;
        setJoined(true);
        if (joinedTimeout.current) clearTimeout(joinedTimeout.current);
        joinedTimeout.current = setTimeout(() => setJoined(false), 2000);
      }
      if (msg.type === "existing-client")
        existingClientsRef.current = msg.existingClients;
      if (msg.type === "room-left") {
        leftRef.current = { email: msg.email, name: msg.name };
        existingClientsRef.current = msg.existingClients;
        setLeft(true);
        if (leftTimeout.current) clearTimeout(leftTimeout.current);
        leftTimeout.current = setTimeout(() => setLeft(false), 2000);
      }
    };

    setSocket(ws);
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.log("WebSocket error:", err);

    return () => ws.close();
  }, [status, session, roomId]);

  useEffect(() => {
    const fetchStrokes = async () => {
      try {
        const res = await axios.get(`/api/strokes/get?slug=${roomId}`);
        shapesRef.current = res.data.strokes;
      } catch (error) {
        console.log(`Error fetching strokes: ${error}`);
      }
    };
    fetchStrokes();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - 2;
      canvas.height = window.innerHeight - 2;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const cleanup = initDraw(
      canvas,
      mode,
      shapeMode,
      shapesRef.current,
      socket,
      isAdmin,
      roomId as string,
      saveStroke,
      panStartX,
      panStartY,
      offsetX,
      offsetY
    );

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if(cleanup)
        cleanup();
    };
  }, [mode, shapeMode, socket, isAdmin]);

  if (status === "loading") return <p className="text-2xl mt-40 text-center">Loading...</p>;
  if (status === "unauthenticated") router.push("/");

  return (
    <div className="relative w-full h-screen overflow-hidden ">
      <div className={`absolute top-2 right-2 flex flex-col gap-2 z-20`}>
        <button
          className={`p-2 rounded-full cursor-pointer text-white`}
          onClick={() => setChat(!chat)}
        >
          <AiOutlineMessage size={24} />
        </button>
        <button
          className={`p-2 rounded-full text-white cursor-pointer`}
          onClick={() => setParticipants(!participants)}
        >
          <IoPeopleSharp size={24} />
        </button>
      </div>

      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 bg-gray-300 border-2 border-gray-400 rounded-2xl px-2 py-1 sm:px-4 sm:py-2 shadow-lg z-1`}
      >
        <button
          className="text-black rounded-xl px-2 py-1 cursor-pointer"
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
          {mode === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>

        {[
          { key: "circle", icon: <FaRegCircle size={22} /> },
          { key: "line", icon: <span className="text-2xl font-bold">/</span> },
          { key: "rect", icon: <RiRectangleLine size={22} /> },
          { key: "arrow", icon: <CiLocationArrow1 size={22} /> },
          { key: "pencil", icon: <LuPencil size={22} /> },
          { key: "text", icon: <CiText size={22} /> },
        ].map((btn) => (
          <button
            key={btn.key}
            className={`rounded-xl px-3 py-1 cursor-pointer ${
              shapeMode === btn.key ? "bg-black text-white" : "text-black"
            }`}
            onClick={() => setShapeMode(btn.key as any)}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />

      {chat && (
        <div className={`absolute w-screen  bg-slate-700 top-0 right-0 md:w-[30%] h-full shadow-lg z-10 md:z-10`}>
          <Chat mode={mode} socket={socket} slug={roomId as string} />
        </div>
      )}
      {joined && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1">
          <Joined name={joinedRef.current?.name!} email={joinedRef.current?.email!} />
        </div>
      )}
      {left && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-1">
          <Left name={leftRef.current?.name!} email={leftRef.current?.email!} />
        </div>
      )}
      {participants && (
        <div className={`w-screen md:w-[20%] absolute top-25 md:top-16 right-0 ${chat?" md:right-[30%]":"md:right-15"} rounded-2xl z-11 bg-white shadow-lg`}>
          <Participants existingClients={existingClientsRef.current} />
        </div>
      )}
    </div>
  );
}
