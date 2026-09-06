import { EVIDENCE_LADDER } from "@/lib/hcftl";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

export function EvidenceLadder() {
  // Display from lowest (01) at bottom to highest (06) at top
  const ladderReversed = [...EVIDENCE_LADDER].reverse();

  return (
    <section className="py-24 md:py-40 relative bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 pb-12 border-b border-white/[0.04] gap-8">
          <div>
            <div className="flex items-center gap-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-[#7DD3FC]/60 uppercase">
              <span className="w-6 h-px bg-[#7DD3FC]/30" />
              <span>HCFTL // Section 06B — Evidence Ladder</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-medium text-[#F4F7FA] tracking-tight leading-[1.05]">
              The Evidence<br />Ladder
            </h2>
          </div>
          <div className="max-w-sm space-y-4">
            <p className="text-base md:text-lg text-[#8899A6] font-light leading-relaxed">
              Taksonomi ketat pembuktian ilmiah. Klaim tidak akan pernah melampaui status eksperimen yang telah diverifikasi.
            </p>
            <div className="inline-block text-[10px] font-mono tracking-widest text-[#66717F] uppercase border border-white/[0.06] rounded-full px-4 py-2">
              Current Level: 01 — Concept
            </div>
          </div>
        </div>

        {/* Maturity Landscape — generous vertical spacing */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

          {/* The Ladder — no boxes, generous spacing */}
          <div className="flex-1 w-full">
            {/* Directional label */}
            <div className="flex items-center justify-between mb-12 text-[10px] font-mono text-[#66717F] tracking-widest uppercase">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC] shadow-[0_0_6px_#7DD3FC]" />
                <span className="text-[#34D399]">Level 01 — Current Position</span>
              </span>
              <span>↑ Ascending Rigour</span>
            </div>

            <div className="relative">
              {/* Continuous maturity line */}
              <div className="absolute left-[22px] top-6 bottom-0 w-px bg-gradient-to-b from-[#34D399]/60 via-[#7DD3FC]/20 to-white/5" />

              <div className="space-y-16 md:space-y-20">
                {ladderReversed.map((item) => {
                  const isActive = item.level === 1;
                  const isHighest = item.level === 6;

                  return (
                    <div key={item.level} className="relative flex gap-10 group">
                      {/* Marker */}
                      <div className="relative shrink-0 pt-1">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
                            isActive
                              ? "bg-[#34D399]/10 border-[#34D399]/60 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                              : "bg-[#03050A] border-white/10"
                          }`}
                        >
                          <span
                            className={`text-sm font-mono font-bold ${
                              isActive ? "text-[#34D399]" : "text-[#66717F] group-hover:text-[#7DD3FC]"
                            } transition-colors`}
                          >
                            0{item.level}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3
                            className={`${lora.className} text-[28px] sm:text-[36px] md:text-[42px] font-medium leading-tight tracking-tight ${
                              isActive ? "text-[#F4F7FA]" : "text-[#8899A6] group-hover:text-[#E2E8F0]"
                            } transition-colors`}
                          >
                            {item.name}
                            {isHighest && (
                              <span className="ml-4 text-[12px] font-sans font-normal text-purple-400/80 border border-purple-500/20 rounded-full px-3 py-1 tracking-widest uppercase">
                                Apex
                              </span>
                            )}
                            {isActive && (
                              <span className="ml-4 text-[11px] font-sans font-normal text-[#34D399] border border-[#34D399]/30 rounded-full px-3 py-1 tracking-widest uppercase">
                                Current
                              </span>
                            )}
                          </h3>
                          <span className="shrink-0 text-[10px] font-mono text-[#66717F] tracking-widest uppercase mt-2">
                            {item.level >= 4 ? "Peer Reproducible" : "Internal Design"}
                          </span>
                        </div>
                        <p
                          className={`text-base md:text-lg font-light leading-relaxed max-w-2xl ${
                            isActive ? "text-[#A2ACB9]" : "text-[#66717F]"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Evidence Mandate — sticky glass panel */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-32">
            <div
              className="rounded-3xl p-8 md:p-10"
              style={{
                background: "rgba(8,14,28,0.6)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
              }}
            >
              <div className="text-[10px] font-mono tracking-[0.25em] text-[#7DD3FC]/70 mb-6 uppercase flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7DD3FC]" />
                HCFTL Evidence Mandate
              </div>

              <p
                className={`${lora.className} text-xl md:text-2xl text-[#F4F7FA] font-medium leading-relaxed mb-6`}
              >
                &ldquo;Bukti HCFTL saat ini harus selalu dinyatakan secara eksplisit.&rdquo;
              </p>

              <p className="text-sm md:text-base text-[#8899A6] font-light leading-relaxed mb-8">
                HCFTL secara tegas menolak pencampuradukan antara prototipe perangkat lunak awal dengan sistem yang telah divalidasi secara ilmiah.
              </p>

              <div className="pt-6 border-t border-white/[0.05] space-y-2 font-mono text-[11px]">
                <div className="text-[#66717F] tracking-widest uppercase">Current Lab Evidence Level</div>
                <div className="text-[#34D399] tracking-widest">Level 01 // Theoretical & Architectural</div>
                <div className="text-[#66717F] opacity-60 uppercase tracking-widest leading-relaxed pt-2">
                  No claims of Level 04+ before formal reproducibility audits.
                </div>
              </div>
            </div>

            {/* Doctrine quote */}
            <div className="mt-10 pl-6 border-l border-white/[0.04]">
              <blockquote
                className={`${lora.className} text-lg md:text-xl text-[#BAE6FD] font-medium leading-relaxed mb-4 italic`}
              >
                &ldquo;Sebuah demo yang indah adalah bukti dari sebuah demo. Ia bukanlah bukti dari keandalan, keamanan, atau kecerdasan umum.&rdquo;
              </blockquote>
              <div className="text-[10px] font-mono text-[#66717F] uppercase tracking-widest">
                HCFTL Evidence Protocol // Founding Tenet
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
