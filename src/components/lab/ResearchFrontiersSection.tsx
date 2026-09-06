"use client";

import { useState, useRef, useCallback } from "react";
import { Plus, Minus, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Lora } from "next/font/google";
import { RESEARCH_FRONTIERS } from "@/lib/hcftl";
import { useLabMotion } from "./LabMotionContext";
import { LabSectionHeader } from "./LabSectionHeader";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });
const CUBIC_EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────
   SCHEMATIC DIAGRAM 1: Physical Intelligence
   Sinyal bergerak dari persepsi sensor menuju tindakan fisik
───────────────────────────────────────────────────────────── */
function PhysicalIntelligenceSchematic({ isMotionActive }: { isMotionActive: boolean }) {
  return (
    <svg viewBox="0 0 700 360" className="w-full h-full drop-shadow-lg" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="piLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ADBAC5" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#B5E1E7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F0F2ED" stopOpacity="0.9" />
        </linearGradient>
        <filter id="piGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Coordinate backdrop */}
      <circle cx="160" cy="180" r="100" stroke="rgba(181,225,231,0.06)" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="540" cy="180" r="100" stroke="rgba(181,225,231,0.06)" strokeWidth="1" strokeDasharray="4 6" />

      {/* Sensor Perception Zone (Left) */}
      <g transform="translate(160, 180)">
        <polygon points="0,-60 52,-30 52,30 0,60 -52,30 -52,-30" stroke="rgba(181,225,231,0.35)" strokeWidth="1.5" fill="#070C12" />
        <circle cx="0" cy="0" r="28" fill="#0A121A" stroke="rgba(181,225,231,0.6)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="8" fill="#B5E1E7" filter="url(#piGlow)" />
        <text x="0" y="85" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.15em">
          PERSEPSI SENSORIK
        </text>
      </g>

      {/* Processing Neural Center (Middle) */}
      <g transform="translate(350, 180)">
        <circle cx="0" cy="0" r="44" stroke="rgba(181,225,231,0.25)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="0" cy="0" r="32" fill="#070C12" stroke="rgba(240,242,237,0.5)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="10" fill="#F0F2ED" />
        <text x="0" y="65" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.15em">
          SINTESIS DINAMIS
        </text>
      </g>

      {/* Actuator Action Zone (Right) */}
      <g transform="translate(540, 180)">
        <circle cx="0" cy="0" r="54" stroke="rgba(181,225,231,0.2)" strokeWidth="1" />
        <rect x="-35" y="-35" width="70" height="70" rx="12" stroke="rgba(181,225,231,0.4)" strokeWidth="1.5" fill="#070C12" />
        <circle cx="0" cy="0" r="12" fill="#38BDF8" filter="url(#piGlow)" />
        <text x="0" y="85" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.15em">
          AKTUASI DUNIA NYATA
        </text>
      </g>

      {/* Connection Backbone */}
      <path d="M 188 180 L 318 180" stroke="url(#piLineGrad)" strokeWidth="2" />
      <path d="M 382 180 L 505 180" stroke="url(#piLineGrad)" strokeWidth="2" />

      {/* Moving Signal Pulse (Perception -> Action) */}
      {isMotionActive && (
        <>
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" filter="url(#piGlow)">
            <animateMotion path="M 160 180 L 350 180 L 540 180" dur="3s" repeatCount="indefinite" keyPoints="0;0.5;1" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </circle>
          <circle cx="0" cy="0" r="8" fill="#B5E1E7" opacity="0.6">
            <animateMotion path="M 160 180 L 350 180 L 540 180" dur="3s" repeatCount="indefinite" keyPoints="0;0.5;1" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </circle>
        </>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCHEMATIC DIAGRAM 2: Collective Intelligence
   Koneksi terdistribusi yang bergantian menyorot antaragen
───────────────────────────────────────────────────────────── */
function CollectiveIntelligenceSchematic({ isMotionActive }: { isMotionActive: boolean }) {
  return (
    <svg viewBox="0 0 700 360" className="w-full h-full drop-shadow-lg" fill="none" aria-hidden="true">
      <defs>
        <filter id="ciGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Distributed Inter-agent Grid */}
      <line x1="350" y1="90" x2="200" y2="230" stroke="rgba(181,225,231,0.2)" strokeWidth="1.5" />
      <line x1="350" y1="90" x2="500" y2="230" stroke="rgba(181,225,231,0.2)" strokeWidth="1.5" />
      <line x1="200" y1="230" x2="500" y2="230" stroke="rgba(181,225,231,0.15)" strokeWidth="1.5" />
      <line x1="350" y1="90" x2="350" y2="280" stroke="rgba(181,225,231,0.2)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="200" y1="230" x2="350" y2="280" stroke="rgba(181,225,231,0.15)" strokeWidth="1" />
      <line x1="500" y1="230" x2="350" y2="280" stroke="rgba(181,225,231,0.15)" strokeWidth="1" />

      {/* Alternating highlights */}
      {isMotionActive && (
        <>
          <line x1="350" y1="90" x2="200" y2="230" stroke="#B5E1E7" strokeWidth="2.5" opacity="0.8">
            <animate attributeName="opacity" values="0.2;0.9;0.2" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="200" y1="230" x2="500" y2="230" stroke="#7DD3FC" strokeWidth="2.5" opacity="0.8">
            <animate attributeName="opacity" values="0.2;0.9;0.2" dur="4s" begin="1.3s" repeatCount="indefinite" />
          </line>
          <line x1="500" y1="230" x2="350" y2="90" stroke="#F0F2ED" strokeWidth="2.5" opacity="0.8">
            <animate attributeName="opacity" values="0.2;0.9;0.2" dur="4s" begin="2.6s" repeatCount="indefinite" />
          </line>
        </>
      )}

      {/* Agent Nodes */}
      {/* Node Alpha (Top) */}
      <g transform="translate(350, 90)">
        <circle cx="0" cy="0" r="28" fill="#070C12" stroke="rgba(181,225,231,0.6)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="8" fill="#B5E1E7" filter="url(#ciGlow)" />
        <text x="0" y="-36" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">AGEN α</text>
      </g>

      {/* Node Beta (Bottom Left) */}
      <g transform="translate(200, 230)">
        <circle cx="0" cy="0" r="24" fill="#070C12" stroke="rgba(181,225,231,0.45)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="7" fill="#7DD3FC" />
        <text x="0" y="44" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">AGEN β</text>
      </g>

      {/* Node Gamma (Bottom Right) */}
      <g transform="translate(500, 230)">
        <circle cx="0" cy="0" r="24" fill="#070C12" stroke="rgba(181,225,231,0.45)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="7" fill="#7DD3FC" />
        <text x="0" y="44" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">AGEN γ</text>
      </g>

      {/* Node Delta (Decentralized Consensus Root) */}
      <g transform="translate(350, 280)">
        <circle cx="0" cy="0" r="18" fill="#070C12" stroke="rgba(240,242,237,0.4)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="5" fill="#F0F2ED" />
        <text x="0" y="32" textAnchor="middle" fill="#ADBAC5" fontSize="9" fontFamily="monospace" letterSpacing="0.1em">KONSENSUS</text>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCHEMATIC DIAGRAM 3: Resilience Technology
   Jalur alternatif dengan simulasi gangguan interaktif
───────────────────────────────────────────────────────────── */
function ResilienceTechnologySchematic({
  isMotionActive,
  isDisturbed,
  toggleDisturbance,
}: {
  isMotionActive: boolean;
  isDisturbed: boolean;
  toggleDisturbance: () => void;
}) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <svg viewBox="0 0 700 360" className="w-full h-full drop-shadow-lg" fill="none" aria-hidden="true">
        <defs>
          <filter id="resGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Primary Nominal Channel */}
        <path
          d="M 120 180 L 580 180"
          stroke={isDisturbed ? "rgba(248,113,113,0.3)" : "rgba(181,225,231,0.6)"}
          strokeWidth={isDisturbed ? "1.5" : "2.5"}
          strokeDasharray={isDisturbed ? "6 6" : "none"}
        />

        {/* Secondary Resilient Bypass Channels (Upper & Lower) */}
        <path
          d="M 180 180 C 260 70, 440 70, 520 180"
          stroke={isDisturbed ? "#34D399" : "rgba(181,225,231,0.2)"}
          strokeWidth={isDisturbed ? "3" : "1.5"}
          fill="none"
        />
        <path
          d="M 180 180 C 260 290, 440 290, 520 180"
          stroke={isDisturbed ? "rgba(52,211,153,0.6)" : "rgba(181,225,231,0.15)"}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Ingress Node (Source) */}
        <g transform="translate(120, 180)">
          <circle cx="0" cy="0" r="24" fill="#070C12" stroke="rgba(181,225,231,0.6)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="7" fill="#B5E1E7" filter="url(#resGlow)" />
          <text x="0" y="42" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">SUMBER</text>
        </g>

        {/* Split Node 1 */}
        <circle cx="180" cy="180" r="8" fill="#070C12" stroke="#B5E1E7" strokeWidth="1.5" />

        {/* Disruption Target Zone / Normal Core */}
        <g transform="translate(350, 180)">
          <circle
            cx="0"
            cy="0"
            r="32"
            fill="#070C12"
            stroke={isDisturbed ? "rgba(248,113,113,0.8)" : "rgba(181,225,231,0.4)"}
            strokeWidth="1.5"
          />
          {isDisturbed ? (
            <>
              <circle cx="0" cy="0" r="10" fill="#F87171" filter="url(#resGlow)" />
              <text x="0" y="-44" textAnchor="middle" fill="#F87171" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">
                GANGGUAN AKTIF
              </text>
            </>
          ) : (
            <>
              <circle cx="0" cy="0" r="8" fill="#B5E1E7" />
              <text x="0" y="-44" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">
                JALUR UTAMA
              </text>
            </>
          )}
        </g>

        {/* Join Node 2 */}
        <circle cx="520" cy="180" r="8" fill="#070C12" stroke="#B5E1E7" strokeWidth="1.5" />

        {/* Egress Node (Destination) */}
        <g transform="translate(580, 180)">
          <circle cx="0" cy="0" r="24" fill="#070C12" stroke="rgba(181,225,231,0.6)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="7" fill="#34D399" filter="url(#resGlow)" />
          <text x="0" y="42" textAnchor="middle" fill="#ADBAC5" fontSize="10" fontFamily="monospace" letterSpacing="0.1em">TUJUAN</text>
        </g>

        {/* Bypass Peak Label */}
        {isDisturbed && (
          <g transform="translate(350, 65)">
            <rect x="-110" y="-14" width="220" height="26" rx="6" fill="#070C12" stroke="rgba(52,211,153,0.5)" strokeWidth="1" />
            <text x="0" y="3" textAnchor="middle" fill="#34D399" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">
              JALUR ALTERNATIF TERAKTIVASI
            </text>
          </g>
        )}

        {/* Moving Signal Pulse */}
        {isMotionActive && (
          <circle cx="0" cy="0" r="6" fill={isDisturbed ? "#34D399" : "#FFFFFF"} filter="url(#resGlow)">
            <animateMotion
              path={isDisturbed ? "M 120 180 L 180 180 C 260 70, 440 70, 520 180 L 580 180" : "M 120 180 L 580 180"}
              dur={isDisturbed ? "2.5s" : "2s"}
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>

      {/* Interactive Simulation Control (Prinsip 4) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20">
        <button
          type="button"
          onClick={toggleDisturbance}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border ${
            isDisturbed
              ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
              : "bg-[#14212B]/70 border-white/10 text-[#ADBAC5] hover:text-[#F0F2ED] hover:border-white/20"
          }`}
        >
          {isDisturbed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isDisturbed ? "Pulihkan Rute Nominal" : "Simulasi Gangguan"}</span>
        </button>
        <span className="text-[10px] font-mono text-[#ADBAC5]/60 tracking-wider">
          Ilustrasi Konseptual — Pengalihan Jalur Otomatis
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCHEMATIC DIAGRAM 4: Digital Twin Intelligence
   Korespondensi dua arah antara representasi fisik dan digital
───────────────────────────────────────────────────────────── */
function DigitalTwinSchematic({ isMotionActive }: { isMotionActive: boolean }) {
  return (
    <svg viewBox="0 0 700 360" className="w-full h-full drop-shadow-lg" fill="none" aria-hidden="true">
      <defs>
        <filter id="dtGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Upper Plane: Digital Twin Simulation Space */}
      <polygon points="350,40 560,95 350,150 140,95" fill="rgba(14,35,64,0.4)" stroke="rgba(181,225,231,0.5)" strokeWidth="1.5" />
      <circle cx="350" cy="95" r="12" fill="#B5E1E7" filter="url(#dtGlow)" />
      <text x="580" y="98" fill="#B5E1E7" fontSize="11" fontFamily="monospace" letterSpacing="0.1em">
        RUANG SIMULASI DIGITAL
      </text>

      {/* Lower Plane: Physical World Reality Space */}
      <polygon points="350,210 560,265 350,320 140,265" fill="rgba(7,12,18,0.7)" stroke="rgba(173,186,197,0.35)" strokeWidth="1.5" />
      <circle cx="350" cy="265" r="12" fill="#ADBAC5" />
      <text x="580" y="268" fill="#ADBAC5" fontSize="11" fontFamily="monospace" letterSpacing="0.1em">
        REALITAS SISTEM FISIK
      </text>

      {/* Bidirectional Telemetry & Sync Rays */}
      <line x1="350" y1="107" x2="350" y2="253" stroke="#B5E1E7" strokeWidth="2" strokeDasharray="4 4" />
      <line x1="245" y1="122" x2="245" y2="237" stroke="rgba(181,225,231,0.25)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="455" y1="122" x2="455" y2="237" stroke="rgba(181,225,231,0.25)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Dynamic Telemetry Exchange Pulses */}
      {isMotionActive && (
        <>
          {/* Telemetry Up (Physical -> Digital) */}
          <circle cx="350" cy="0" r="4" fill="#ADBAC5">
            <animate attributeName="cy" values="253;107" dur="2.4s" repeatCount="indefinite" />
          </circle>
          {/* Predictive Control Down (Digital -> Physical) */}
          <circle cx="350" cy="0" r="5" fill="#38BDF8" filter="url(#dtGlow)">
            <animate attributeName="cy" values="107;253" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCHEMATIC DIAGRAM 5: Safe Autonomous Systems
   Batas perimeter stabil dengan gerak halus di area berizin
───────────────────────────────────────────────────────────── */
function SafeAutonomousSystemsSchematic({ isMotionActive }: { isMotionActive: boolean }) {
  return (
    <svg viewBox="0 0 700 360" className="w-full h-full drop-shadow-lg" fill="none" aria-hidden="true">
      <defs>
        <filter id="safeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rock-Solid Outer Containment Perimeter (Stable & Fixed) */}
      <circle cx="350" cy="180" r="140" stroke="rgba(248,113,113,0.3)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x="350" y="28" textAnchor="middle" fill="#ADBAC5" fontSize="9" fontFamily="monospace" letterSpacing="0.15em">
        BATAS PERIMETER KESELAMATAN (TIDAK DAPAT DITEMBUS)
      </text>

      {/* Safe Permitted Operating Envelope */}
      <circle cx="350" cy="180" r="95" fill="rgba(181,225,231,0.04)" stroke="rgba(181,225,231,0.5)" strokeWidth="1.5" />
      <circle cx="350" cy="180" r="45" stroke="rgba(181,225,231,0.2)" strokeWidth="1" strokeDasharray="3 3" />

      {/* Axis markers */}
      <line x1="210" y1="180" x2="490" y2="180" stroke="rgba(181,225,231,0.1)" strokeWidth="1" />
      <line x1="350" y1="40" x2="350" y2="320" stroke="rgba(181,225,231,0.1)" strokeWidth="1" />

      {/* Center Anchor / Human Oversight Hub */}
      <circle cx="350" cy="180" r="14" fill="#070C12" stroke="#F0F2ED" strokeWidth="1.5" />
      <circle cx="350" cy="180" r="4" fill="#F0F2ED" />
      <text x="350" y="210" textAnchor="middle" fill="#F0F2ED" fontSize="9" fontFamily="monospace" letterSpacing="0.1em">
        OTORITAS MANUSIA
      </text>

      {/* Constrained Autonomous Agent Moving strictly inside permitted envelope */}
      {isMotionActive ? (
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 350 180"
            to="360 350 180"
            dur="16s"
            repeatCount="indefinite"
          />
          <circle cx="420" cy="180" r="9" fill="#070C12" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="420" cy="180" r="4" fill="#38BDF8" filter="url(#safeGlow)" />
        </g>
      ) : (
        <g>
          <circle cx="420" cy="180" r="9" fill="#070C12" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="420" cy="180" r="4" fill="#38BDF8" filter="url(#safeGlow)" />
        </g>
      )}
    </svg>
  );
}

export function ResearchFrontiersSection() {
  const [selectedId, setSelectedId] = useState<string>(RESEARCH_FRONTIERS[0].id);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isDisturbed, setIsDisturbed] = useState<boolean>(false);
  const { isMotionActive, shouldReduceMotion } = useLabMotion();

  // Stage local reticle pointer values (only within the stage canvas)
  const stageRef = useRef<HTMLDivElement>(null);
  const reticleX = useMotionValue(-100);
  const reticleY = useMotionValue(-100);
  const [isHoveringStage, setIsHoveringStage] = useState(false);

  const springConfig = { damping: 25, stiffness: 180 };
  const smoothReticleX = useSpring(reticleX, springConfig);
  const smoothReticleY = useSpring(reticleY, springConfig);

  const selectedFrontier =
    RESEARCH_FRONTIERS.find((f) => f.id === selectedId) || RESEARCH_FRONTIERS[0];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % RESEARCH_FRONTIERS.length;
      setSelectedId(RESEARCH_FRONTIERS[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + RESEARCH_FRONTIERS.length) % RESEARCH_FRONTIERS.length;
      setSelectedId(RESEARCH_FRONTIERS[prevIndex].id);
    }
  };

  const handleStagePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || e.pointerType === "touch" || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      reticleX.set(e.clientX - rect.left);
      reticleY.set(e.clientY - rect.top);
      setIsHoveringStage(true);
    },
    [shouldReduceMotion, reticleX, reticleY]
  );

  const handleStagePointerLeave = useCallback(() => {
    setIsHoveringStage(false);
  }, []);

  return (
    <section id="riset" className="py-24 sm:py-32 md:py-40 relative overflow-hidden scroll-mt-24">
      <div id="frontiers" className="sr-only" aria-hidden="true" />

      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Section Header with Staggered Entrance */}
        <LabSectionHeader
          number="03"
          label="Arah Eksplorasi Ilmiah"
          title="Lima Bidang Riset Frontier"
          className="mb-14 sm:mb-16"
        />

        {/* ── Top Tab Selector (Pilihan Bidang) ── */}
        <div
          role="tablist"
          aria-label="Pilihan Bidang Riset HCFTL"
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8"
        >
          {RESEARCH_FRONTIERS.map((f, index) => {
            const isSelected = f.id === selectedId;
            return (
              <button
                key={f.id}
                role="tab"
                id={`tab-${f.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${f.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedId(f.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`relative px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 focus:outline-none flex items-center gap-2.5 whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? "bg-[#14212B] text-[#F0F2ED] border-[#B5E1E7]/40 shadow-[0_0_16px_rgba(181,225,231,0.12)]"
                    : "bg-[#070C12]/60 text-[#ADBAC5] border-white/[0.06] hover:text-[#F0F2ED] hover:border-white/15 hover:bg-[#14212B]/40"
                }`}
              >
                <span className={`font-mono text-xs ${isSelected ? "text-[#B5E1E7] font-semibold" : "text-[#ADBAC5]/60"}`}>
                  {f.number}
                </span>
                <span>{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Stage (Visual Panggung) ── */}
        <div className="bg-[#070C12] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFrontier.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              id={`panel-${selectedFrontier.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${selectedFrontier.id}`}
              className="flex flex-col h-full flex-grow"
            >
              {/* Upper Area: Split Layout Diagram (60%) + Summary (40%) on Desktop */}
              <div className="flex flex-col lg:flex-row flex-grow min-h-[420px]">
                
                {/* Left: Dominant Diagram Canvas with Local Reticle */}
                <div
                  ref={stageRef}
                  onPointerMove={handleStagePointerMove}
                  onPointerLeave={handleStagePointerLeave}
                  className="w-full lg:w-[60%] border-b lg:border-b-0 lg:border-r border-white/[0.08] p-6 sm:p-10 flex items-center justify-center relative overflow-hidden bg-[#05080C] min-h-[320px] sm:min-h-[400px]"
                >
                  {/* Subtle Grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.15] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(#ADBAC5 1px, transparent 1px)", backgroundSize: "32px 32px" }}
                  />

                  {/* Stage-local Reticle aura (Desktop only, doesn't interfere with clicks) */}
                  {isHoveringStage && !shouldReduceMotion && (
                    <motion.div
                      style={{ x: smoothReticleX, y: smoothReticleY }}
                      className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block"
                    >
                      <div className="w-8 h-8 rounded-full border border-[#B5E1E7]/40 bg-[#B5E1E7]/5 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-[#B5E1E7]" />
                      </div>
                    </motion.div>
                  )}

                  {/* Active Domain Schematic */}
                  <div className="relative w-full max-w-[620px] aspect-[16/9] flex items-center justify-center z-10">
                    {selectedFrontier.id === "physical-intelligence" && (
                      <PhysicalIntelligenceSchematic isMotionActive={isMotionActive} />
                    )}
                    {selectedFrontier.id === "collective-intelligence" && (
                      <CollectiveIntelligenceSchematic isMotionActive={isMotionActive} />
                    )}
                    {selectedFrontier.id === "resilience-technology" && (
                      <ResilienceTechnologySchematic
                        isMotionActive={isMotionActive}
                        isDisturbed={isDisturbed}
                        toggleDisturbance={() => setIsDisturbed(!isDisturbed)}
                      />
                    )}
                    {selectedFrontier.id === "digital-twin-intelligence" && (
                      <DigitalTwinSchematic isMotionActive={isMotionActive} />
                    )}
                    {selectedFrontier.id === "safe-autonomous-systems" && (
                      <SafeAutonomousSystemsSchematic isMotionActive={isMotionActive} />
                    )}
                  </div>
                </div>

                {/* Right: Caption & Summary (Always Visible Layer) */}
                <div className="w-full lg:w-[40%] p-8 sm:p-10 flex flex-col justify-between bg-[#080D14]">
                  <div>
                    <div className="flex items-center gap-3 mb-4 font-mono text-[11px] text-[#B5E1E7] uppercase tracking-widest">
                      <span>Bidang Riset {selectedFrontier.number}</span>
                      <span>·</span>
                      <span className="text-[#ADBAC5]/60">{selectedFrontier.status}</span>
                    </div>

                    <h3 className={`${lora.className} text-2xl sm:text-3xl font-normal text-[#F0F2ED] mb-5`}>
                      {selectedFrontier.title}
                    </h3>

                    <p className="text-[#ADBAC5] font-light leading-relaxed text-base sm:text-lg mb-8">
                      {selectedFrontier.description}
                    </p>
                  </div>

                  {/* Disclosure Trigger Button: 'Dalami bidang ini' */}
                  <div className="pt-6 border-t border-white/[0.06] mt-auto flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsDetailOpen(!isDetailOpen)}
                      aria-expanded={isDetailOpen}
                      aria-controls={`detail-panel-${selectedFrontier.id}`}
                      className="group inline-flex items-center gap-3 text-sm font-medium text-[#ADBAC5] hover:text-[#F0F2ED] transition-colors focus:outline-none cursor-pointer py-1"
                    >
                      <span className="w-6 h-6 rounded-full border border-white/10 bg-white/[0.03] group-hover:border-white/25 flex items-center justify-center transition-colors">
                        {isDetailOpen ? (
                          <Minus className="w-3.5 h-3.5 text-[#B5E1E7]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-[#ADBAC5] group-hover:text-[#F0F2ED]" />
                        )}
                      </span>
                      <span>{isDetailOpen ? "Tutup rincian bidang" : "Dalami bidang ini"}</span>
                    </button>

                    <span className="text-[10px] font-mono text-[#B5E1E7]/80 uppercase tracking-widest border border-[#B5E1E7]/20 px-2.5 py-1 rounded-full">
                      HCFTL CORE
                    </span>
                  </div>
                </div>

              </div>

              {/* Expandable Detail Layer (Dalami Bidang Ini) */}
              <AnimatePresence>
                {isDetailOpen && (
                  <motion.div
                    id={`detail-panel-${selectedFrontier.id}`}
                    role="region"
                    aria-label={`Rincian Bidang Riset ${selectedFrontier.title}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: CUBIC_EASE }}
                    className="overflow-hidden border-t border-white/[0.08] bg-[#06090F]"
                  >
                    <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      {/* Research Question */}
                      <div className="md:pr-8 md:border-r border-white/[0.06]">
                        <span className="text-[10px] font-mono text-[#ADBAC5]/60 uppercase tracking-widest block mb-2">
                          Pertanyaan Riset Utama
                        </span>
                        <p className={`${lora.className} text-lg sm:text-xl text-[#F0F2ED] font-light italic leading-relaxed`}>
                          &ldquo;{selectedFrontier.question}&rdquo;
                        </p>
                      </div>

                      {/* Scope & Methodology Focus */}
                      <div>
                        <span className="text-[10px] font-mono text-[#ADBAC5]/60 uppercase tracking-widest block mb-3">
                          Ruang Lingkup & Kata Kunci
                        </span>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedFrontier.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#ADBAC5]"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-mono text-[#ADBAC5]/70 leading-relaxed">
                          Status Eksplorasi: Dikelola di bawah sandbox keamanan terisolasi dengan verifikasi telemetri berulang sebelum transisi ke pengujian fisik.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
