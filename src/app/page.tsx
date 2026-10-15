import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { HomeView } from "@/components/home/HomeView";
import { getBlogListingPosts } from "@/lib/mdx";
import { SOCIAL_LINKS } from "@/content/social-links";

export const metadata: Metadata = {
  title: "Khadafi — Belajar, Berkarya & Membangun Peluang Digital",
  description:
    "Jelajahi produk digital, panduan AI, sumber daya belajar, dan peluang freelance bersama Khadafi, AI-Assisted Product Engineer & Digital Builder.",
  alternates: {
    canonical: "https://khadafidaffa.com/",
  },
  openGraph: {
    title: "Khadafi — Belajar, Berkarya & Membangun Peluang Digital",
    description:
      "Jelajahi produk digital, panduan AI, sumber daya belajar, dan peluang freelance bersama Khadafi.",
    url: "https://khadafidaffa.com/",
    siteName: "Khadafi",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khadafi — AI-Assisted Product Engineer & Digital Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khadafi — Belajar, Berkarya & Membangun Peluang Digital",
    description:
      "Jelajahi produk digital, panduan AI, sumber daya belajar, dan peluang freelance bersama Khadafi.",
    images: ["/assets/og-image.png"],
  },
};

export default async function HomePage() {
  const posts = await getBlogListingPosts();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Khadafi — Ekosistem Digital",
    url: "https://khadafidaffa.com",
    description:
      "Jelajahi produk digital, panduan AI, sumber daya belajar, dan peluang freelance bersama Khadafi.",
    inLanguage: "id-ID",
    publisher: {
      "@type": "Person",
      name: "Daffa Dhiyaulhaq Khadafi",
      jobTitle: "AI-Assisted Product Engineer & Builder",
      url: "https://khadafidaffa.com",
    },
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daffa Dhiyaulhaq Khadafi",
    alternateName: ["Khadafi", "khdfii9"],
    url: "https://khadafidaffa.com",
    jobTitle: "AI-Assisted Product Engineer & Digital Builder",
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <HomeView posts={posts} />
      </div>
    </>
  );
}
