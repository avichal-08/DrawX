"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Choice() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  else if (status === "authenticated") {
    return (
      <div>
        <button onClick={()=>router.push('/choice/create')}
          className="bg-black text-white text-xl rounded-2xl p-2 w-40 ml-5 my-10 cursor-pointer hover:bg-black/80">
            Create A Room
        </button>
        <button onClick={()=>router.push('/choice/join')}
          className="bg-black text-white text-xl rounded-2xl p-2 w-40 ml-5 my-10 cursor-pointer hover:bg-black/80">
            Join A Room
        </button>
      </div>
    )
  }

  else {
    router.push('/')
  }
}