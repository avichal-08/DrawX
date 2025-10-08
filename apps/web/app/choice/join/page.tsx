"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";

export default function Join() {
  const { status } = useSession();
  const router = useRouter();
  const slugRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if(!slugRef)
      return;
    setLoading(true);
    setError("");

    try{
      const res = await axios.post("/api/join-room",{
        slug:slugRef.current?.value
      });
      if(res.data.found){
        router.push(`/room/${slugRef.current?.value}`)
      }
    }catch(error){
      setError("Something went wrong!! Please Try again");
      console.log(error);
    }finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  else if (status === "authenticated") {
    return (
      <div>
        <input type="text" ref={slugRef} placeholder="Enter Slug"
          className="bg-black/10 text-xl rounded-2xl p-2 w-40 ml-5 my-10 "
        />
        <button onClick={handleSubmit}
          className="bg-black text-white text-xl rounded-2xl p-2 w-40 ml-5 my-10 cursor-pointer hover:bg-black/80">
            {loading?"Joining....":"Join"}
        </button>
        {error&&
          <p className="bg-black text-white text-xl rounded-2xl p-2 w-60 ml-40 my-10">
            {error}
          </p>
        }
      </div>
    )
  }
}