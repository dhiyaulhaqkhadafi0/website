"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RESEARCH_STAGES } from "@/lib/hcftl";

// Path definition for the S-curve — used both in SVG and for the pulse
// We define it as a cubic bezier series across 9 stages.
// On desktop: serpentine path (wide). On mobile: straight vertical.

export function ResearchOperatingSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  // 9 stages laid out in S-curve:
  // Row 1 (L→R): R01, R02, R03  — y=100–300, x=100–700
  // Bend R at R03 → R04
  // Row 2 (R→L): R04, R05, R06  — y=400–600, x=700–100
  // Bend L at R06 → R07
  // Row 3 (L→R): R07, R08, R09  — y=700–900, x=100–700

  const STAGE_POSITIONS = [
    { x: 120, y: 120 },  // R01
    { x: 380, y: 180 },  // R02
    { x: 680, y: 140 },  // R03
    { x: 680, y: 420 },  // R04
    { x: 420, y: 480 },  // R05
    { x: 120, y: 440 },  // R06
    { x: 120, y: 720 },  // R07
    { x: 400, y: 780 },  // R08
    { x: 680, y: 740 },  // R09
  ];

  // Build smooth path through all 9 points
  const buildPath = () => {
    const pts = STAGE_POSITIONS;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cp1x = prev.x + (curr.x - prev.x) * 0.4;
      const cp1y = prev.y + (curr.y - prev.y) * 0.1;
      const cp2x = prev.x + (curr.x - prev.x) * 0.6;
      const cp2y = curr.y - (curr.y - prev.y) * 0.1;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const pathD = buildPath();

  return (
    <section id="process" className="py-24 md:py-40 relative" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-12 border-b border-white/[0.04] gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 06 — Research Operating System</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              Research Pipeline
            </h2>
          </div>
          <p className="max-w-sm text-base md:text-lg text-[#8899A6] font-light leading-relaxed">
            Proses tak kenal kompromi dari hipotesis menuju bukti. Tidak ada eksperimen yang melewatkan gerbang pengawasan.
          </p>
        </div>

        {/* Desktop SVG Pipeline */}
        <div className="hidden md:block relative">
          <svg
            viewBox="0 0 800 1000"
            className="w-full"
            style={{ maxHeight: "1100px" }}
            fill="none"
          >
            {/* Background path (dim) */}
            <path d={pathD} stroke="rgba(255,255,255,0.04)" strokeWidth="2" fill="none" />

            {/* Animated progress path */}
            {isInView && (
              <motion.path
                d={pathD}
                stroke="#7DD3FC"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
                style={{ opacity: 0.5 }}
              />
            )}

            {/* Stage nodes and labels */}
            {RESEARCH_STAGES.map((stage, idx) => {
              const pos = STAGE_POSITIONS[idx];
              const isLeft = pos.x < 400;

              return (
                <g key={stage.code}>
                  {/* Stage node */}
                  <circle
                    cx={pos.x} cy={pos.y} r="28"
                    fill="rgba(3,5,10,0.9)"
                    stroke="rgba(125,211,252,0.2)"
                    strokeWidth="1"
                  />
                  <circle
                    cx={pos.x} cy={pos.y} r="10"
                    fill="rgba(125,211,252,0.15)"
                    stroke="rgba(125,211,252,0.5)"
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x} y={pos.y + 4}
                    textAnchor="middle"
                    fill="rgba(125,211,252,0.9)"
                    fontSize="9"
                    fontFamily="monospace"
                    letterSpacing="1"
                  >
                    {stage.code}
                  </text>

                  {/* Stage label — alternating sides */}
                  <text
                    x={isLeft ? pos.x + 44 : pos.x - 44}
                    y={pos.y - 8}
                    textAnchor={isLeft ? "start" : "end"}
                    fill="rgba(244,247,250,0.9)"
                    fontSize="15"
                    fontFamily="sans-serif"
                    fontWeight="500"
                  >
                    {stage.name}
                  </text>
                  <text
                    x={isLeft ? pos.x + 44 : pos.x - 44}
                    y={pos.y + 12}
                    textAnchor={isLeft ? "start" : "end"}
                    fill="rgba(136,153,166,0.8)"
                    fontSize="12"
                    fontFamily="sans-serif"
                  >
                    {stage.summary.slice(0, 52)}{stage.summary.length > 52 ? "…" : ""}
                  </text>
                </g>
              );
            })}

            {/* Animated Research Pulse that travels once on inView */}
            {isInView && (
              <motion.circle
                r="7"
                fill="#7DD3FC"
                style={{ filter: "drop-shadow(0 0 10px #7DD3FC)" }}
                initial={{ cx: 120, cy: 120 }}
                animate={{
                  cx: [120, 380, 680, 680, 420, 120, 120, 400, 680],
                  cy: [120, 180, 140, 420, 480, 440, 720, 780, 740],
                }}
                transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
              />
            )}
          </svg>
        </div>

        {/* Mobile: simple vertical list */}
        <div className="md:hidden relative pl-12">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#7DD3FC]/50 via-[#7DD3FC]/20 to-[#7DD3FC]/10" />

          <div className="space-y-14">
            {RESEARCH_STAGES.map((stage, idx) => (
              <motion.div
                key={stage.code}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="relative"
              >
                {/* Node */}
                <div className="absolute -left-12 top-1 w-6 h-6 rounded-full bg-[#03050A] border border-[#7DD3FC]/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#7DD3FC]/60" />
                </div>

                <div className="text-[10px] font-mono tracking-widest text-[#7DD3FC]/60 mb-2 uppercase">
                  {stage.code}
                </div>
                <h3 className="text-xl font-medium text-[#F4F7FA] mb-2">{stage.name}</h3>
                <p className="text-sm text-[#8899A6] font-light leading-relaxed">{stage.summary}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
