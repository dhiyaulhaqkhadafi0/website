"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { FilterCategory } from "./FreelanceExploreLibrary";

interface FreelanceLibraryGridProps {
  searchQuery: string;
  selectedCategory: FilterCategory;
}

// 1. Featured Card — with background surface
function FeaturedCard({
  index,
  label,
  title,
  description,
  ctaLabel,
  href,
  id,
}: {
  index: string;
  label: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col justify-between p-8 sm:p-10 border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)] bg-[#33342F] hover:-translate-y-[3px] transition-all duration-300 rounded-[8px] min-h-[280px]"
    >
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">{title}</span>
      </Link>
      
      <div>
        <span className="block text-[11px] font-bold tracking-[0.18em] text-[#A1A39B] mb-4">
          {index}
        </span>
        <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#A1A39B] mb-2">
          {label}
        </span>
        <h3 className="text-[20px] sm:text-[22px] font-black tracking-[-0.02em] text-[#ECEDE7] leading-tight mb-3 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-[13px] sm:text-[14px] text-[#A1A39B] leading-relaxed font-normal">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.07)]">
        <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C3C5BD] group-hover:text-[#ECEDE7] transition-colors">
          <span>{ctaLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </motion.div>
  );
}

// 2. Editorial List Card — no background, top border only
function EditorialListCard({
  index,
  title,
  description,
  ctaLabel,
  href,
  id,
}: {
  index: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col pt-6 border-t border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)] transition-colors duration-300"
    >
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">{title}</span>
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] font-bold tracking-[0.18em] text-[#A1A39B]">
          {index}
        </span>
        <h3 className="text-[17px] font-bold tracking-[-0.01em] text-[#ECEDE7] leading-tight group-hover:text-white transition-colors">
          {title}
        </h3>
      </div>
      
      <p className="text-[13px] text-[#A1A39B] leading-relaxed font-normal mb-5 flex-1">
        {description}
      </p>

      <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#C3C5BD] group-hover:text-[#ECEDE7] transition-colors mt-auto">
        <span>{ctaLabel}</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </motion.div>
  );
}

