"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-2xl ml-140 mt-60">Loading...</p>;
  }

  return (
    <div>
      {session ? (
        <>
          <p className="bg-black text-white text-xl rounded-2xl p-2 w-60 ml-40 my-10">Welcome, {session.user?.name}</p>
          <button onClick={() => router.push("/choice")}
            className="bg-black text-white text-xl rounded-2xl p-2 w-20 ml-40 my-10 cursor-pointer hover:bg-black/80">
            Room</button>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-black text-white text-xl rounded-2xl p-2 w-40 ml-5 my-10 cursor-pointer hover:bg-black/80">
            Sign Out
          </button>
        </>
      ) : (
        <button onClick={() => signIn(undefined, { callbackUrl: "/check" })}
          className="bg-black text-white text-xl rounded-2xl p-2 w-20 mb-5 cursor-pointer hover:bg-black/80">
          Join Now
        </button>
      )}
    </div>
  );
}
