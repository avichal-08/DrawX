import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NEXT_AUTH } from "../lib/auth";
import {
  ChevronRight,
  Plus,
  Users,
  History,
  LogOut,
  Pencil,
  LayoutDashboard,
  Sparkles
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(NEXT_AUTH);
  const name = session?.user?.name;

  if (!session) {
    redirect("/");
  }

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col relative text-neutral-200 selection:bg-orange-500/30 overflow-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform duration-300">
              <Pencil className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              DrawX
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-white/5 border border-white/10 pl-2 pr-4 py-1.5 rounded-full backdrop-blur-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-600 flex items-center justify-center text-xs font-bold border border-white/10">
                {name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">{name}</span>
                
              </div>
            </div>

            <Link
              href="/logout"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3" />
              Dashboard
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-tight">
              Welcome back, <br className="sm:hidden" />
              <span className="bg-gradient-to-b from-orange-400 to-amber-600 bg-clip-text text-transparent italic">
                {name}
              </span>
            </h1>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto leading-relaxed">
              Your creative hub is ready. Start a new session or pick up where you left off with your team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/home/create" className="group">
              <div className="relative h-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] hover:border-orange-500/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-600/10 blur-[50px] group-hover:bg-orange-600/20 transition-colors" />

                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Plus className="text-white w-7 h-7" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white flex items-center justify-between">
                    Create Room
                    <ChevronRight className="w-6 h-6 text-orange-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Launch a fresh canvas. You'll have full admin controls to manage participants and settings.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                  <Badge text="Admin Access" />
                  <Badge text="Full Sync" />
                </div>
              </div>
            </Link>

            <Link href="/home/join" className="group">
              <div className="relative h-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-600/10 blur-[50px] group-hover:bg-amber-600/20 transition-colors" />

                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <Users className="text-white w-7 h-7" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white flex items-center justify-between">
                    Join Room
                    <ChevronRight className="w-6 h-6 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Collaborate on an existing project. Just enter the room ID and jump straight into the action.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                  <Badge text="Real-time" />
                  <Badge text="Team Chat" />
                </div>
              </div>
            </Link>

            <Link href="/home/history" className="group">
              <div className="relative h-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] hover:border-neutral-400/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-[50px] transition-colors" />

                <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">
                  <History className="text-white w-7 h-7" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white flex items-center justify-between">
                    Archive
                    <ChevronRight className="w-6 h-6 text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Review your past masterpieces. Access saved drawings, chat logs, and exported files.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                  <Badge text="Saved" />
                  <Badge text="Exports" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 bg-neutral-950/50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Drawing Workspace v2
          </div>
          <div className="flex items-center gap-4">
            <a href={'https://github.com/avichal-08/DrawX'} className="text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors">
              Github
            </a>
            <a href={'https://www.linkedin.com/in/avichal-pandey-743310293/'} className="text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 bg-white/5 text-[10px] font-black uppercase tracking-tighter text-neutral-400 rounded-full border border-white/10 group-hover:border-white/20 transition-colors">
      {text}
    </span>
  );
}