// 3. Mini Preview Row — for specific list items
function PreviewItemRow({
  title,
  subtitle,
  meta,
  tags,
  href,
}: {
  title: string;
  subtitle: string;
  meta: string;
  tags: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="w-full group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-t border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.12)] transition-colors text-left"
    >
      <div>
        <h4 className="text-[15px] font-bold text-[#ECEDE7] group-hover:text-white transition-colors">
          {title}
        </h4>
        <div className="text-[12px] text-[#A1A39B] mt-1 flex flex-wrap gap-x-2">
          <span>{subtitle}</span>
          <span className="hidden sm:inline">·</span>
          <span>{meta}</span>
        </div>
        <p className="text-[12px] text-[#898B84] mt-1.5">{tags}</p>
      </div>
      
      <div className="shrink-0 flex items-center gap-1.5 text-[12px] font-medium text-[#A1A39B] group-hover:text-[#ECEDE7] transition-colors">
        Detail <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export function FreelanceLibraryGrid({
  searchQuery,
  selectedCategory,
}: FreelanceLibraryGridProps) {
  const query = searchQuery.toLowerCase().trim();

  const matchesSearch = (text: string) => {
    if (!query) return true;
    return text.toLowerCase().includes(query);
  };

  const isVisible = (cardCategory: FilterCategory, searchableContent: string) => {
    const categoryMatches =
      selectedCategory === "Semua" || selectedCategory === cardCategory;
    const searchMatches = matchesSearch(searchableContent);
    return categoryMatches && searchMatches;
  };

  const showBelajar = isVisible("Panduan", "mulai freelance panduan remote work");
  const showLowongan = isVisible("Lowongan", "lowongan remote peluang kerja job board");
  const showDirektori = isVisible("Direktori", "direktori situs kerja remote platform");
  const showTooling = isVisible("Tools", "tooling sistem AI tools Notion");
  const showResources = isVisible("Sumber Daya", "sumber daya template panduan checklist");

  const totalVisible =
    (showBelajar ? 1 : 0) +
    (showLowongan ? 1 : 0) +
    (showDirektori ? 1 : 0) +
    (showTooling ? 1 : 0) +
    (showResources ? 1 : 0);

  if (totalVisible === 0) {
    return (
      <section className="relative w-full py-12 bg-[#292A27]">
        <div className="container mx-auto px-6 max-w-[1240px]">
          <div className="py-20 text-center border border-[rgba(255,255,255,0.07)] rounded-[8px] bg-[#33342F] max-w-lg mx-auto p-8">
            <h3 className="text-[16px] font-bold text-[#ECEDE7] mb-2">
              Tidak ditemukan
            </h3>
            <p className="text-[13px] text-[#A1A39B]">
              Coba kata kunci lain seperti &ldquo;remote&rdquo;, &ldquo;tools&rdquo;, atau &ldquo;panduan&rdquo;.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full pt-16 pb-20 md:pt-20 md:pb-28 bg-[#292A27]">
      <div className="container mx-auto px-6 max-w-[1240px]">
        {/* Hub Main Cards */}
        <div className="space-y-16">
          
          {/* TOP ROW: 2 Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showBelajar && (
              <FeaturedCard
                id="card-belajar"
                index="01"
                label="Panduan & Sistem"
                title="Mulai Freelance"
                description="Panduan memahami freelance dari dasar hingga mendapatkan peluang pertama. Mindset, sistem, workflow, klien, dan pricing."
                ctaLabel="Mulai belajar"
                href="/freelance/belajar/mulai-freelance"
              />
            )}
            
            {showLowongan && (
              <FeaturedCard
                id="card-lowongan"
                index="02"
                label="Peluang Kerja Global"
                title="Lowongan Remote"
                description="Peluang kerja remote dan freelance dari berbagai platform dan negara. Dikurasi dari sumber yang tersedia secara publik."
                ctaLabel="Lihat lowongan"
                href="/freelance/lowongan"
              />
            )}
          </div>

          {/* SECOND ROW: 3 Editorial Cards */}
          {(showDirektori || showTooling || showResources) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10">
              {showDirektori && (
                <EditorialListCard
                  id="card-direktori"
                  index="03"
                  title="Direktori Kerja"
                  description="Situs kerja remote, platform freelance, dan marketplace."
                  ctaLabel="Jelajahi direktori"
                  href="/freelance/direktori"
                />
              )}
              {showTooling && (
                <EditorialListCard
                  id="card-tooling"
                  index="04"
                  title="Tooling &amp; Sistem"
                  description="AI, workflow, dan tools produktivitas yang saya gunakan."
                  ctaLabel="Lihat toolkit"
                  href="/freelance/tools"
                />
              )}
              {showResources && (
                <EditorialListCard
                  id="card-resources"
                  index="05"
                  title="Sumber Daya"
                  description="Template, kontrak, checklist, dan prompt siap pakai."
                  ctaLabel="Ambil resource"
                  href="/freelance/sumber-daya"
                />
              )}
            </div>
          )}
        </div>

        {/* Content Previews (Shows when no search filter active) */}
        {selectedCategory === "Semua" && !searchQuery && (
          <div className="mt-24 pt-16 border-t border-[rgba(255,255,255,0.07)] grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Preview: Platform */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-[18px] font-bold text-[#ECEDE7] mb-6">
                Platform yang layak dicoba
              </h3>
              
              <div className="flex flex-col">
                <PreviewItemRow 
                  title="Contra"
                  subtitle="Freelance Platform"
                  meta="Worldwide · Gratis"
                  tags="Creative · Development · Marketing"
                  href="/freelance/direktori/contra"
                />
                <PreviewItemRow 
                  title="We Work Remotely"
                  subtitle="Remote Job Board"
                  meta="Worldwide · Gratis"
                  tags="Engineering · Product · Design"
                  href="/freelance/direktori/we-work-remotely"
                />
                <PreviewItemRow 
                  title="FlexJobs"
                  subtitle="Curated Remote Jobs"
                  meta="Worldwide · Berbayar"
                  tags="Berbagai kategori profesional"
                  href="/freelance/direktori/flexjobs"
                />
              </div>
            </motion.div>

            {/* Preview: Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-[18px] font-bold text-[#ECEDE7] mb-6">
                Peluang remote terbaru
              </h3>
              
              <div className="flex flex-col">
                <PreviewItemRow 
                  title="Product Designer"
                  subtitle="Tech Startup"
                  meta="Worldwide · Remote · Full-time"
                  tags="Design Systems · Figma · UI/UX"
                  href="/freelance/lowongan/product-designer-tech-startup"
                />
                <PreviewItemRow 
                  title="AI Content Writer"
                  subtitle="Digital Agency"
                  meta="Remote · Contract"
                  tags="Content Strategy · Prompt Engineering"
                  href="/freelance/lowongan/ai-content-writer-agency"
                />
                <PreviewItemRow 
                  title="Frontend Developer (React)"
                  subtitle="SaaS Company"
                  meta="US Timezone · Freelance"
                  tags="React · TypeScript · Tailwind"
                  href="/freelance/lowongan/frontend-dev-saas"
                />
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </section>
  );
}
