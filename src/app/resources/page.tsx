import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { RESOURCES_DATA } from "@/content/resources-data";
import { ResourcesClientView } from "@/components/resources/ResourcesClientView";

export const metadata: Metadata = {
  title: "Sumber Daya Gratis",
  description:
    "Akses gratis kumpulan sistem kerja, blueprint PRD, framework produk, panduan taktis, dan prompt pack presisi untuk akselerasi produk dan bisnis digital.",
  alternates: {
    canonical: "https://khadafidaffa.com/resources",
  },
  openGraph: {
    title: "Sumber Daya Gratis | Khadafi",
    description:
      "Akses gratis kumpulan sistem kerja, blueprint PRD, framework produk, panduan taktis, dan prompt pack presisi untuk akselerasi produk dan bisnis digital.",
    url: "https://khadafidaffa.com/resources",
    siteName: "Khadafi",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sumber Daya Gratis | Khadafi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumber Daya Gratis | Khadafi",
    description:
      "Akses gratis kumpulan sistem kerja, blueprint PRD, framework produk, panduan taktis, dan prompt pack presisi untuk akselerasi produk dan bisnis digital.",
    images: ["/assets/og-image.png"],
  },
};

export const dynamic = "force-static";

export default function ResourcesPage() {
  const featuredResource =
    RESOURCES_DATA.find((r) => r.featured) || RESOURCES_DATA[0];

  return (
    <main className="min-h-screen bg-[#0A0D16] text-slate-100 selection:bg-sky-500/30 selection:text-sky-100">
      <Navbar />
      <ResourcesClientView
        resources={RESOURCES_DATA}
        featuredResource={featuredResource}
      />
    </main>
  );
}
