"use client";
import { signIn,signOut,useSession } from "next-auth/react";
import { Button } from "@repo/ui/button";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      <p>ID: {session?.user.id}</p>
      <p>Name: {session?.user.name}</p>
      <p>Email: {session?.user.email}</p>
      <button onClick={()=>{signIn()}}>Login With Google</button>
      <button onClick={()=>{signOut()}}>SignOut</button>
    </div>
  );
}
