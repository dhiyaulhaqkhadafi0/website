"use client";

import { motion } from "framer-motion";
import { Lora } from "next/font/google";
import { RESEARCH_FRONTIERS } from "@/lib/hcftl";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

// ── Scientific SVG Illustrations (CSS/SVG only, no external libs) ────────

function PhysicalIntelligenceViz() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
      {/* Wireframe spatial field */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`h${i}`} x1="20" y1={60 + i * 45} x2="380" y2={60 + i * 45}
          stroke="rgba(125,211,252,0.08)" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={`v${i}`} x1={40 + i * 64} y1="40" x2={40 + i * 64} y2="270"
          stroke="rgba(125,211,252,0.06)" strokeWidth="1" />
      ))}
      {/* Sensor rays from a central point */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 200 + 160 * Math.cos(rad);
        const y2 = 150 + 120 * Math.sin(rad);
        return (
          <line key={angle} x1="200" y1="150" x2={x2} y2={y2}
            stroke={`rgba(125,211,252,${0.04 + (angle % 60 === 0 ? 0.12 : 0)})`}
            strokeWidth={angle % 60 === 0 ? 1.5 : 0.5}
            strokeDasharray={angle % 60 === 0 ? "none" : "4 6"} />
        );
      })}
      {/* Central node */}
      <circle cx="200" cy="150" r="16" fill="rgba(125,211,252,0.08)" stroke="rgba(125,211,252,0.4)" strokeWidth="1" />
      <circle cx="200" cy="150" r="6" fill="#7DD3FC" style={{ filter: "drop-shadow(0 0 6px #7DD3FC)" }} />
      {/* Physical presence markers */}
      {[[80, 80], [320, 100], [100, 230], [300, 220]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="rgba(125,211,252,0.06)" stroke="rgba(125,211,252,0.25)" strokeWidth="1" />
          <circle cx={x} cy={y} r="2" fill="rgba(125,211,252,0.5)" />
        </g>
      ))}
    </svg>
  );
}

function CollectiveIntelligenceViz() {
  const nodes = [
    { x: 200, y: 80 }, { x: 100, y: 160 }, { x: 300, y: 160 },
    { x: 60, y: 240 }, { x: 200, y: 240 }, { x: 340, y: 240 },
    { x: 140, y: 200 }, { x: 260, y: 200 },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[1,6],[2,7],[6,7],[3,6],[5,7]];
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="rgba(125,211,252,0.12)" strokeWidth="1" />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={i === 0 ? 18 : 10}
            fill="rgba(3,5,10,0.8)" stroke="rgba(125,211,252,0.25)" strokeWidth="1" />
          <circle cx={n.x} cy={n.y} r={i === 0 ? 6 : 3}
            fill={i === 0 ? "#7DD3FC" : "rgba(125,211,252,0.5)"}
            style={i === 0 ? { filter: "drop-shadow(0 0 6px #7DD3FC)" } : {}} />
        </g>
      ))}
      {/* Broadcast rings from center */}
      {[30, 55, 80].map((r) => (
        <circle key={r} cx="200" cy="80" r={r} fill="none"
          stroke="rgba(125,211,252,0.04)" strokeWidth="1" strokeDasharray="2 6" />
      ))}
    </svg>
  );
}

function ResilienceTechViz() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
      {/* Adaptive wave lines */}
      {[0, 1, 2, 3].map((i) => {
        const y = 80 + i * 50;
        const amp = 20 - i * 3;
        return (
          <path key={i}
            d={`M 20 ${y} Q 100 ${y - amp} 200 ${y} Q 300 ${y + amp} 380 ${y}`}
            stroke={`rgba(125,211,252,${0.06 + i * 0.04})`}
            strokeWidth="1.5" fill="none" />
        );
      })}
      {/* Structural mesh */}
      {[[80, 60], [200, 40], [320, 60], [120, 130], [280, 130], [200, 180]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="rgba(125,211,252,0.3)" stroke="none" />
      ))}
      {[[80, 60, 200, 40], [200, 40, 320, 60], [80, 60, 120, 130],
        [320, 60, 280, 130], [120, 130, 200, 180], [280, 130, 200, 180],
        [120, 130, 280, 130]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(125,211,252,0.1)" strokeWidth="1" />
      ))}
      {/* Shockwave ring */}
      <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(125,211,252,0.06)" strokeWidth="2" strokeDasharray="3 8" />
      <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(125,211,252,0.03)" strokeWidth="1" strokeDasharray="2 12" />
      <circle cx="200" cy="200" r="8" fill="rgba(125,211,252,0.2)" stroke="rgba(125,211,252,0.4)" strokeWidth="1" />
    </svg>
  );
}

