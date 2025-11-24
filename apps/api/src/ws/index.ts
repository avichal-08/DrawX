import { WebSocketServer, WebSocket } from "ws";
import crypto from "crypto";

export function WebSkt(server: any) {
  const wss = new WebSocketServer({ server });

  const clients = new Map<string, { socket: WebSocket; roomId: string | null; clientId: string; name: string | null; email: string | null; }>();
  const rooms = new Map<string, Set<string>>();

  wss.on("connection", (socket) => {
    const clientId = crypto.randomUUID();
    clients.set(clientId, { socket, roomId: null, clientId, name: null, email: null });

    console.log(`Client connected: ${clientId}`);

    socket.on("message", (msg) => {
      try {
        const { type, roomId, data, name, email } = JSON.parse(msg.toString());
        const client = clients.get(clientId);
        if (!client) return;

        switch (type) {
          case "join-room":
            if (!rooms.has(roomId))
              rooms.set(roomId, new Set());

            client.roomId = roomId;
            client.name = name;
            client.email = email;

            const room = rooms.get(roomId);

            if (room) {
              room.add(clientId);
            }

            var existingClients = [];
            if (room) {
              for (const id of room) {
                const c = clients.get(id);
                if (c && c.socket.readyState === WebSocket.OPEN) {
                  const name = c.name;
                  const email = c.email;
                  existingClients.push({
                    name,
                    email
                  });
                }
              }
            }

            if (room) {
              for (const id of room) {
                if (id !== clientId) {
                  const c = clients.get(id);
                  if (c && c.socket.readyState === WebSocket.OPEN) {
                    c.socket.send(JSON.stringify({
                      type: "room-joined",
                      name: client.name,
                      email: client.email,
                      existingClients
                    }));
                  }
                }
                else {
                  const c = clients.get(id);
                  if (c && c.socket.readyState === WebSocket.OPEN) {
                    c.socket.send(JSON.stringify({
                      type: "existing-client",
                      existingClients
                    }));
                  }
                }
              }
            }
            break;

          case "remove-user":

            const roomAllClients = rooms.get(client.roomId as string);
            if (roomAllClients) {
              for (const id of roomAllClients) {
                if (id === clientId) continue;
                const c = clients.get(id);
                if (c && c.socket.readyState === WebSocket.OPEN) {
                  c.socket.send(JSON.stringify({ type, data }));
                }
              }
            }
            break;
          case "draw-update":
          case "chat-update":
          case "erase-update":

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
        }
      } catch (err) {
        console.log("Error parsing message:", err);
      }
    });

    socket.on("close", () => {
      const client = clients.get(clientId);
      const roomID = client?.roomId;
      const room = rooms.get(roomID as string);
      clients.delete(clientId);

      var existingClients = [];
      if (room) {
        for (const id of room) {
          const c = clients.get(id);
          if (c && c.socket.readyState === WebSocket.OPEN) {
            const name = c.name;
            const email = c.email;
            existingClients.push({
              name,
              email
            });
          }
        }
      }

      if (room && client) {
        for (const id of room) {
          const c = clients.get(id);
          if (c && c.socket.readyState === WebSocket.OPEN) {
            c.socket.send(JSON.stringify({
              type: "room-left",
              name: client.name,
              email: client.email,
              existingClients
            }));
          }
        }
      }



      const roomClients = rooms.get(roomID as string);
      if (roomClients) {
        roomClients.delete(clientId);
        if (roomClients.size === 0) rooms.delete(roomID as string);
      }

      console.log(`Client disconnected: ${clientId}`);
    });
  });
}
