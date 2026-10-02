import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { HomeView } from "@/components/home/HomeView";
import { getBlogListingPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Khadafi — AI-Assisted Product Engineer & Digital Builder",
  description:
    "Personal Business Headquarters Khadafi: membangun produk digital defensible, sistem automasi AI, karier remote independen, dan inisiatif internet mandiri.",
  alternates: {
    canonical: "https://khadafidaffa.com/",
  },
  openGraph: {
    title: "Khadafi — AI-Assisted Product Engineer & Digital Builder",
    description:
      "Personal Business Headquarters Khadafi: membangun produk digital defensible, sistem automasi AI, karier remote independen, dan inisiatif internet mandiri.",
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
    title: "Khadafi — AI-Assisted Product Engineer & Digital Builder",
    description:
      "Personal Business Headquarters Khadafi: membangun produk digital defensible, sistem automasi AI, karier remote independen, dan inisiatif internet mandiri.",
    images: ["/assets/og-image.png"],
  },
};

export default async function HomePage() {
  const posts = await getBlogListingPosts();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Khadafi — Personal Business Headquarters",
    url: "https://khadafidaffa.com",
    description:
      "Personal Business Headquarters Khadafi: membangun produk digital defensible, sistem automasi AI, karier remote independen, dan inisiatif internet mandiri.",
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
    sameAs: [
      "https://www.linkedin.com/in/khdfii9/",
      "https://www.youtube.com/@khdfii9",
      "https://github.com/dhiyaulhaqkhadafi0",
    ],
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
      <main className="min-h-screen flex flex-col">
        <HomeView posts={posts} />
      </main>
    </>
  );
}
