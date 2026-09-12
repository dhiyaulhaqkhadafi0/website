"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, ShieldCheck, Lock, Unlock, FileText } from "lucide-react";
import { ResourceItem } from "@/lib/resource-types";
import { ResourceCardThumbnail } from "./ResourceCardThumbnail";

interface ResourceCardProps {
  resource: ResourceItem;
}

const TYPE_LABEL_MAP: Record<string, string> = {
  template: "TEMPLATE",
  playbook: "PLAYBOOK",
  framework: "FRAMEWORK",
  "prompt-pack": "PROMPT PACK",
  checklist: "CHECKLIST",
  "curated-list": "CURATED LIST",
  "mini-tool": "INTERACTIVE TOOL",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const isDirect = resource.accessLevel === "direct-access";
  const isOpen = resource.accessLevel === "open";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-3xl p-[1.5px] bg-gradient-to-r from-slate-400/20 via-slate-200/30 via-sky-400/20 to-slate-400/20 animate-gradient-flow shadow-[0_12px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_50px_rgba(56,189,248,0.2)] transition-all duration-300 flex flex-col justify-between"
    >
      {/* Frosted Glass Charcoal Semi-Keabuan Inner Container */}
      <div className="w-full h-full rounded-[23px] bg-[#0E131E]/95 hover:bg-[#131A29]/95 p-6 backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden transition-colors duration-300 border border-[#202738]/60">
        {/* Subtle Ambient Hover Glow */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: resource.accentGlow || "rgba(56,189,248,0.15)",
          }}
        />

        <div>
          {/* Conceptual Visual Thumbnail */}
          <Link href={`/resources/${resource.slug}`} className="block mb-5 overflow-hidden rounded-2xl">
            <ResourceCardThumbnail
              slug={resource.slug}
              type={resource.type}
              topic={resource.topic}
            />
          </Link>

          {/* Metadata Row: Format & Access Status */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 text-[10px] font-mono tracking-wider text-slate-300 uppercase">
                {TYPE_LABEL_MAP[resource.type] || resource.type}
              </span>
              {resource.badge && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/25">
                  <ShieldCheck className="w-2.5 h-2.5 text-sky-400" />
                  {resource.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono">
              {isOpen ? (
                <span className="inline-flex items-center gap-1 text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Unlock className="w-3 h-3" />
                  <span>Open</span>
                </span>
              ) : isDirect ? (
                <span className="inline-flex items-center gap-1 text-sky-400/90 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  <FileText className="w-3 h-3" />
                  <span>Direct</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  <Lock className="w-3 h-3" />
                  <span>Member</span>
                </span>
              )}
            </div>
          </div>

          {/* Card Title */}
          <Link href={`/resources/${resource.slug}`} className="block group/title">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover/title:text-sky-200 transition-colors duration-200 leading-snug">
              {resource.title}
            </h3>
          </Link>

          {/* Simple Clean Description */}
          <p className="mt-2 text-xs sm:text-sm text-slate-300/80 font-light leading-relaxed line-clamp-2">
            {resource.tagline}
          </p>
        </div>

        {/* Card Footer: Effort & Alive Interactive Button */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{resource.readTimeOrEffort}</span>
          </div>

          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-white px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white text-white hover:text-black border border-white/10 hover:border-transparent transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-[0.98] group/btn"
          >
            <span>Eksplorasi</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
