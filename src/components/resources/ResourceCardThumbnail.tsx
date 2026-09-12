"use client";

import {
  FileText,
  Terminal,
  Layers,
  CheckCircle2,
  Workflow,
  Sparkles,
  BarChart3,
  Search,
  Compass,
  Cpu,
} from "lucide-react";

interface ThumbnailProps {
  slug: string;
  type: string;
  topic: string;
}

export function ResourceCardThumbnail({ slug }: ThumbnailProps) {
  switch (slug) {
    case "ai-product-blueprint":
      return (
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#0B1528] via-[#08101E] to-[#040812] border border-sky-500/20 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-sky-400/40 transition-colors">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-sky-500/20 rounded-full blur-xl" />
          <div className="flex items-center justify-between text-[11px] font-mono text-sky-300">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              PRD_SPEC_V2.ts
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-[10px] text-sky-200">
              BLUEPRINT
            </span>
          </div>
          <div className="space-y-2 font-mono text-[10px] text-white/70">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <span>01. Core Job Isolation</span>
              <span className="text-emerald-400">PASSED</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <span>02. Agent Context Priming</span>
              <span className="text-sky-400">READY</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Next.js + AI Copilot</span>
            <span className="text-sky-300">15 min apply</span>
          </div>
        </div>
      );

    case "vibe-coding-field-guide":
      return (
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#061812] via-[#04120D] to-[#020A07] border border-emerald-500/20 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-emerald-400/40 transition-colors">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl" />
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              AGENTS.md / rules
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-200">
              PLAYBOOK
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/20 font-mono text-[10px] text-emerald-200/90 leading-tight">
            <span className="text-white/40">$</span> git diff --stat<br />
            <span className="text-emerald-400">+7 rules enforced</span> • 0 regressions<br />
            <span className="text-white/50">cursor --strict-context</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Anti-Hallucination</span>
            <span className="text-emerald-300">12 min read</span>
          </div>
        </div>
      );

    case "high-context-prompts-pack":
      return (
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#0C1524] via-[#09101C] to-[#050A12] border border-indigo-500/20 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-indigo-400/40 transition-colors">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl" />
          <div className="flex items-center justify-between text-[11px] font-mono text-indigo-300">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              SYSTEM_PROMPT_MATRIX
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[10px] text-indigo-200">
              24 PROMPTS
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5 text-indigo-100 flex items-center justify-between">
              <span>PRD Stress-Tester</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/30">COPYABLE</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5 text-white/70 flex items-center justify-between">
              <span>Story Angle Deconstructor</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10">COPYABLE</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Structured JSON & MD</span>
            <span className="text-indigo-300">1-Click Copy</span>
          </div>
        </div>
      );

    case "ai-content-operating-system":
      return (
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#170C26] via-[#11081D] to-[#090410] border border-purple-500/20 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-purple-400/40 transition-colors">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
          <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
            <span className="flex items-center gap-1">
              <Workflow className="w-3.5 h-3.5 text-purple-400" />
              CONTENT_OS_PIPELINE
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[10px] text-purple-200">
              NOTION OS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-center">
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-white/40 text-[8px]">INPUT</div>
              <div className="text-purple-200 font-semibold mt-0.5">1 Essay</div>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="text-purple-300 text-[8px]">AI SPLIT</div>
              <div className="text-purple-100 font-semibold mt-0.5">5 Assets</div>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-white/40 text-[8px]">OUTPUT</div>
              <div className="text-purple-200 font-semibold mt-0.5">Multi-Pub</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Zero Burnout Flow</span>
            <span className="text-purple-300">20 min setup</span>
          </div>
        </div>
      );

    case "mvp-readiness-checklist":
      return (
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#201305] via-[#170E04] to-[#0D0702] border border-amber-500/20 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-amber-400/40 transition-colors">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl" />
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              MVP_32_AUDIT_GATE
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px] text-amber-200">
              CHECKLIST
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <span>✓ Auth RLS & Secrets</span>
              <span>100% OK</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <span>✓ Core Web Vitals & OG</span>
              <span>PASSED</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Launch Safe Guard</span>
            <span className="text-amber-300">10 min audit</span>
          </div>
        </div>
      );

    case "creator-to-founder-framework":
      return (
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#220B19] via-[#190812] to-[#0E040A] border border-rose-500/20 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-rose-400/40 transition-colors">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-rose-500/20 rounded-full blur-xl" />
          <div className="flex items-center justify-between text-[11px] font-mono text-rose-300">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
              FOUNDER_VALUE_LADDER
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-[10px] text-rose-200">
              STRATEGY
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-16 pt-2">
            <div className="flex-1 bg-white/10 rounded-t h-1/4 flex items-center justify-center text-[8px] font-mono text-white/40">Jasa</div>
            <div className="flex-1 bg-white/20 rounded-t h-2/4 flex items-center justify-center text-[8px] font-mono text-white/60">Template</div>
            <div className="flex-1 bg-rose-500/40 rounded-t h-3/4 flex items-center justify-center text-[8px] font-mono text-rose-200">Productized</div>
            <div className="flex-1 bg-rose-500/80 rounded-t h-full flex items-center justify-center text-[8px] font-mono text-white font-bold">Software</div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Asset Ownership</span>
            <span className="text-rose-300">15 min read</span>
          </div>
        </div>
      );

    case "ai-assisted-research-workflow":
      return (
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#061822] via-[#041119] to-[#020A0E] border border-teal-500/20 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-teal-400/40 transition-colors">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-500/20 rounded-full blur-xl" />
          <div className="flex items-center justify-between text-[11px] font-mono text-teal-300">
            <span className="flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-teal-400" />
              SEMANTIC_SYNTHESIS
            </span>
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-[10px] text-teal-200">
              RESEARCH
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-teal-500/20 font-mono text-[10px] text-teal-200/90 leading-tight">
            100+ Papers → 1 Matrix Synthesis<br />
            <span className="text-white/40">Cross-Validation Vector Embeddings</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Evidence Ladder</span>
            <span className="text-teal-300">10 min read</span>
          </div>
        </div>
      );

    case "personal-brand-positioning-canvas":
    default:
      return (
        <div className="w-full h-44 rounded-2xl bg-gradient-to-br from-[#170E28] via-[#10091C] to-[#08040E] border border-violet-500/20 p-4 flex flex-col justify-between relative overflow-hidden group-hover:border-violet-400/40 transition-colors">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-violet-500/20 rounded-full blur-xl" />
          <div className="flex items-center justify-between text-[11px] font-mono text-violet-300">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              POV_POSITIONING_CANVAS
            </span>
            <span className="px-2 py-0.5 rounded bg-violet-500/20 text-[10px] text-violet-200">
              CANVAS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px] text-center text-violet-200">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">Unique POV</div>
            <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">Skill Stack</div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/5">Proof of Work</div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Defensible Moat</span>
            <span className="text-violet-300">15 min exercise</span>
          </div>
        </div>
      );
  }
}
