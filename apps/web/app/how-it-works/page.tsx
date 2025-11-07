"use client"
import React, { useState } from 'react';
import { 
  FaServer, 
  FaDatabase, 
  FaNetworkWired, 
  FaPaintBrush, 
  FaComments, 
  FaUsers, 
  FaLock,
  FaCode,
  FaBolt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

export default function HowItWorks() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section:any) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const features = [
    {
      icon: <FaNetworkWired className="text-4xl" />,
      title: "Real-Time WebSocket Connection",
      description: "Instant synchronization across all connected clients using WebSocket protocol",
      details: [
        "WebSocket server handles multiple concurrent connections",
        "Room-based channel system for isolated collaboration",
        "Automatic reconnection on connection loss",
        "Low latency for drawing updates"
      ]
    },
    {
      icon: <FaPaintBrush className="text-4xl" />,
      title: "Advanced Drawing Engine",
      description: "Canvas-based drawing with multiple shape tools and real-time rendering",
      details: [
        "Supports rectangles, circles, lines, arrows, and freehand drawing",
        "Text annotation capabilities",
        "Eraser tool for selective deletion",
        "Dark/Light mode support"
      ]
    },
    {
      icon: <FaDatabase className="text-4xl" />,
      title: "Persistent Storage",
      description: "All drawings and messages are saved to PostgreSQL database",
      details: [
        "Room data persists across sessions",
        "Complete chat history stored",
        "Stroke-by-stroke drawing data saved using debouncing",
        "Fast retrieval on room rejoin",
        "Prisma ORM for type-safe database operations"
      ]
    },
    {
      icon: <FaComments className="text-4xl" />,
      title: "Integrated Chat System",
      description: "Real-time messaging alongside collaborative drawing",
      details: [
        "Instant message delivery to all room participants",
        "Persistent chat history",
        "User identification with name and email",
        "Synchronized with drawing updates"
      ]
    }
  ];

  const architecture = [
    {
      id: "frontend",
      title: "Frontend Layer",
      icon: <FaCode className="text-3xl" />,
      tech: ["Next.js 15", "React 19", "TailwindCSS", "Canvas API"],
      description: "Built with Next.js App Router for optimal performance and SEO",
      details: [
        "Server-side rendering for fast initial load",
        "Client-side navigation for smooth transitions",
        "Responsive design for all screen sizes",
        "Optimized Canvas rendering for smooth drawing",
        "Real-time state management with React hooks"
      ]
    },
    {
      id: "backend",
      title: "Backend Layer",
      icon: <FaServer className="text-3xl" />,
      tech: ["Next.js app router", "Express.js", "WebSocket (ws)", "Node.js"],
      description: "Scalable backend handling real-time communication",
      details: [
        "RESTful API for room management",
        "WebSocket server for real-time updates",
        "JWT-based authentication",
        "Cookie-based session management",
        "Room-based message broadcasting"
      ]
    },
    {
      id: "database",
      title: "Database Layer",
      icon: <FaDatabase className="text-3xl" />,
      tech: ["PostgreSQL", "Prisma ORM"],
      description: "Robust data persistence with relational database",
      details: [
        "User authentication with NextAuth",
        "Room metadata and ownership",
        "Stroke data with JSON serialization",
        "Chat messages with timestamps"
      ]
    }
  ];

  const workflow = [
    {
      step: 1,
      title: "Authentication",
      description: "User signs in with Google OAuth through NextAuth.js",
      icon: <FaLock className="text-2xl" />
    },
    {
      step: 2,
      title: "Room Creation/Join",
      description: "Create a new room or join existing one with unique slug",
      icon: <FaUsers className="text-2xl" />
    },
    {
      step: 3,
      title: "WebSocket Connection",
      description: "Establish real-time connection to room channel",
      icon: <FaNetworkWired className="text-2xl" />
    },
    {
      step: 4,
      title: "Collaboration",
      description: "Draw, chat, and collaborate in real-time with room participants",
      icon: <FaBolt className="text-2xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">

      <div className="border-b border-orange-500/20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              DrawX
            </span>
          </div>
          <a 
            href="/"
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg font-semibold hover:scale-105 transition-transform cursor-pointer"
          >
            Home
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          How <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">DrawX</span> Works
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          A deep dive into the architecture, technologies, and features that power real-time collaborative drawing
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">User Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflow.map((item) => (
            <div 
              key={item.step}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <div className="text-orange-500 font-bold text-sm mb-2">STEP {item.step}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-orange-500 mt-1">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Technical Architecture</h2>
        <div className="space-y-4">
          {architecture.map((layer) => (
            <div 
              key={layer.id}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection(layer.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-orange-500">{layer.icon}</div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold">{layer.title}</h3>
                    <p className="text-gray-400 text-sm">{layer.description}</p>
                  </div>
                </div>
                {expandedSection === layer.id ? (
                  <FaChevronUp className="text-orange-500 text-xl" />
                ) : (
                  <FaChevronDown className="text-orange-500 text-xl" />
                )}
              </button>
              
              {expandedSection === layer.id && (
                <div className="p-6 border-t border-orange-500/20 bg-neutral-900/50">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2 text-orange-400">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {layer.tech.map((tech, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-orange-500/10 text-orange-400 text-sm rounded-full border border-orange-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-orange-400">Key Capabilities:</h4>
                    <ul className="space-y-2">
                      {layer.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-orange-500 mt-1">→</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Real-Time Data Flow</h2>
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">User Action</h4>
                <p className="text-gray-400">User draws a shape or sends a chat message</p>
              </div>
            </div>
            <div className="ml-6 border-l-2 border-orange-500/30 pl-6 py-2">
              <div className="text-gray-400 text-sm">Canvas event captured → State updated locally</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">WebSocket Broadcast</h4>
                <p className="text-gray-400">Server broadcasts to all room participants</p>
              </div>
            </div>
            <div className="ml-6 border-l-2 border-orange-500/30 pl-6 py-2">
              <div className="text-gray-400 text-sm">Message sent via WebSocket → Room channel broadcast</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Client Update</h4>
                <p className="text-gray-400">All connected clients receive and render update</p>
              </div>
            </div>
            <div className="ml-6 border-l-2 border-orange-500/30 pl-6 py-2">
              <div className="text-gray-400 text-sm">Update received → Canvas redrawn → UI updated</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold">4</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Database Persistence</h4>
                <p className="text-gray-400">Admin saves data to PostgreSQL (debounced)</p>
              </div>
            </div>
            <div className="ml-6 border-l-2 border-orange-500/30 pl-6 py-2">
              <div className="text-gray-400 text-sm">Prisma ORM → PostgreSQL → Data persisted</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold">5</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Download Canvas</h4>
                <p className="text-gray-400">Download the canvas drawings in pdf/jpg/png format</p>
              </div>
            </div>
            <div className="ml-6 border-l-2 border-orange-500/30 pl-6 py-2">
              <div className="text-gray-400 text-sm">Click on download icon → Select format → Canvas get downloaded</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Complete Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "Next.js 15",
            "React 19",
            "TypeScript",
            "TailwindCSS",
            "Express.js",
            "WebSocket",
            "PostgreSQL",
            "Prisma ORM",
            "NextAuth.js",
            "JWT",
            "Turborepo",
            "Canvas API"
          ].map((tech) => (
            <div 
              key={tech}
              className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-xl p-4 text-center hover:scale-105 transition-transform"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/20 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Drawing?</h2>
          <p className="text-gray-400 mb-8">
            Experience real-time collaboration with DrawX today
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-semibold hover:scale-105 transition-transform cursor-pointer"
            >
              Get Started
            </a>
            <a 
              href="https://github.com/avichal-08/DrawX"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-neutral-800 border border-orange-500/20 rounded-xl font-semibold hover:border-orange-500/50 transition-all cursor-pointer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-orange-500/20 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-neutral-500 text-sm">
          © 2025 DrawX. Built with ❤️ by <a href="https://github.com/avichal-08" className="text-orange-500 hover:underline">Avichal</a>
        </div>
      </footer>
    </div>
  );
}