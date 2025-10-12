"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "@repo/ui/loader";
import axios from "axios";

export default function AllRooms() {
    
  const router = useRouter();
  const roomsRef = useRef([]);
  const userIdRef = useRef<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session){
      userIdRef.current = session?.user.id;
      getRooms();
    }
  },[session])

  const getRooms = async () => {
    try{
      const res = await axios.post("/api/get-rooms", {
        adminId: userIdRef.current
      });
      roomsRef.current = res.data;
      setLoading(false);
    }catch(error) {
      console.log(`Error while getting room: ${error}`)
    }
  }
  
  const name = session?.user.name;

  if (status === "loading") {
    return (
    <div className="flex items-center justify-center mt-[20%]">
      <Loader/>
    </div>
  )};

  if (status !== "authenticated") router.push("/");

  if (loading) {
    <div className="flex items-center justify-center mt-[20%]">
      <Loader/>
    </div>
  }

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

      <div className="flex flex-col justify-center items-center flex-grow px-6">
        <div className="bg-black text-white rounded-2xl p-6 w-full md:w-[600px] text-center shadow-lg hover:bg-black/80 transition">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            All Your Rooms
          </h1>
          <p className="text-sm text-gray-300 mb-6">
            Access all rooms where you were the admin. Click any to reopen and continue your session.
          </p>

          <div className="flex flex-col items-center gap-3">
            {roomsRef.current?.length > 0 ? (
              roomsRef.current.map((room: any) => (
                <div
                  key={room.slug}
                  onClick={() => router.push(`/room/${room.slug}`)}
                  className="w-full cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white text-lg rounded-xl p-3 flex justify-between items-center transition-all"
                >
                  <span className="font-semibold">{room.name}</span>
                  <span className="text-sm text-gray-400">{room.slug}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-lg mt-6">
                No rooms found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
