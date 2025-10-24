import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NEXT_AUTH } from "../lib/auth";
import { FaArrowRight, FaPlus, FaUsers, FaHistory } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

export default async function Home() {
  const session = await getServerSession(NEXT_AUTH);
  const name = session?.user.name;

  if (!session) {
    redirect("/");
  }

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
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-neutral-800/50 px-4 py-2 rounded-full border border-orange-500/20">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-neutral-300 text-sm font-medium">{name}</span>
            </div>
            <Link
              href="/logout">
              <IoIosLogOut className="text-white text-2xl" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome back, <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{name}</span>
            </h1>
            <p className="text-neutral-400 text-lg">Choose an option to get started with your collaborative drawing experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/home/create"
              className="group relative bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl group-hover:from-orange-500/20 transition-all duration-300" />

              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                  <FaPlus className="text-white text-xl" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                  Create Room
                  <FaArrowRight className="text-orange-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  Start a new collaborative space as admin with full control and access
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/20">Admin Access</span>
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/20">Full Control</span>
                </div>
              </div>
            </Link>

            <Link
              href="/home/join"
              className="group relative bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl group-hover:from-orange-500/20 transition-all duration-300" />

              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                  <FaUsers className="text-white text-xl" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                  Join Room
                  <FaArrowRight className="text-orange-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  Enter an existing room to chat and collaborate in real-time
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/20">Guest Access</span>
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/20">Real-time</span>
                </div>
              </div>
            </Link>

            <Link
              href="/home/history"
              className="group relative bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl group-hover:from-orange-500/20 transition-all duration-300" />

              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30">
                  <FaHistory className="text-white text-xl" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-between">
                  All Rooms
                  <FaArrowRight className="text-orange-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  Access your room history, saved drawings, and past conversations
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/20">Your Rooms</span>
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/20">History</span>
                </div>
              </div>
            </Link>
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