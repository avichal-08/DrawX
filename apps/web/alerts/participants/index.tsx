"use client"

import { useRef } from "react";

import type { existingClients } from "./types"

export const Participants = ({ existingClients, isAdmin, adminEmail, socket }: { existingClients: existingClients[], isAdmin: boolean, adminEmail: string | null, socket: WebSocket | null; }) => {

    const removeEmailRef = useRef<string | null>(null);

    const removeUser = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "remove-user",
                data: {
                    email: removeEmailRef.current
                }
            }));
        }
        const index = existingClients.findIndex((c) => c.email === removeEmailRef.current);
        if (index !== -1) {
            existingClients.splice(index, 1);
        }
    }

    const handleWS = (event: MessageEvent) => {
        if (!socket || !event || !event.data) return;

        try {
            const msg = JSON.parse(event.data);

            if (!msg || typeof msg !== "object") return;

            if (msg.type === "remove-user") {
                const email = msg.data.email;
                const index = existingClients.findIndex((c) => c.email === email);
                if (index !== -1) {
                    existingClients.splice(index, 1);
                }
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
            return;
        }
    };

    if (socket) {
        socket.addEventListener("message", handleWS);
    }

    return (
        <div className="bg-white rounded-2xl w-fit p-1 overflow-y-scroll scrollbar-hide">
            {existingClients.map((client) => {
                return (
                    <div className="bg-slate-200 w-full flex gap-4 items-center justify-center p-2 rounded-2xl mb-1">
                        <div>
                            <div className="text-xl">
                                {client.name}
                            </div>
                            <div className="text-2xs opacity-60">
                                {client.email}
                            </div>
                        </div>
                        {isAdmin && !(adminEmail === client.email) && (
                            <button onClick={() => {
                                removeEmailRef.current = client.email;
                                removeUser();
                            }
                            }
                                className="bg-red-600 rounded-lg p-1 cursor-pointer text-white text-xl hover:bg-red-500 hover:scale-105 transition-transform">
                                Remove
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
    )
}