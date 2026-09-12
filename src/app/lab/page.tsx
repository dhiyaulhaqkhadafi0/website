import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { LabMotionProvider } from "@/components/lab/LabMotionContext";
import { LabHero } from "@/components/lab/LabHero";
import { LabSectionNav } from "@/components/lab/LabSectionNav";
import { LabManifesto } from "@/components/lab/LabManifesto";
import { ResearchFrontiersSection } from "@/components/lab/ResearchFrontiersSection";
import { ResearchMethodologySection } from "@/components/lab/ResearchMethodologySection";
import { LabGovernanceSection } from "@/components/lab/LabGovernanceSection";
import { LabProgressSection } from "@/components/lab/LabProgressSection";
import { LabFounderSection } from "@/components/lab/LabFounderSection";

export const metadata: Metadata = {
  title: "Laboratorium",
  description:
    "Eksplorasi dan riset frontier AI, sistem cerdas terapan, dan arsitektur produk masa depan yang memperluas kapabilitas manusia di HCFTL Khadafi.",
  alternates: {
    canonical: "https://khadafidaffa.com/lab",
  },
  openGraph: {
    title: "Laboratorium | Khadafi",
    description:
      "Eksplorasi dan riset frontier AI, sistem cerdas terapan, dan arsitektur produk masa depan yang memperluas kapabilitas manusia di HCFTL Khadafi.",
    url: "https://khadafidaffa.com/lab",
    siteName: "Khadafi",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Laboratorium | Khadafi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laboratorium | Khadafi",
    description:
      "Eksplorasi dan riset frontier AI, sistem cerdas terapan, dan arsitektur produk masa depan yang memperluas kapabilitas manusia di HCFTL Khadafi.",
    images: ["/assets/og-image.png"],
  },
};

export default function LabPage() {
  return (
    <LabMotionProvider>
      <main className="min-h-screen bg-[#070B10] text-[#F2F4F3] selection:bg-[#7DD3FC]/20 selection:text-[#BAE6FD] relative overflow-x-hidden font-sans">
        {/* Global Shared Navbar */}
        <Navbar />

        <div className="relative flex flex-col">
          {/* BAB 01 — HERO & SECTION NAVIGATION */}
          <div className="relative">
            <LabHero />
            <LabSectionNav />
          </div>

          {/* BAB 02 — MENGAPA HCFTL ADA (MANIFESTO) */}
          <div
            className="relative transition-colors"
            style={{
              background: "linear-gradient(180deg, #070B10 0%, #080C14 35%, #080C14 75%, #060910 100%)",
            }}
          >
            <LabManifesto />
          </div>

          {/* BAB 03 — LIMA BIDANG RISET FRONTIER */}
          <div
            className="relative transition-colors"
            style={{
              background: `
                radial-gradient(ellipse 85% 60% at 50% 30%, rgba(14,28,48,0.45) 0%, transparent 70%),
                linear-gradient(180deg, #060910 0%, #070D18 45%, #060A12 100%)
              `,
            }}
          >
            <ResearchFrontiersSection />
          </div>

          {/* BAB 04 — DARI PERTANYAAN MENJADI BUKTI (METODOLOGI & EVIDENCE LADDER) */}
          <div
            className="relative transition-colors"
            style={{
              background: `
                radial-gradient(ellipse 75% 55% at 20% 40%, rgba(14,35,64,0.25) 0%, transparent 65%),
                linear-gradient(180deg, #060A12 0%, #070C15 50%, #060910 100%)
              `,
            }}
          >
            <ResearchMethodologySection />
          </div>

          {/* BAB 05 — MANUSIA TETAP MEMEGANG KENDALI (TATA KELOLA KESELAMATAN & OTONOMI) */}
          <div
            className="relative transition-colors"
            style={{
              background: `
                radial-gradient(ellipse 65% 50% at 80% 50%, rgba(10,20,35,0.3) 0%, transparent 60%),
                linear-gradient(180deg, #060910 0%, #060A12 50%, #070B10 100%)
              `,
            }}
          >
            <LabGovernanceSection />
          </div>

          {/* BAB 06 — PERKEMBANGAN LAB (REGISTRY & ARSIP RISET) */}
          <div
            className="relative transition-colors"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 50% 30%, rgba(12,28,52,0.3) 0%, transparent 65%),
                linear-gradient(180deg, #070B10 0%, #070C16 50%, #060910 100%)
              `,
            }}
          >
            <LabProgressSection />
          </div>

          {/* BAB 07 — RISET TERBUKA & PROFIL FOUNDER */}
          <div
            className="relative transition-colors"
            style={{
              background: `
                radial-gradient(ellipse 60% 50% at 50% 55%, rgba(125,211,252,0.03) 0%, transparent 65%),
                linear-gradient(180deg, #060910 0%, #05070D 50%, #020305 100%)
              `,
            }}
          >
            <LabFounderSection />
          </div>
        </div>
      </main>
    </LabMotionProvider>
  );
}

