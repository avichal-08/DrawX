"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";
import { Loader } from "@repo/ui/loader";

export default function Create() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const ID = session?.user?.id;

  const handleSubmit = async () => {
    if (!nameRef.current?.value.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/create-room", {
        name: nameRef.current.value,
        adminID: ID,
      });
      setSlug(res.data.roomSlug);
    } catch (err) {
      setError("Something went wrong! Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (status === "loading") {
    return (
    <div className="flex items-center justify-center mt-[20%]">
      <Loader/>
    </div>
  )};

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
          <h1 className="text-3xl cursor-pointer font-bold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            Create A Room
          </h1>
          <p className="text-sm text-gray-300 mb-6">
            Enter your room name below. You’ll be the admin of this room and
            have exclusive access later.
          </p>

          <input
            type="text"
            ref={nameRef}
            placeholder="Enter room name"
            className="bg-white/10 text-white text-lg rounded-xl p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer bg-gradient-to-r from-orange-500 to-amber-600 text-white text-lg font-semibold rounded-xl p-2 w-full hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>

          {slug && (
            <div className="mt-6 bg-neutral-800 p-4 rounded-xl">
              <p className="text-lg font-semibold text-white">
                Room Created
              </p>
              <p className="text-orange-400 font-mono">{slug}</p>

              <div className="flex gap-3 justify-center mt-3">
                <button
                  onClick={copyToClipboard}
                  className="cursor-pointer bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => router.push(`/room/${slug}`)}
                  className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl hover:bg-gray-200 transition"
                >
                  Start Room
                </button>
              </div>
            </div>
          )}

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
