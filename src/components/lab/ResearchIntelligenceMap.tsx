"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NodeDetail {
  id: string;
  code: string;
  title: string;
  question: string;
  keywords: string[];
  cx: number; // in 0–1000 SVG coords
  cy: number;
}

const MAP_NODES: NodeDetail[] = [
  {
    id: "physical",
    code: "Frontier 01",
    title: "Physical Intelligence",
    question: "Bagaimana sistem cerdas dapat mengamati, menalar, dan berinteraksi dengan lingkungan fisik secara aman?",
    keywords: ["Robotics", "Embodied Intelligence", "Physical Sensing", "Human-Machine Interaction"],
    cx: 220, cy: 200,
  },
  {
    id: "digital-twins",
    code: "Frontier 04",
    title: "Digital Twin Intelligence",
    question: "Bagaimana model dunia dapat membangun representasi resolusi tinggi dari lingkungan fisik untuk menguji masa depan dengan aman?",
    keywords: ["Simulation", "World Models", "Predictive Systems", "Scenario Intelligence"],
    cx: 700, cy: 140,
  },
  {
    id: "collective",
    code: "Frontier 02",
    title: "Collective Intelligence",
    question: "Bagaimana agen ganda heterogen dapat berkoordinasi menuju tujuan bersama tanpa kegagalan sentralisasi?",
    keywords: ["Multi-Agent Systems", "Distributed Intelligence", "Agent Coordination", "Collective Decisions"],
    cx: 820, cy: 540,
  },
  {
    id: "resilience",
    code: "Frontier 03",
    title: "Resilience Technology",
    question: "Bagaimana sistem cerdas dapat membantu manusia menyerap disrupsi, kejadian iklim, dan guncangan sistemik?",
    keywords: ["Disaster Response", "Infrastructure Resilience", "Environmental Intel", "Emergency Protocols"],
    cx: 180, cy: 680,
  },
  {
    id: "autonomy",
    code: "Frontier 05",
    title: "Safe Autonomous Systems",
    question: "Bagaimana sistem otonom yang kuat dapat tetap teramati, terbatasi secara ketat, dan berada di bawah otoritas manusia yang bermakna?",
    keywords: ["Human-in-the-Loop", "Permission Boundaries", "Agent Safety", "Controlled Autonomy"],
    cx: 600, cy: 810,
  },
];

// HCFTL Core center
const CORE = { cx: 500, cy: 500 };

