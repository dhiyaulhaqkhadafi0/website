import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { HomeExperience } from "@/components/home/HomeExperience";
import { LearningLibrary } from "@/components/resources/LearningLibrary";
export const metadata: Metadata = {
  title: "Sumber Daya Gratis — Khadafi Learning Library",
  description:
    "20 materi gratis pilihan Khadafi untuk belajar AI, membangun produk, marketing, dan freelance. Panduan original, template siap salin, dan sumber resmi.",
  alternates: { canonical: "https://khadafidaffa.com/resources" },
  openGraph: {
    title: "Khadafi Learning Library",
    description: "Hal baru untuk dipelajari. Ide baru untuk diwujudkan.",
    url: "https://khadafidaffa.com/resources",
    images: ["/assets/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khadafi Learning Library",
    description:
      "20 materi gratis, template, dan rute belajar pilihan Khadafi.",
    images: ["/assets/og-image.png"],
  },
};
export const dynamic = "force-static";
export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <HomeExperience>
        <LearningLibrary />
      </HomeExperience>
    </>
  );
}
