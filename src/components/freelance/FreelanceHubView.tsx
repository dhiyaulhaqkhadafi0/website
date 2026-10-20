"use client";

import { FreelanceBusinessTeaser } from './BusinessHubShared';
import { useState } from "react";
import { MotionConfig } from "framer-motion";
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

import { FreelanceSubscribe } from "./FreelanceSubscribe";
import { FreelanceInquiryModal } from "./FreelanceInquiryModal";


export function FreelanceHubView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("Semua");

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const handleScrollToLibrary = () => {
    const el = document.getElementById("explore-library");
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
  };

  const handleOpenInquiry = () => setIsInquiryOpen(true);
  const handleCloseInquiry = () => setIsInquiryOpen(false);

  return (
    <MotionConfig reducedMotion="user"><div id="hub-start" className={styles.hub}>
      <HubAtmosphere />
      <ReadingProgress startId="hub-start" endId="hub-end" titleId="hub-title" label="Progres menjelajahi Freelance Hub" />
      {/* 1. HERO SECTION */}
      <div>
        <FreelanceHero
          onScrollToLibrary={handleScrollToLibrary}

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
      <FreelanceBusinessTeaser/><FreelanceSubscribe />
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
