"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "@repo/ui/loader";
import axios from "axios";

export default function AllRooms() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (session) getRooms();
  }, [session]);

  const getRooms = async () => {
    try {
      const res = await axios.post("/api/get-rooms", {
        adminId: session?.user?.id,
      });
      setRooms(res.data || []);
    } catch (error) {
      console.error("Error while getting rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  if (status !== "authenticated") {
    router.push("/");
  }

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 min-h-screen flex flex-col">
      <div className="flex justify-between items-center border-b border-orange-500/20 bg-black/40 backdrop-blur-sm py-4 px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            DrawX
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center flex-grow px-6 py-10">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 shadow-2xl shadow-orange-500/10 backdrop-blur-sm text-white rounded-2xl p-8 w-full max-w-2xl ">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-4 text-center">
            All Your Rooms
          </h1>
          <p className="text-sm text-gray-300 mb-6 text-center">
            Access rooms you’ve created. Click to jump right back in.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-white/10 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
            />
            <button
              onClick={() => router.push("/create")}
              className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-xl px-5 py-3 hover:scale-105 transition-transform"
            >
              + Create Room
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <div
                  key={room.slug}
                  onClick={() => router.push(`/room/${room.slug}`)}
                  className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl p-4 flex justify-between items-center transition-all border border-transparent hover:border-orange-500 hover:shadow-[0_0_15px_rgba(255,166,0,0.3)]"
                >
                  <div>
                    <p className="font-semibold text-lg">{room.name}</p>
                    <p className="text-sm text-gray-400">{room.slug}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {room.createdAt
                      ? `Created ${new Date(
                        room.createdAt
                      ).toLocaleDateString()}`
                      : ""}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-10">
                No rooms found.{" "}
                <span
                  onClick={() => router.push("/create")}
                  className="text-amber-500 hover:underline cursor-pointer"
                >
                  Create one now →
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}