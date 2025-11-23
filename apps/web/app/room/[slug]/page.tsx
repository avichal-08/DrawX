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
import { GoPeople } from "react-icons/go";
import { LuEraser } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";
import { MdOutlineShare } from "react-icons/md";

import { initDraw } from "../../../draw";
import type { ShapeDetail } from "../../../draw/types";
import { Chat } from "../../../chat";
import { useDebouncedStrokeSave } from "../../../draw/dbFunctions/strokeSave";
import { useEraseStroke } from "../../../draw/dbFunctions/eraseStroke";
import { Joined } from "../../../alerts/joined";
import { Left } from "../../../alerts/left";
import type { existingClients } from "../../../alerts/participants/types";
import { Participants } from "../../../alerts/participants";
import { handleDownload } from "../../../draw/download";
import { Loader } from "@repo/ui/loader";
import { Share } from "@repo/ui/share";
import { Removed } from "@repo/ui/removed";

export default function Whiteboard() {
  const params = useParams();
  const roomId = params.slug;
  const router = useRouter();
  const { data: session, status } = useSession();

  const adminEmailRef = useRef<string>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const existingClientsRef = useRef<existingClients[]>([]);
  const shapesRef = useRef<ShapeDetail[]>([]);
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
  const [removed, setRemoved] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [chat, setChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validRoom, setValidRoom] = useState(false);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [shapeMode, setShapeMode] = useState<"rect" | "circle" | "line" | "text" | "pan" | "arrow" | "pencil" | "eraser">("rect");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "png" | "jpg">("jpg");
  const [download, setDownload] = useState<boolean>(false);
  const [share, setShare] = useState<boolean>(false);

  // const socketUrl = process.env.NEXT_WS_URL;

  const saveStroke = useDebouncedStrokeSave(roomId as string, isAdmin);
  const eraseStroke = useEraseStroke(roomId as string, isAdmin);

  const RoomCheck = async () => {
    try {
      const res = await axios.post("/api/join-room", { slug: roomId });
      if (!res.data.found)
        router.push("/home");
      else {
        setValidRoom(true);
        if (session?.user.email === res.data.adminEmail) {
          adminEmailRef.current = res.data.adminEmail;
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.log("Something went wrong in room's page.tsx");
    }
  };

  useEffect(() => {
    RoomCheck();
  }, [roomId, session]);

  useEffect(() => {
    if (status !== "authenticated" || socket || !validRoom) return;
    const ws = new WebSocket("wss://drawx-t3sa.onrender.com");

    ws.onopen = () => {
      const email = session?.user.email;
      const name = session?.user.name;
      if (!email || !name) return;
      ws.send(
        JSON.stringify({ type: "join-room", roomId, data: "", email, name })
      );
      setLoading(false);
      console.log("WebSocket connected");
    };

    ws.onmessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "not-allowed") {
        router.push("/home");
      }
      if (msg.type === "room-joined") {
        joinedRef.current = { email: msg.email, name: msg.name };
        existingClientsRef.current = msg.existingClients;
        setJoined(true);
        if (joinedTimeout.current) clearTimeout(joinedTimeout.current);
        joinedTimeout.current = setTimeout(() => setJoined(false), 2000);
      }
      if (msg.type === "existing-client")
        existingClientsRef.current = msg.existingClients;
      if (msg.type === "remove-user") {
        const email = msg.data.email;
        if (email === session?.user.email) {
          setRemoved(true);
          setTimeout(() => router.push("/home"), 2000);
        }
      }
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
  }, [status, session, roomId, validRoom]);

  useEffect(() => {
    const fetchStrokes = async () => {
      if (!validRoom)
        return;
      try {
        const res = await axios.get(`/api/strokes/get?slug=${roomId}`);
        shapesRef.current = res.data.strokesDetail;
      } catch (error) {
        console.log(`Error fetching strokes: ${error}`);
      }
    };
    fetchStrokes();
  }, [validRoom]);

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
      eraseStroke,
      panStartX,
      panStartY,
      offsetX,
      offsetY
    );

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (cleanup)
        cleanup();
    };
  }, [mode, shapeMode, socket, isAdmin, loading]);

  if (!validRoom) return (
    <div className="flex justify-center items-center gap-2 text-xl md:text-2xl text-white bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 min-h-screen">
      <p>Checking Room Code Validity</p>
      <Loader />
    </div>
  )
  if (status === "loading" || loading) return <div className="flex justify-center items-center"><Loader /></div>;
  if (status === "unauthenticated") router.push("/");

  return (
    <div className="relative w-full h-screen overflow-hidden ">
      <div className={`absolute top-2 right-2 flex flex-col gap-2 z-20`}>
        <button
          className={`p-2 rounded-full cursor-pointer ${mode === "dark" ? "text-white" : "text-black"}`}
          onClick={() => setChat(!chat)}
        >
          <AiOutlineMessage size={24} />
        </button>
        <button
          className={`p-2 rounded-full ${mode === "dark" ? "text-white" : "text-black"} cursor-pointer`}
          onClick={() => setParticipants(!participants)}
        >
          <GoPeople size={24} />
        </button>
        <button
          className={`p-2 rounded-full ${mode === "dark" ? "text-white" : "text-black"} cursor-pointer`}
          onClick={() => setDownload(!download)}
        >
          <FiDownload size={24} />
        </button>
        <button
          className={`p-2 rounded-full ${mode === "dark" ? "text-white" : "text-black"} cursor-pointer`}
          onClick={() => setShare(!share)}
        >
          <MdOutlineShare size={24} />
        </button>
      </div>

      <div
        className={`fixed bottom-4 ${chat ? "right-1/2" : "left-1/2 -translate-x-1/2"} flex items-center gap-2 sm:gap-3 bg-gray-300 border-2 border-gray-400 rounded-2xl px-2 py-1 sm:px-4 sm:py-2 shadow-lg z-1`}
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
          { key: "eraser", icon: <LuEraser size={22} /> },
        ].map((btn) => (
          <button
            key={btn.key}
            className={`rounded-xl px-3 py-1 cursor-pointer ${shapeMode === btn.key ? "bg-black text-white" : "text-black"
              }`}
            onClick={() => setShapeMode(btn.key as any)}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      <canvas id="draw-canvas" ref={canvasRef} className="w-full h-full" onClick={() => {
        setDownload(false)
        setParticipants(false)
        setShare(false)
      }}
      />

      {chat && (
        <div className={`absolute w-screen ${mode === "dark" ? "bg-slate-700" : ""}  top-0 right-0 md:w-[30%] h-full shadow-lg z-2`}>
          <Chat mode={mode} socket={socket} slug={roomId as string} />
        </div>
      )}
      {joined && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <Joined name={joinedRef.current?.name!} email={joinedRef.current?.email!} />
        </div>
      )}
      {left && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-19">
          <Left name={leftRef.current?.name!} email={leftRef.current?.email!} />
        </div>
      )}
      {removed && (
        <div className={`absolute z-10 ${chat ? "top-1/2 right-1/2 -translate-y-1/2" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}`}>
          <Removed />
        </div>
      )}
      {participants && (
        <div className={`w-screen md:w-[20%] absolute top-25 md:top-16 right-0 ${chat ? " md:right-[30%]" : "md:right-25"} rounded-2xl z-11 bg-white shadow-lg`}>
          <Participants existingClients={existingClientsRef.current} isAdmin={isAdmin} adminEmail={adminEmailRef.current} socket={socket} />
        </div>
      )}

      {share && (
        <div className={`absolute z-10 ${chat ? "top-1/2 right-1/2 -translate-y-1/2" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}`}>
          <Share slug={roomId as string} />
        </div>
      )}

      {download && (
        <div className={`absolute z-11 w-fit flex flex-col justify-around items-center gap-4 p-8 bg-neutral-900 shadow-sm shadow-white  text-white rounded-xl ${chat ? "top-1/2 right-1/2 -translate-y-1/2" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}`}>
          <div className="font-semibold text-3xl">Export Drawing</div>
          <div className="text-xl">Choose Format:</div>
          <div className="flex justify-center items-center gap-3">
            <button
              className={`rounded-xl p-4 cursor-pointer ${downloadFormat === "pdf" ? "bg-slate-500/60" : ""} bg-neutral-800  hover:bg-slate-400 text-xl `}
              onClick={() => setDownloadFormat("pdf")}>
              PDF
            </button>
            <button
              className={`rounded-xl p-4 cursor-pointer ${downloadFormat === "png" ? "bg-slate-500/60" : ""} bg-neutral-800 hover:bg-slate-400 text-xl `}
              onClick={() => setDownloadFormat("png")}>
              PNG
            </button>
            <button className={`rounded-xl p-4 cursor-pointer ${downloadFormat === "jpg" ? "bg-slate-500/60" : ""} bg-neutral-800  hover:bg-slate-400 text-xl `}
              onClick={() => setDownloadFormat("jpg")}>
              JPG
            </button>
          </div>
          <div className={`flex justify-evenly items-center w-full rounded-xl p-2 bg-green-700 hover:bg-green-600 text-white text-2xl cursor-pointer`}
            onClick={() => handleDownload(downloadFormat)}>
            Download
            <FiDownload size={24} />
          </div>
        </div>
      )}
    </div>
  );
}
