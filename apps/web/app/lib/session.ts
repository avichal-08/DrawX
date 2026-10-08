import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "./auth";

export type SessionUser = { id: string; email: string; name: string };

/** Returns the signed-in user from the server-side session, or null. */
export async function requireUser(): Promise<SessionUser | null> {
  const session = await getServerSession(NEXT_AUTH);
  const u = session?.user;
  if (!u?.id || !u.email) return null;
  return { id: u.id, email: u.email, name: u.name ?? u.email };
}
