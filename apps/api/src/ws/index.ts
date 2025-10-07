import { WebSocketServer,  WebSocket } from "ws";
import crypto from "crypto";

export function WebSkt(server: any) {
  const wss = new WebSocketServer({ server });

  const clients = new Map<string, { socket: WebSocket; roomId: string | null; clientId: string }>();
  const rooms = new Map<string, Set<string>>();

  wss.on("connection", (socket) => {
    const clientId = crypto.randomUUID();
    clients.set(clientId, { socket, roomId: null, clientId });

    console.log(`Client connected: ${clientId}`);

    socket.on("message", (msg) => {
      try {
        const { type, roomId, data } = JSON.parse(msg.toString());
        const client = clients.get(clientId);
        if (!client) return;

        switch (type) {
          case "join-room":
            if (!rooms.has(roomId)) 
              rooms.set(roomId, new Set());

            const room = rooms.get(roomId);
            if(room){
              room.add(clientId);
            }

            client.roomId = roomId;
            socket.send(JSON.stringify({ type: "room-joined" }));
            console.log(`Client ${clientId} joined room ${roomId}`);
            break;

          case "draw-update":
          case "chat-update":

            const roomClients = rooms.get(client.roomId as string);
            if (roomClients) {
              for (const id of roomClients) {
                if (id === clientId) continue;
                const c = clients.get(id);
                if (c && c.socket.readyState === WebSocket.OPEN) {
                  c.socket.send(JSON.stringify({ type, data }));
                }
              }
            }
            break;

          default:
            console.log("Unknown message type:", type);
        }
      } catch (err) {
        console.log("Error parsing message:", err);
      }
    });

    socket.on("close", () => {
      const roomID = clients.get(clientId)?.roomId
      clients.delete(clientId);

      const roomClients = rooms.get(roomID as string);
      if (roomClients) {
        roomClients.delete(clientId);
        if (roomClients.size === 0) rooms.delete(roomID as string);
      }

      console.log(`Client disconnected: ${clientId}`);
    });
  });
}
