#  DrawX — Real-time Collaborative Whiteboard

**DrawX** is a real-time collaborative whiteboard app — think *Excalidraw + Chat Application.*  
Create, draw, chat, and collaborate with others in the same room — all powered by Next.js, WebSockets, and a lightning-fast backend.

---

##  Features

-  **Real-time Collaboration** — Multiple users can draw and edit simultaneously.  
-  **Room-based Sessions** — Create or join rooms using unique slugs.  
-  **Persistent Rooms** — Rooms are stored in the database so users can rejoin anytime.   
-  **Live Chat** — Integrated chat system to communicate with collaborators.  
-  **Auth System** — Secure authentication powered by NextAuth.  
-  **Modern UI** — Built with TailwindCSS and a focus on minimal, distraction-free design.  
-  **Scalable Architecture** — Organized with Turborepo and Prisma ORM for maintainability.

---

##  Tech Stack

| Layer | Tech |
|-------|------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) |
| **Real-time** | [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) |
| **Styling** | [TailwindCSS](https://tailwindcss.com/) |
| **Monorepo** | [Turborepo](https://turbo.build/repo) |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/avichal-08/drawx.git
cd drawx
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

##### Copy `.env.example` to `.env` (root) and fill it in:
```bash
cp .env.example .env
```

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | web, db | Postgres connection string |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_ID`, `GOOGLE_SECRET` | web | Google sign-in |
| `WS_TOKEN_SECRET` | web **and** api | Must be identical. The web app signs a 5-minute ticket (`/api/ws-token`) and the WebSocket server verifies it. |
| `NEXT_PUBLIC_WS_URL` | web | e.g. `ws://localhost:3000` locally, `wss://…` in production. **Inlined at build time**: redeploy the web app after changing it. A page served over HTTPS can only open `wss://` sockets. |
| `ALLOWED_ORIGINS` | api | Optional comma-separated Origin allow-list (trailing slashes and case are ignored) |

### 4. Setup the Database
##### Run Prisma migrations to initialize your database schema (inside packages/db):

```bash

pnpm prisma migrate dev --name "init"

```

### 5. Start the Development Server

##### Launch the app locally:
```bash

pnpm run dev

```

---

##  Security Model

- **Sign-in** is NextAuth (Google). Every Next.js API route reads the user from the server-side session; ids and emails in request bodies are never trusted.
- **WebSocket access** requires a short-lived ticket from `GET /api/ws-token?slug=…`. The ticket binds the user, the room and the admin role (looked up in the database) and is verified by the WebSocket server. Chat sender identity is stamped server-side, and only the room admin can remove users.
- **Persistence**: whoever draws or erases a stroke saves it (`useStrokePersistence`), so the board no longer depends on the admin being online.
- **Connection resilience**: the server pings every 25s (keeps proxies from idling connections out and reaps dead ones). The client reconnects with a fresh ticket and exponential backoff, re-syncs strokes it missed, and blocks drawing while offline instead of silently dropping shapes. It does not retry when it was removed from the room.
- **Server logs**: rejected connections are logged with the reason (`missing ticket`, `invalid or expired ticket`, `origin not allowed`), and a missing `WS_TOKEN_SECRET` is reported at startup.
- **Limits**: 1 MiB max WebSocket message, 50 messages/second per connection, structural validation of shapes on both the socket and the save API.

##  Testing

```bash
pnpm test          # api (WebSocket auth/relay) + web (eraser hit-testing, validation, ticket signing)
```

Requires Node 22+ (the web tests run TypeScript directly with `--experimental-strip-types`). CI runs the same on every push and pull request.

##  How It Works

- **Room Creation:** Users can create a new room with a unique slug.  
- **Room Validation:** If someone tries to access `/room/[slug]` directly, the app verifies if that room exists in the database.  
- **WebSocket Connection:** Once inside a room, users connect via WebSocket channels for real-time drawing and messaging.  
- **Sync & Persistence:** Changes are broadcast instantly to all connected clients and stored in database simultaneoulsy.  
- **Authentication:** Secure login with NextAuth ensures only verified users can join or create rooms.  

---

## Contributions

Pull requests are welcome!  
If you have a new idea, feature, or bug fix, open an issue or PR — collaboration is the whole spirit of DrawX.

**Development Workflow:**
1. Fork the repo  
2. Create a new branch (`feature/amazing-feature`)  
3. Commit your changes  
4. Push to your branch  
5. Open a PR 

---

## 🌟 Show Some Love

If you like **DrawX**, give it a ⭐ on GitHub!  
Because every star helps this project draw more attention 😉  

> _“Collaboration starts with a single line , make yours with DrawX.”_

