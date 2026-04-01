"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader } from "@repo/ui/loader";
import { 
  Users, 
  ArrowRight, 
  Pencil, 
  ChevronLeft, 
  Hash, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function Join() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const slugRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const slugValue = slugRef.current?.value.trim();
    if (!slugValue) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/join-room", {
        slug: slugValue,
      });

      if (res.data.found) {
        router.push(`/room/${slugValue}`);
      } else {
        setError("We couldn't find that room. Check the ID and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950">
        <Loader />
      </div>
    );
  }

  if (status !== "authenticated") {
    router.push("/");
    return null;
  }

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col relative text-neutral-200 overflow-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px]" />
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
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-md w-full"
        >
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">

            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-600/10 blur-[60px]" />

            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Users className="text-orange-500 w-8 h-8" />
              </div>

              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                Enter <span className="text-orange-500 italic">Room</span>
              </h1>
              <p className="text-neutral-500 mb-10 text-sm font-medium">
                Paste the unique room ID below to join your team's live session.
              </p>

              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    ref={slugRef}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="e.g. creative-alpha-99"
                    className="w-full bg-neutral-900/50 text-white text-lg font-mono rounded-2xl pl-12 pr-5 py-4 border border-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all placeholder:text-neutral-700 placeholder:font-sans"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-orange-500/50 transition-colors">
                    <Hash className="w-5 h-5" />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 cursor-pointer bg-white text-black hover:bg-orange-500 hover:text-white text-lg font-black rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Join Session 
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-2 justify-center"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-neutral-500 text-sm font-medium">
                  Don't have a room ID?{" "}
                  <Link
                    href="/home/create"
                    className="text-orange-400 hover:text-orange-300 font-bold inline-flex items-center gap-1 transition-colors group/link"
                  >
                    Create One 
                    <Sparkles className="w-3.5 h-3.5 group-hover/link:rotate-12 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-8 px-6 text-center">
        <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.3em]">
          Secure Real-time Web Socket Tunnel Established
        </p>
      </footer>
    </div>
  );
}