function DigitalTwinViz() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
      {/* Two mirrored structures */}
      {/* Left structure (solid) */}
      {[[80, 80], [140, 60], [200, 80], [140, 120]].map(([x, y], i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return <line key={i} x1={x} y1={y} x2={next[0]} y2={next[1]}
          stroke="rgba(125,211,252,0.25)" strokeWidth="1.5" />;
      })}
      {/* Right structure (ghost / mirrored) */}
      {[[220, 80], [280, 60], [340, 80], [280, 120]].map(([x, y], i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return <line key={i} x1={x} y1={y} x2={next[0]} y2={next[1]}
          stroke="rgba(125,211,252,0.1)" strokeWidth="1.5" strokeDasharray="4 4" />;
      })}
      {/* Bottom structures */}
      {[[80, 180], [140, 200], [200, 180], [140, 160]].map(([x, y], i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return <line key={`b${i}`} x1={x} y1={y} x2={next[0]} y2={next[1]}
          stroke="rgba(125,211,252,0.2)" strokeWidth="1.5" />;
      })}
      {[[220, 180], [280, 200], [340, 180], [280, 160]].map(([x, y], i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return <line key={`bg${i}`} x1={x} y1={y} x2={next[0]} y2={next[1]}
          stroke="rgba(125,211,252,0.08)" strokeWidth="1.5" strokeDasharray="4 4" />;
      })}
      {/* Mirror axis */}
      <line x1="210" y1="40" x2="210" y2="260" stroke="rgba(125,211,252,0.15)" strokeWidth="1" strokeDasharray="3 5" />
      {/* Connection bridges */}
      {[[80, 80, 220, 80], [80, 180, 220, 180]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(125,211,252,0.06)" strokeWidth="1" strokeDasharray="1 6" />
      ))}
      {/* Dots at key points */}
      {[[140, 60], [140, 200], [280, 60], [280, 200]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4"
          fill={i < 2 ? "rgba(125,211,252,0.6)" : "rgba(125,211,252,0.2)"} />
      ))}
    </svg>
  );
}

function SafeAutonomyViz() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
      {/* Containment rings */}
      {[40, 70, 100, 130].map((r, i) => (
        <circle key={i} cx="200" cy="150" r={r}
          fill="none"
          stroke={`rgba(125,211,252,${0.18 - i * 0.04})`}
          strokeWidth={i === 0 ? 1.5 : 1}
          strokeDasharray={i === 0 ? "none" : `${4 + i * 2} ${8 + i * 2}`} />
      ))}
      {/* Boundary control markers */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 200 + 100 * Math.cos(rad);
        const y = 150 + 100 * Math.sin(rad);
        return (
          <g key={angle}>
            <circle cx={x} cy={y} r="7" fill="rgba(3,5,10,0.9)" stroke="rgba(125,211,252,0.4)" strokeWidth="1" />
            <circle cx={x} cy={y} r="2.5" fill="rgba(125,211,252,0.8)" />
          </g>
        );
      })}
      {/* Orbital agent paths */}
      <circle cx="200" cy="150" r="165" fill="none" stroke="rgba(125,211,252,0.04)" strokeWidth="1" />
      {/* Agents on orbit */}
      {[30, 150, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 200 + 165 * Math.cos(rad);
        const y = 150 + 165 * Math.sin(rad);
        return (
          <circle key={i} cx={x} cy={y} r="5" fill="rgba(125,211,252,0.3)" stroke="rgba(125,211,252,0.15)" strokeWidth="1" />
        );
      })}
      {/* Central core */}
      <circle cx="200" cy="150" r="20" fill="rgba(125,211,252,0.06)" stroke="rgba(125,211,252,0.3)" strokeWidth="1" />
      <circle cx="200" cy="150" r="8" fill="rgba(125,211,252,0.4)" stroke="rgba(125,211,252,0.7)" strokeWidth="1" />
    </svg>
  );
}

const FRONTIER_VISUALS = [
  PhysicalIntelligenceViz,
  CollectiveIntelligenceViz,
  ResilienceTechViz,
  DigitalTwinViz,
  SafeAutonomyViz,
];

export function ResearchFrontiers() {
  return (
    <section id="frontiers" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 pb-12 border-b border-white/[0.04] gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 05 — Research Frontiers</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              Frontier Index
            </h2>
          </div>
          <p className="max-w-sm text-base md:text-lg text-[#8899A6] font-light leading-relaxed">
            Lima domain ilmu terapan yang membentuk agenda penelitian HCFTL jangka panjang.
          </p>
        </div>

        {/* Frontier Chapters — alternating layout */}
        <div className="space-y-32 md:space-y-48">
          {RESEARCH_FRONTIERS.map((frontier, idx) => {
            const isReversed = idx % 2 === 1;
            const FrontierViz = FRONTIER_VISUALS[idx];

            return (
              <motion.div
                key={frontier.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} gap-12 md:gap-20 items-center`}
              >
                {/* Text block */}
                <div className="flex-1 max-w-xl">
                  <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
                    <span>{frontier.number}</span>
                    <span className="w-6 h-px bg-[#7DD3FC]/30" />
                    <span className="px-2 py-0.5 border border-white/[0.08] text-[#66717F] rounded-full">
                      {frontier.status}
                    </span>
                  </div>

                  <h3
                    className={`${lora.className} text-[40px] sm:text-[52px] md:text-[60px] font-medium text-[#F4F7FA] leading-[1.08] tracking-tight mb-8`}
                  >
                    {frontier.title}
                  </h3>

                  <p className="text-lg md:text-xl text-[#A2ACB9] font-light leading-relaxed mb-10">
                    {frontier.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {frontier.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1.5 text-[11px] font-mono text-[#8899A6] rounded-full border border-white/[0.06] bg-white/[0.02]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scientific visual */}
                <motion.div
                  className="w-full md:w-[400px] lg:w-[460px] shrink-0"
                  style={{ height: "300px" }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 12 + idx * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 1.5,
                  }}
                >
                  <div className="w-full h-full rounded-3xl overflow-hidden relative"
                    style={{
                      background: "rgba(10,18,36,0.4)",
                      border: "1px solid rgba(125,211,252,0.07)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                    }}
                  >
                    <FrontierViz />
                    {/* Frontier code watermark */}
                    <div className="absolute bottom-4 right-4 text-[9px] font-mono text-[#7DD3FC]/20 tracking-widest">
                      {`${frontier.number} // ${frontier.id.toUpperCase().replace("-", "_")}`}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
