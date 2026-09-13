import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { RESOURCES_DATA } from "@/content/resources-data";
import { ResourceDetailView } from "@/components/resources/ResourceDetailView";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return RESOURCES_DATA.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = RESOURCES_DATA.find((r) => r.slug === slug);

  if (!resource) {
    return {
      title: "Sumber Daya Tidak Ditemukan",
    };
  }

  const title = resource.title;
  const description = resource.description || resource.tagline;
  const canonicalUrl = `https://khadafidaffa.com/resources/${resource.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: "Khadafi",
      locale: "id_ID",
      images: [
        {
          url: "/assets/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/og-image.png"],
    },
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = RESOURCES_DATA.find((r) => r.slug === slug);

  if (!resource) {
    notFound();
  }

  // Get related resources
  const relatedResources = (resource.relatedResourcesSlugs || [])
    .map((s) => RESOURCES_DATA.find((r) => r.slug === s))
    .filter((r): r is typeof resource => !!r);

  const siteUrl = "https://khadafidaffa.com";
  const canonicalUrl = `${siteUrl}/resources/${resource.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: resource.title,
    description: resource.description || resource.tagline,
    url: canonicalUrl,
    inLanguage: "id-ID",
    author: {
      "@type": "Person",
      name: "Daffa Dhiyaulhaq Khadafi",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Daffa Dhiyaulhaq Khadafi",
      url: siteUrl,
    },
  };

  return (
    <main className="min-h-screen bg-[#05050A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <ResourceDetailView
        resource={resource}
        relatedResources={relatedResources}
      />
    </main>
  );
}
