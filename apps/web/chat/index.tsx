"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaArrowCircleUp } from "react-icons/fa";

type ChatProps = {
  mode: "light" | "dark";
  socket: WebSocket | null;
};

type ChatMessage = {
  message: string;
  email?: string;
  name?: string
};

export const Chat = ({ mode, socket }: ChatProps) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     bottomRef.current?.scrollIntoView({behavior:'smooth'});

    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "chat-update") {
        setMessages((prev) => [...prev, msg.data]);
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

    setMessages((prev) => [...prev, sendData]);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "chat-update", data: sendData }));
    }

    inputRef.current!.value = "";
  };

  return (
    <div
      className={`${mode === "light" ? "bg-white border-2" : "bg-gray-900/40 text-white"}
        w-90 h-screen flex flex-col px-2`}
    >
      <div className="flex-grow overflow-y-auto space-y-2 p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.email === session?.user?.email
                ? "text-right text-blue-400"
                : "text-left text-gray-300"
            }`}
          >
            <span className={`${mode === "light"?"text-black":""} text-xs opacity-70`}>{msg.name}</span>
            <div className={`${mode === "light"?"text-black":""} text-xl`}>{msg.message}</div>
          </div>
        ))}
      </div>
      <div ref={bottomRef}></div>

      <div className="flex items-center gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="Message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className={`${
            mode === "light" ? "bg-gray-300" : "bg-white text-black"
          } h-10 p-2 flex-grow rounded-2xl`}
        />
        <div className="cursor-pointer" onClick={sendMessage}>
          <FaArrowCircleUp size={25} />
        </div>
      </div>
    </div>
  );
};
