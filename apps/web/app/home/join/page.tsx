"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";
import { Loader } from "@repo/ui/loader";
import { FaUsers, FaArrowRight } from "react-icons/fa";

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

  if (status === "loading")
    return (
      <div className="flex items-center justify-center mt-[20%]">
        <Loader />
      </div>
    );

  if (status !== "authenticated") router.push("/");

  return (
    <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 min-h-screen flex flex-col relative">
      <header className="border-b border-orange-500/20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              DrawX
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl p-8 shadow-2xl shadow-orange-500/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />

          <div className="relative text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
              <FaUsers className="text-white text-2xl" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Join a{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Room
              </span>
            </h1>
            <p className="text-neutral-400 mb-8 text-sm">
              Enter the unique room slug shared with you to start collaborating
              in real-time.
            </p>

            <input
              type="text"
              ref={slugRef}
              placeholder="Enter room slug"
              className="bg-white/10 text-white text-lg rounded-xl p-3 w-full mb-5 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-orange-500/10"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer bg-gradient-to-r from-orange-500 to-amber-600 text-white text-lg font-semibold rounded-xl p-3 w-full hover:scale-[1.02] transition-transform disabled:opacity-50 shadow-lg shadow-orange-500/30"
            >
              {loading ? "Joining..." : "Join Room"}
            </button>

            {error && (
              <p className="bg-red-600/80 text-white text-sm rounded-xl mt-6 p-2 border border-red-500/30">
                {error}
              </p>
            )}

            <p className="text-neutral-500 text-sm mt-8">
              Don't have a room yet?{" "}
              <button
                onClick={() => router.push("/home/create")}
                className="text-orange-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                Create One <FaArrowRight className="text-xs" />
              </button>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 px-6 border-t border-orange-500/20">
        <div className="max-w-7xl mx-auto text-center text-neutral-500 text-sm">
          Collaborative drawing made simple
        </div>
      </footer>
    </div>
  );
}
