import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { FreelanceHubView } from "@/components/freelance/FreelanceHubView";

export const metadata: Metadata = {
  title: "Building a career without an office — Freelance Journey Hub | Khadafi",
  description:
    "Catatan perjalanan, pekerjaan, sistem, dan resources saya dalam membangun karier freelance & remote.",
  alternates: {
    canonical: "https://khadafidaffa.com/freelance",
  },
  openGraph: {
    title: "Building a career without an office — Freelance Journey Hub",
    description:
      "Catatan perjalanan, pekerjaan, sistem, dan resources saya dalam membangun karier freelance & remote.",
    url: "https://khadafidaffa.com/freelance",
    siteName: "Khadafi",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khadafi — Freelance Journey Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Building a career without an office — Freelance Journey Hub",
    description:
      "Catatan perjalanan, pekerjaan, sistem, dan resources saya dalam membangun karier freelance & remote.",
    images: ["/assets/og-image.png"],
  },
};

export default function FreelancePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Freelance Journey Hub — Building a career without an office",
    "url": "https://khadafidaffa.com/freelance",
    "description": "Catatan perjalanan, pekerjaan, sistem, dan resources saya dalam membangun karier freelance & remote.",
    "author": {
      "@type": "Person",
      "name": "Daffa Dhiyaulhaq Khadafi",
      "url": "https://khadafidaffa.com"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-[#292A27] text-[#ECEDE7] flex-1 flex flex-col">
        <FreelanceHubView />
      </main>
    </>
  );
}
