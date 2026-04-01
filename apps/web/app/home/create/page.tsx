"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "@repo/ui/loader";
import { 
  Plus, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  Pencil, 
  ChevronLeft,
  Sparkles,
  Link as LinkIcon,
  Check
} from "lucide-react";
import Link from "next/link";

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
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px]" />
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 blur-[60px]" />

            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Plus className="text-orange-500 w-8 h-8" />
              </div>

              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                New <span className="text-orange-500 italic">Canvas</span>
              </h1>
              <p className="text-neutral-500 mb-10 text-sm font-medium">
                Set a name for your collaborative room. You'll have full admin control over this space.
              </p>

              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    ref={nameRef}
                    disabled={!!slug}
                    placeholder="e.g. Design Sync"
                    className="w-full bg-neutral-900/50 text-white text-lg rounded-2xl px-5 py-4 border border-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all placeholder:text-neutral-700 disabled:opacity-50"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-orange-500/50 transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                {!slug && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-14 cursor-pointer bg-white text-black hover:bg-orange-500 hover:text-white text-lg font-black rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>Initialize Room <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                )}
              </div>

              <AnimatePresence>
                {slug && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                    className="text-left"
                  >
                    <div className="bg-neutral-950/50 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-3 opacity-10">
                          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                       </div>
                       
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-3 block">
                          Room ID Ready
                       </label>
                       
                       <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5 mb-6">
                         <LinkIcon className="w-4 h-4 text-neutral-500 shrink-0" />
                         <p className="text-orange-400 font-mono text-sm truncate flex-grow">
                           {slug}
                         </p>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                         <button
                           onClick={copyToClipboard}
                           className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 px-4 rounded-xl border border-white/10 transition-all active:scale-95"
                         >
                           {copied ? (
                             <><Check className="w-4 h-4 text-emerald-500" /> Copied</>
                           ) : (
                             <><Copy className="w-4 h-4" /> Copy ID</>
                           )}
                         </button>

                         <button
                           onClick={() => router.push(`/room/${slug}`)}
                           className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                         >
                           Enter Room <ArrowRight className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="py-8 px-6 text-center">
        <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.3em]">
          End-to-End Canvas Synchronization Active
        </p>
      </footer>
    </div>
  );
}