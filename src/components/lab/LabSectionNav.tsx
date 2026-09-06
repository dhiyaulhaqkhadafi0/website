"use client";

import { useEffect, useState } from "react";
import { LAB_NAV_ITEMS } from "@/lib/hcftl";
import { HCFTLWordmark } from "./HCFTLWordmark";

export function LabSectionNav() {
  const [activeSection, setActiveSection] = useState<string>("tentang");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (const item of LAB_NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 90;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      aria-label="Navigasi Seksi Lab"
      className="sticky top-16 md:top-20 z-40 w-full py-2.5 backdrop-blur-xl bg-[#070B10]/90 border-y border-white/[0.06] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Lab identifier */}
        <div className="flex items-center gap-2.5 shrink-0">
          <HCFTLWordmark size="xs" variant="silver" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#7DD3FC]/80 hidden sm:inline">
            {"//"} INDEPENDENT LAB
          </span>
        </div>

        {/* Navigation buttons - horizontally scrollable on mobile */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          {LAB_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`text-xs font-mono tracking-wider px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#7DD3FC]/15 text-[#BAE6FD] border border-[#7DD3FC]/30 shadow-[0_0_12px_rgba(125,211,252,0.12)] font-medium"
                    : "text-[#8899A6] hover:text-[#F4F7FA] hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Status chip */}
        <div className="text-[10px] font-mono text-[#66717F] tracking-wider uppercase shrink-0 hidden md:inline">
          EST. 2026
        </div>
      </div>
    </nav>
  );
}
