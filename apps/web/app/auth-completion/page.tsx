import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../lib/auth";

// The old flow exchanged the NextAuth token for a cookie on the Express server.
// The WebSocket server now uses short-lived tickets from /api/ws-token instead,
// so this page only needs to route the user.
export default async function Check() {
  const session = await getServerSession(NEXT_AUTH);
  redirect(session ? "/home" : "/");
}
