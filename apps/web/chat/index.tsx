"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaArrowCircleUp } from "react-icons/fa";
import type { ChatMessage } from "./types";
import axios from "axios";

type ChatProps = {
  mode: "light" | "dark";
  socket: WebSocket | null;
  slug: string
};

export const Chat = ({ mode, socket, slug }: ChatProps) => {
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchChat = async () => {
      const res = await axios.get(`/api/chat/get?slug=${slug}`);
      const dbChat = res.data.filteredChat;
      setCurrentMessages(dbChat);
    };
    fetchChat();
  }, [slug]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [currentMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "chat-update") {
        setCurrentMessages((prev) => [...prev,msg.data])
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  const sendMessage = () => {
    const message = inputRef.current?.value?.trim();
    if (!message) return;
 
    const sendData = {
      message,
      email: session?.user?.email || "Anonymous",
      name: session?.user?.name || "Anonymous"
    };
    
    setCurrentMessages((prev) => [...prev,sendData])
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "chat-update", data: sendData }));
    }

    sendChatDB(sendData);

    inputRef.current!.value = "";
  };

  const sendChatDB = async (sendData: ChatMessage) => {
    await axios.post('/api/chat/save',{
      slug,
      message: sendData.message,
      senderName: sendData.name,
      senderEmail: sendData.email
    });
  }

  return (
    <div
      className={`${mode === "light" ? "bg-slate-100" : "bg-neutral-900 text-white"}
        w-90 h-screen flex flex-col px-2`}
    >
      <div className="flex-grow overflow-y-scroll scrollbar-hide space-y-2 p-2">
        {currentMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.email === session?.user?.email
                ? "text-right text-blue-400"
                : "text-left text-gray-300"
            }`}
          >
            <span className={`${mode === "light"?"text-black":""} text-xs opacity-70 break-all [overflow-wrap:anywhere]`}>{msg.name}</span>
            <div className={`${mode === "light"?"text-black":""} text-xl break-all [overflow-wrap:anywhere]`}>{msg.message}</div>
          </div>
        ))}
      <div ref={bottomRef}></div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="Message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className={`${mode === "light" ? "bg-gray-300" : "bg-white text-black"} h-10 p-2 flex-grow rounded-xl focus:outline-none`}
        />
        <div className="cursor-pointer" onClick={sendMessage}>
          <FaArrowCircleUp size={25} />
        </div>
      </div>
    </div>
  );
};
