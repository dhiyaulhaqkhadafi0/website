import type { Metadata } from 'next';
import { Navbar } from '@/components/shared/navbar';
import { getBlogListingPosts } from '@/lib/mdx';
import CommunityView from '@/components/community/CommunityView';

export const metadata: Metadata = {
  title: 'Komunitas',
  description:
    'Wadah kolaborasi dan belajar bagi kreator, freelancer, dan digital builder Indonesia untuk membangun personal brand, produk digital, dan bisnis mandiri berbasis AI.',
  alternates: {
    canonical: 'https://khadafidaffa.com/komunitas',
  },
  openGraph: {
    title: 'Komunitas | Khadafi',
    description:
      'Wadah kolaborasi dan belajar bagi kreator, freelancer, dan digital builder Indonesia untuk membangun personal brand, produk digital, dan bisnis mandiri berbasis AI.',
    url: 'https://khadafidaffa.com/komunitas',
    siteName: 'Khadafi',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Komunitas | Khadafi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Komunitas | Khadafi',
    description:
      'Wadah kolaborasi dan belajar bagi kreator, freelancer, dan digital builder Indonesia untuk membangun personal brand, produk digital, dan bisnis mandiri berbasis AI.',
    images: ['/assets/og-image.png'],
  },
};

export const dynamic = 'force-dynamic';

export default async function KomunitasPage() {
  const allPosts = await getBlogListingPosts();
  const recentPosts = allPosts.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#05050A] text-white selection:bg-[#34D399]/20 selection:text-white">
      <Navbar />
      <CommunityView recentPosts={recentPosts} />
    </main>
  );
}
