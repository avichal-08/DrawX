"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "@repo/ui/loader";
import { 
  History, 
  Search, 
  Plus, 
  ChevronLeft, 
  Pencil, 
  Calendar, 
  ArrowRight,
  Inbox,
  Layout
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

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

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  if (status === "loading" || loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950">
        <Loader />
      </div>
    );

  if (status !== "authenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col relative text-neutral-200 overflow-x-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
              <Pencil className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              DrawX
            </span>
          </Link>
          
          <Link 
            href="/home" 
            className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-black uppercase tracking-widest">
              <Layout className="w-3 h-3" />
              Archive
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Room <span className="text-orange-500 italic">History</span>
            </h1>
            <p className="text-neutral-500 text-sm font-medium">
              Manage and revisit all the collaborative sessions you've created.
            </p>
          </div>

          <button
            onClick={() => router.push("/home/create")}
            className="h-12 px-6 bg-white text-black hover:bg-orange-500 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-xl"
          >
            <Plus className="w-5 h-5" />
            New Room
          </button>
        </div>

        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Search rooms by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all placeholder:text-neutral-700 font-medium"
          />
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <motion.div
                  key={room.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/room/${room.slug}`)}
                  className="group relative bg-white/5 border border-white/5 hover:border-orange-500/30 rounded-2xl p-5 cursor-pointer transition-all hover:bg-white/[0.07] flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-mono text-neutral-500 bg-black/30 px-2 py-0.5 rounded border border-white/5">
                          {room.slug}
                        </span>
                        <div className="flex items-center gap-1 text-neutral-600 text-[10px] font-bold uppercase tracking-tighter">
                          <Calendar className="w-3 h-3" />
                          {room.createdAt ? new Date(room.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit"
                          }) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                       <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Rejoin Room</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 px-6 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]"
              >
                <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-4 text-neutral-700">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">No rooms found</h3>
                <p className="text-neutral-500 text-sm mt-1 mb-6">
                  {search ? "Try adjusting your search terms." : "You haven't created any drawing rooms yet."}
                </p>
                <button
                  onClick={() => router.push("/home/create")}
                  className="text-orange-500 font-bold hover:underline flex items-center gap-2"
                >
                  Create your first room <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-12 px-6 text-center">
        <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.3em]">
          End-to-End Archive Management
        </p>
      </footer>
    </div>
  );
}