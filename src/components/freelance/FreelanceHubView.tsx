"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ReadingProgress } from "./ReadingProgress";
import { HubAtmosphere } from "./HubAtmosphere";
import styles from "./discovery.module.css";
import { FreelanceHero } from "./FreelanceHero";
import { RemoteWorldVisualizer } from "./RemoteWorldVisualizer";
import {
  FreelanceExploreLibrary,
  type FilterCategory,
} from "./FreelanceExploreLibrary";
import { FreelanceLibraryGrid } from "./FreelanceLibraryGrid";
import { FreelanceClosingCTA } from "./FreelanceClosingCTA";

import { FreelanceInquiryModal } from "./FreelanceInquiryModal";

const SECONDARY_NAV = [
  { label: "Jelajahi", href: "#explore-library" },
  { label: "Belajar", href: "#card-belajar" },
  { label: "Lowongan", href: "#card-lowongan" },
  { label: "Direktori", href: "#card-direktori" },
  { label: "Sumber Daya", href: "#card-resources" },
  { label: "Perjalanan", href: "#card-perjalanan" },
];

export function FreelanceHubView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("Semua");

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Show secondary nav after hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSecondaryNav(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
  };

  const handleScrollToLibrary = () => {
    const el = document.getElementById("explore-library");
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
  };

  const handleScrollToJobs = () => {
    const el = document.getElementById("card-lowongan");
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
    } else {
      handleScrollToLibrary();
    }
  };

  const handleOpenInquiry = () => setIsInquiryOpen(true);
  const handleCloseInquiry = () => setIsInquiryOpen(false);

  return (
    <MotionConfig reducedMotion="user"><div id="hub-start" className={styles.hub}>
      <HubAtmosphere />
      <ReadingProgress startId="hub-start" endId="hub-end" titleId="hub-title" label="Progres menjelajahi Freelance Hub" />
      {/* Secondary sticky navigation */}
      <AnimatePresence>
        {showSecondaryNav && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-[80] bg-[#242522]/95 backdrop-blur-xl border-b border-[rgba(255,255,255,0.07)]"
            aria-label="Navigasi Freelance"
          >
            <div className="container mx-auto px-6 max-w-[1240px] flex items-center justify-between h-12">
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#898B84] hidden sm:block">
                Freelance
              </span>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {SECONDARY_NAV.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    type="button"
                    className="shrink-0 px-3 py-1.5 text-[12px] font-medium text-[#898B84] hover:text-[#ECEDE7] transition-colors rounded-[4px] hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleScrollToLibrary}
                type="button"
                className="shrink-0 hidden sm:flex items-center justify-center px-4 py-1.5 text-[12px] font-semibold text-[#898B84] hover:text-[#ECEDE7] transition-colors"
              >
                Cari
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <div ref={heroRef}>
        <FreelanceHero
          onScrollToLibrary={handleScrollToLibrary}
          onScrollToJobs={handleScrollToJobs}
        />
      </div>
      <div className={styles.connector} aria-hidden="true">01 / Lihat dunianya <span /></div>

      {/* 2. WORLD VISUALIZER */}
      <RemoteWorldVisualizer
        onSelectCategory={(cat) => setSelectedCategory(cat as FilterCategory)}
        onOpenInquiry={handleOpenInquiry}
      />
      <div className={styles.connector} aria-hidden="true">02 / Temukan jalanmu <span /></div>

      {/* 3. SEARCH & FILTERS */}
      <FreelanceExploreLibrary
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 4. LIBRARY GRID */}
      <FreelanceLibraryGrid />

      <div className={styles.connector} aria-hidden="true">03 / Terus bergerak <span /></div>
      {/* 5. CLOSING CTA */}
      <div id="hub-end">
      <FreelanceClosingCTA
        onOpenInquiry={handleOpenInquiry}
      />
      </div>

      {/* MODALS */}

      <FreelanceInquiryModal
        isOpen={isInquiryOpen}
        onClose={handleCloseInquiry}
      />
    </div></MotionConfig>
  );
}
