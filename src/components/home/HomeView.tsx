"use client";

import { useState } from "react";
import { Hero } from "./Hero";
import { PathRouter } from "./PathRouter";
import { WhatIBuild } from "./WhatIBuild";
import { SelectedWork } from "./SelectedWork";
import { ProductsEcosystem } from "./ProductsEcosystem";
import { FreelancePreview } from "./FreelancePreview";
import { ResourcesPreview } from "./ResourcesPreview";
import { BlogPreview } from "./BlogPreview";
import { CurrentlyBuilding } from "./CurrentlyBuilding";
import { AboutPreview } from "./AboutPreview";
import { NewsletterSection } from "./NewsletterSection";
import { FinalCTA } from "./FinalCTA";
import { ProjectInquiryModal } from "@/components/shared/ProjectInquiryModal";
import type { BlogCardItem } from "@/lib/mdx";

interface HomeViewProps {
  posts: BlogCardItem[];
}

export function HomeView({ posts }: HomeViewProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="relative w-full overflow-hidden bg-[#05050A] text-[#ECEDE7]">
      {/* 01. Hero */}
      <Hero onOpenInquiry={() => setInquiryOpen(true)} />

      {/* 02. Choose Your Path */}
      <PathRouter onOpenInquiry={() => setInquiryOpen(true)} />

      {/* 03. What I Build */}
      <WhatIBuild onOpenInquiry={() => setInquiryOpen(true)} />

      {/* 04. Selected Work */}
      <SelectedWork />

      {/* 05. Things I'm Building (Products) - anchor id="produk" */}
      <ProductsEcosystem />

      {/* 06. Freelance Journey */}
      <FreelancePreview />

      {/* 07. Resources / Knowledge */}
      <ResourcesPreview />

      {/* 08. The Digital Grimoire */}
      <BlogPreview posts={posts} />

      {/* 09. Currently Building */}
      <CurrentlyBuilding />

      {/* 10. About Khadafi - anchor id="certifications" */}
      <AboutPreview />

      {/* 11. Newsletter */}
      <NewsletterSection />

      {/* 12. Final CTA */}
      <FinalCTA onOpenInquiry={() => setInquiryOpen(true)} />

      {/* Shared Project Inquiry Modal */}
      <ProjectInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </div>
  );
}
