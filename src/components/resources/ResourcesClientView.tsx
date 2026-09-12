"use client";

import { useState } from "react";
import { ResourceItem, ResourceTopic } from "@/lib/resource-types";
import { ResourcesHero } from "./ResourcesHero";
import { IntentRouter } from "./IntentRouter";
import { FeaturedResourceCard } from "./FeaturedResourceCard";
import { SystemsMatrixSection } from "./SystemsMatrixSection";
import { ResourceExplorer } from "./ResourceExplorer";
import Link from "next/link";
import { ArrowRight, Compass, Layers } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

interface ResourcesClientViewProps {
  resources: ResourceItem[];
  featuredResource: ResourceItem;
}

export function ResourcesClientView({
  resources,
  featuredResource,
}: ResourcesClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<ResourceTopic>("all");

  const handleSelectIntent = (topic: ResourceTopic) => {
    setActiveTopic(topic);
    // Smooth scroll to the explorer section
    const el = document.getElementById("explorer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchSubmit = () => {
    const el = document.getElementById("explorer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-white selection:bg-indigo-500/30 selection:text-indigo-100 font-sans relative overflow-x-hidden">
      {/* Dynamic Global Background Gradients & Soft Lighting across the canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-sky-600/[0.07] rounded-full blur-[160px]" />
        <div className="absolute top-[30%] right-10 w-[600px] h-[600px] bg-indigo-600/[0.05] rounded-full blur-[180px]" />
        <div className="absolute top-[65%] left-10 w-[700px] h-[700px] bg-emerald-600/[0.04] rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <ResourcesHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Section Divider 1: Subtle Luminous Line */}
        <div className="max-w-7xl mx-auto px-8 my-4">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
        </div>

        {/* Intent Router: "Start Here / Pilih Jalur" */}
        <IntentRouter
          activeTopic={activeTopic}
          onSelectIntent={handleSelectIntent}
        />

        {/* Section Divider 2 */}
        <div className="max-w-7xl mx-auto px-8 my-4">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        </div>

        {/* Featured Resource Spotlight */}
        <FeaturedResourceCard resource={featuredResource} />

        {/* Section Divider 3 */}
        <div className="max-w-7xl mx-auto px-8 my-4">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        </div>

        {/* Signature Systems Matrix (4 Pillars) */}
        <SystemsMatrixSection />

        {/* Section Divider 4 */}
        <div className="max-w-7xl mx-auto px-8 my-4">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        </div>

        {/* The Resource Explorer (Centered Filter & 3-Col Glass Grid) */}
        <ResourceExplorer
          resources={resources}
          initialTopic={activeTopic}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Bottom Authority & Community CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#0F1528]/95 to-[#080B14]/95 border border-sky-500/20 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-sky-300 mb-5 shadow-inner">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Continuous Knowledge Flywheel</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
                Sistem dan resource baru terus ditambahkan{" "}
                <span className={`${lora.className} italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-white`}>
                  seiring eksperimen nyata.
                </span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-white/65 max-w-xl mx-auto font-light leading-relaxed">
                Tidak ada teori kosong atau rangkuman generik. Semua template diuji dalam proyek produk digital, alur kerja AI, dan kasus produksi sesungguhnya.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/komunitas"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-[0_4px_25px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Gabung Diskusi di Komunitas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs sm:text-sm transition-all hover:border-sky-400/40"
                >
                  <span>Baca Esai di Blog</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
