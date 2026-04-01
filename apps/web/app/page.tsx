"use client"
import { useState, useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, Users, History, MessageSquare, ChevronRight, Pencil, Globe, Shield } from 'lucide-react';
import { Loader } from "@repo/ui/loader";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real-Time Collaboration",
      description: "Draw together with your team in real-time. See every stroke as it happens with zero latency."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Integrated Chat",
      description: "Communicate seamlessly while you create. Built-in chat keeps your team connected."
    },
    {
      icon: <History className="w-6 h-6" />,
      title: "Complete History",
      description: "Access full history of drawings and conversations. Never lose track of your creative process."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Powered by WebSockets and optimized architecture for instant synchronization."
    }
  ];

  const techStack = [
    { name: "Next.js", color: "from-zinc-400 to-zinc-600" },
    { name: "Prisma", color: "from-blue-400 to-indigo-500" },
    { name: "PostgreSQL", color: "from-emerald-400 to-cyan-500" },
    { name: "WebSockets", color: "from-orange-400 to-red-500" },
    { name: "Turborepo", color: "from-pink-500 to-rose-600" },
    { name: "TypeScript", color: "from-blue-500 to-sky-600" }
  ];

  if (status === "loading") {
    return (
      <div className='flex h-screen w-full justify-center items-center bg-neutral-950'>
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-orange-500/30 overflow-x-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-6 bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
                <Pencil className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                DrawX
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-10">
              {['Features', 'Github', 'LinkedIn'].map((item) => (
                <a
                  key={item}
                  href={item === 'Features' ? '#features' : item === 'Github' ? 'https://github.com/avichal-08/DrawX' : 'https://www.linkedin.com/in/avichal-pandey-743310293/'}
                  className="text-sm font-medium text-neutral-400 hover:text-orange-500 transition-colors"
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => !session ? signIn(undefined, { callbackUrl: "/home" }) : router.push('/home')}
                className="px-5 py-2.5 rounded-full bg-white cursor-pointer text-black text-sm font-bold hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                Launch App
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-neutral-400">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-neutral-900 border-b border-white/5 px-6 py-8"
            >
              <div className="flex flex-col space-y-6">
                <a href="#features" className="text-lg font-medium">Features</a>
                <a href="https://github.com/avichal-08/DrawX" className="text-lg font-medium">Github</a>
                <button
                  onClick={() => !session ? signIn(undefined, { callbackUrl: "/home" }) : router.push('/home')}
                  className="w-full py-4 bg-orange-600 rounded-xl font-bold"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="relative pt-44 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-200">v2.0 Available Now</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            Collaborate. <br />
            <span className="bg-gradient-to-b from-orange-400 to-amber-600 bg-clip-text text-transparent italic">Create.</span> DrawX.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The ultimate collaborative whiteboard for fast-moving teams.
            Sketch, brainstorm, and build—together, in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => !session ? signIn(undefined, { callbackUrl: "/home" }) : router.push('/home')}
              className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white cursor-pointer rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-orange-600/20 hover:scale-105 flex items-center group"
            >
              Start Drawing Free
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/how-it-works')} className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer rounded-2xl font-bold text-lg transition-all backdrop-blur-md">
              How it works?
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-24 relative max-w-6xl mx-auto"
          >
            <div className="absolute inset-0 bg-orange-500/20 blur-[100px] -z-10" />
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-3 shadow-2xl overflow-hidden">
              <div className="bg-neutral-950 rounded-2xl aspect-[16/9] flex items-center justify-center relative overflow-hidden border border-white/5">
                {/* Grid UI */}
                <div className="absolute inset-0 opacity-[0.03]"
                  style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 mb-4 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
                    <Zap className="text-orange-500 w-8 h-8 animate-pulse" />
                  </div>
                  <span className="text-neutral-500 font-mono text-sm tracking-widest">INITIALIZING CANVAS...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Everything for high-perf teams</h2>
            <p className="text-neutral-400 text-lg">Focus on the idea, we handle the sync.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="group p-8 bg-neutral-900/50 border border-white/5 rounded-3xl hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-y border-white/5 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600 mb-12 block">Powering the Core</span>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className={`px-6 py-3 bg-neutral-900 border border-white/5 rounded-full text-sm font-bold flex items-center gap-2 hover:border-white/20 transition-all cursor-default shadow-sm`}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tech.color}`} />
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-orange-500/10 blur-[120px] pointer-events-none" />

            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
              Ready to draw the <br />next big thing?
            </h2>
            <button
              onClick={() => !session ? signIn(undefined, { callbackUrl: "/home" }) : router.push('/home')}
              className="px-12 py-6 bg-white text-black cursor-pointer hover:bg-orange-500 hover:text-white rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-2xl"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white text-xs">D</div>
            <span className="text-lg font-bold tracking-tight">DrawX</span>
          </div>
          <p className="text-neutral-500 text-sm">
            © 2026 DrawX. Crafted by <a href="https://github.com/avichal-08" className="text-neutral-300 hover:text-orange-500 underline underline-offset-4">Avichal Pandey</a>.
          </p>
          <div className="flex space-x-6 text-neutral-500">
            <Globe className="w-5 h-5 hover:text-white cursor-pointer" />
            <Shield className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}