export function ResearchIntelligenceMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const activeData = MAP_NODES.find((n) => n.id === activeNode);

  return (
    <section id="overview" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 04 — Research Intelligence Map</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              Five Research<br />Frontiers
            </h2>
          </div>
          <p className="max-w-sm text-base md:text-lg text-[#8899A6] font-light leading-relaxed">
            HCFTL beroperasi di persimpangan lima bidang ilmu kritis yang membentuk masa depan kecerdasan buatan.
          </p>
        </div>

        {/* Map + Panel Layout */}
        <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-0 items-start">

          {/* SVG Map — dominant visual */}
          <div className="w-full lg:flex-1 relative" style={{ minHeight: "560px" }}>
            <svg
              viewBox="0 0 1000 1000"
              className="w-full h-full"
              style={{ maxHeight: "700px" }}
            >
              {/* Background depth gradient */}
              <defs>
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0a1930" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#03050A" stopOpacity="0" />
                </radialGradient>
                <filter id="nodeGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background field */}
              <ellipse cx="500" cy="500" rx="480" ry="480" fill="url(#mapBg)" />

              {/* Soft field rings */}
              <circle cx="500" cy="500" r="120" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              <circle cx="500" cy="500" r="240" fill="none" stroke="rgba(125,211,252,0.04)" strokeWidth="1" strokeDasharray="4 10" />
              <circle cx="500" cy="500" r="360" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

              {/* Connection lines — dim by default, highlight active */}
              {MAP_NODES.map((node) => {
                const isActive = activeNode === node.id;
                const isAnyActive = !!activeNode;
                return (
                  <motion.line
                    key={`line-${node.id}`}
                    x1={CORE.cx} y1={CORE.cy}
                    x2={node.cx} y2={node.cy}
                    stroke={isActive ? "rgba(125,211,252,0.5)" : "rgba(125,211,252,0.08)"}
                    strokeWidth={isActive ? 1.5 : 1}
                    strokeDasharray={isActive ? "none" : "3 8"}
                    animate={{ opacity: isAnyActive && !isActive ? 0.3 : 1 }}
                    transition={{ duration: 0.4 }}
                  />
                );
              })}

              {/* Core glow */}
              <ellipse cx="500" cy="500" rx="100" ry="100" fill="url(#coreGlow)" />

              {/* HCFTL Core — layered circles */}
              <circle cx="500" cy="500" r="64" fill="rgba(3,5,10,0.95)" stroke="rgba(125,211,252,0.12)" strokeWidth="1" />
              <circle cx="500" cy="500" r="48" fill="rgba(125,211,252,0.04)" stroke="rgba(125,211,252,0.2)" strokeWidth="1" />
              <circle cx="500" cy="500" r="28" fill="rgba(125,211,252,0.08)" stroke="rgba(125,211,252,0.45)" strokeWidth="1" />
              <circle cx="500" cy="500" r="10" fill="#7DD3FC" filter="url(#nodeGlow)" />
              <text x="500" y="542" textAnchor="middle" fill="rgba(125,211,252,0.6)" fontSize="9" fontFamily="monospace" letterSpacing="2">HCFTL</text>

              {/* Frontier Nodes */}
              {MAP_NODES.map((node) => {
                const isActive = activeNode === node.id;
                const isAnyActive = !!activeNode;
                return (
                  <motion.g
                    key={node.id}
                    onClick={() => setActiveNode(isActive ? null : node.id)}
                    style={{ cursor: "pointer" }}
                    animate={{
                      opacity: isAnyActive && !isActive ? 0.35 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Outer hover ring */}
                    <circle
                      cx={node.cx} cy={node.cy} r="42"
                      fill="transparent"
                      stroke={isActive ? "rgba(125,211,252,0.3)" : "transparent"}
                      strokeWidth="1"
                    />
                    {/* Node body */}
                    <circle
                      cx={node.cx} cy={node.cy} r="28"
                      fill={isActive ? "rgba(125,211,252,0.12)" : "rgba(3,5,10,0.9)"}
                      stroke={isActive ? "rgba(125,211,252,0.6)" : "rgba(125,211,252,0.2)"}
                      strokeWidth="1"
                    />
                    <circle
                      cx={node.cx} cy={node.cy} r="8"
                      fill={isActive ? "#7DD3FC" : "rgba(125,211,252,0.5)"}
                      filter={isActive ? "url(#nodeGlow)" : "none"}
                    />
                    {/* Label */}
                    <text
                      x={node.cx} y={node.cy + 46}
                      textAnchor="middle"
                      fill={isActive ? "rgba(125,211,252,0.9)" : "rgba(162,172,185,0.8)"}
                      fontSize="11"
                      fontFamily="monospace"
                      letterSpacing="1"
                    >
                      {node.code}
                    </text>
                    <text
                      x={node.cx} y={node.cy + 60}
                      textAnchor="middle"
                      fill={isActive ? "rgba(244,247,250,0.9)" : "rgba(244,247,250,0.5)"}
                      fontSize="10"
                      fontFamily="sans-serif"
                    >
                      {node.title.split(" ")[0]}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Information Panel — floating glass, right side */}
          <div className="w-full lg:w-[380px] lg:ml-8 shrink-0">
            <AnimatePresence mode="wait">
              {activeData ? (
                <motion.div
                  key={activeData.id}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
                  style={{
                    background: "rgba(10,20,40,0.6)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(125,211,252,0.12)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <button
                    onClick={() => setActiveNode(null)}
                    className="absolute top-5 right-5 w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-[#66717F] hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <span className="text-xs">✕</span>
                  </button>

                  <div className="text-[10px] font-mono tracking-[0.25em] text-[#7DD3FC]/70 mb-4 uppercase">
                    {activeData.code}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-medium text-[#F4F7FA] tracking-tight mb-6 leading-tight">
                    {activeData.title}
                  </h3>
                  <p className="text-base md:text-lg text-[#A2ACB9] font-light leading-relaxed mb-8">
                    {activeData.question}
                  </p>

                  <div className="pt-6 border-t border-white/[0.06]">
                    <p className="text-[10px] font-mono text-[#66717F] tracking-widest uppercase mb-4">
                      Research Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeData.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-3 py-1.5 rounded-full text-[11px] font-mono text-[#A2ACB9] bg-white/[0.04] border border-white/[0.06]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-12 h-12 rounded-full border border-white/[0.08] flex items-center justify-center mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#7DD3FC]/60 animate-pulse" />
                  </div>
                  <p className="text-sm font-mono text-[#66717F] tracking-wider uppercase">
                    Pilih frontier node
                  </p>
                  <p className="text-xs text-[#66717F]/60 mt-2 font-mono">
                    untuk melihat detail riset
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
