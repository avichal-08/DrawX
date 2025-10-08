"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";

export default function Create() {
  const { data: session, status } = useSession();
  const ID=session?.user.id;
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState('');
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if(!nameRef)
      return;
    setLoading(true);
    setError("");

    try{
      const res = await axios.post("/api/create-room",{
        name: nameRef.current?.value,
        adminID: ID
      });
      setSlug(res.data.roomSlug);
    }catch(error){
      setError("Something went wrong!! Please Try again");
      console.log(error);
    }finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Failed to copy: ", err);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  else if (status === "authenticated") {
    return (
      <div>
        <input type="text" ref={nameRef} placeholder="Enter Name"
          className="bg-black/10 text-xl rounded-2xl p-2 w-40 ml-5 my-10 "
        />
        <button onClick={handleSubmit}
          className="bg-black text-white text-xl rounded-2xl p-2 w-40 ml-5 my-10 cursor-pointer hover:bg-black/80">
            {loading?"Creating....":"Create"}
        </button>
        {slug&&
          <p className="bg-black text-white text-xl rounded-2xl p-2 w-60 ml-40 my-10">
            Room Created: {slug}
          </p>
        }
        {slug&&
          <button onClick={copyToClipboard}
            className="bg-black text-white text-xl rounded-2xl p-2 w-40 ml-5 my-10 cursor-pointer hover:bg-black/80">
              {copied ? "Copied!" : "Copy"}
          </button>
        }
        {slug&&
          <button onClick={()=>router.push(`/room/${slug}`)}>Start Room</button>
        }
        {error&&
          <p className="bg-black text-white text-xl rounded-2xl p-2 w-60 ml-40 my-10">
            {error}
          </p>
        }
      </div>
    )
  }
}