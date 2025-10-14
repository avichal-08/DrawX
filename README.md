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
git clone https://github.com/<your-username>/DrawX.git
cd DrawX
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

#####  Create a .env file in the root directory and add the following:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/drawx"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

```
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

