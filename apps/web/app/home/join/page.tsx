"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";
import { Loader } from "@repo/ui/loader";

export default function Join() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const slugRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!slugRef.current?.value.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/join-room", {
        slug: slugRef.current.value,
      });

      if (res.data.found) {
        router.push(`/room/${slugRef.current.value}`);
      } else {
        setError("Room not found. Check the slug and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="flex items-center justify-center mt-[20%]"><Loader/></div>;

  if (status !== "authenticated") router.push("/");

  const name = session?.user?.name;

  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col relative">
      <div className="flex justify-between items-center border-b border-b-white bg-black h-fit py-4 px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            DrawX
          </span>
        </div>
        <div className="text-white text-xl md:text-2xl font-semibold">
          <span>{name}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center flex-grow">
        <div className="bg-black text-white rounded-2xl p-6 w-80 md:w-96 text-center shadow-lg hover:bg-black/80 transition">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            Join A Room
          </h1>
          <p className="text-sm text-gray-300 mb-6">
            Enter the room slug shared with you. You’ll be able to collaborate
            in real-time once inside.
          </p>

          <input
            type="text"
            ref={slugRef}
            placeholder="Enter room slug"
            className="bg-white/10 text-white text-lg rounded-xl p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white text-lg font-semibold rounded-xl p-2 w-full hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Room"}
          </button>

          {error && (
            <p className="bg-red-600 text-white text-sm rounded-xl mt-4 p-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
