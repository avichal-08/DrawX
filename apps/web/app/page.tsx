"use client"
import { useState, useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu, X, Zap, Users, History, MessageSquare, ChevronRight, Moon, Sun } from 'lucide-react';
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
      description: "Powered by WebSockets and optimized architecture for instant synchronization across all devices."
    }
  ];

  const techStack = [
    { name: "Next.js", color: "from-gray-700 to-gray-900" },
    { name: "Prisma", color: "from-orange-600 to-amber-600" },
    { name: "PostgreSQL", color: "from-blue-500 to-blue-700" },
    { name: "WebSockets", color: "from-orange-500 to-amber-600" },
    { name: "Express", color: "from-green-600 to-green-400" },
    { name: "Turborepo", color: "from-red-500 to-pink-600" },
    { name: "TypeScript", color: "from-blue-400 to-blue-600" }
  ];

  if (status === "loading") {
    return (
      <div className='flex items-center justify-center mt-[20%]'>
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">DrawX</span>
            </div>


            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`hover:text-orange-500 transition-colors text-gray-300`}>Features</a>
              <a href="https://github.com/avichal-08/DrawX" className={`hover:text-orange-500 transition-colors text-gray-300`}>Github</a>
              <a href="https://www.linkedin.com/in/avichal-pandey-743310293/" className={`hover:text-orange-500 transition-colors text-gray-300`}>LinkedIn</a>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-lg bg-gray-800`}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden bg-gray-900 border-t border-gray-800`}>
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 hover:text-orange-500 transition-colors">Features</a>
              <a href="https://github.com/avichal-08/DrawX" className="block py-2 hover:text-orange-500 transition-colors">Github</a>
              <a href="https://www.linkedin.com/in/avichal-pandey-743310293/" className="block py-2 hover:text-orange-500 transition-colors">LinkedIn</a>
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-500 font-medium">Next-Gen Collaboration</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Collaborate. Create. DrawX.
              </span>
            </h1>
            <p className={`text-xl sm:text-2xl mb-10 max-w-3xl mx-auto text-gray-400`}>
              A next-gen collaborative whiteboard built for creators, teams, and developers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a onClick={() => {
                if (!session)
                  signIn(undefined, { callbackUrl: "/home" })
                else
                  router.push('/home')
              }} className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 flex items-center cursor-pointer">
                Join Now
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/how-it-works" className={`px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer`}>
                How It Works?
              </a>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto mt-20">
            <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-3xl opacity-20`}></div>
            <div className={`relativebg-gray-900/50 backdrop-blur-xl rounded-3xl borderborder-gray-800 p-4 shadow-2xl`}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className={`bg-gray-950 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden`}>

                <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-px opacity-10">
                  {[...Array(96)].map((_, i) => (
                    <div key={i} className={`bg-gray-700`}></div>
                  ))}
                </div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <p className={`text-lg font-semibold text-gray-400`}>Your canvas awaits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className={`text-xl text-gray-400`}>Everything you need to collaborate seamlessly</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className={`group bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10`}>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`text-gray-400`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tech" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Built With Modern Tech</h2>
            <p className={`text-xl text-gray-400`}>Powered by industry-leading technologies</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, idx) => (
              <div key={idx} className={`group px-6 py-3 bg-gradient-to-r ${tech.color} rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer`}>
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-center overflow-hidden border border-gray-800`}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">Start creating with DrawX today!</h2>
              <a onClick={() => {
                if (!session)
                  signIn(undefined, { callbackUrl: "/home" })
                else
                  router.push('/home')
              }} className=" cursor-pointer inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">DrawX</span>
          </div>
          <p className={`text-gray-400`}>© 2025 DrawX. Built with ❤️, by <a href="https://github.com/avichal-08">Avichal</a>.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}