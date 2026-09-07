import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getBlogListingPosts } from '@/lib/mdx';
import { getAllPublishedArticlesEngagement } from '@/lib/engagement';
import { Navbar } from '@/components/shared/navbar';
import { Lora } from 'next/font/google';
import BlogSearchFilter from '@/components/blog/BlogSearchFilter';
import HeroSlider from '@/components/blog/HeroSlider';

const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'] });

export const metadata = {
  title: 'Digital Grimoire | Daffa Dhiyaulhaq Khadafi',
  description: 'Kompendium pemikiran, blueprint arsitektur sistem cerdas, dan eksplorasi produk AI terapan oleh Daffa Dhiyaulhaq Khadafi.',
};

export const dynamic = 'force-dynamic';

export default async function BlogIndex() {
  const [posts, initialEngagement] = await Promise.all([
    getBlogListingPosts(),
    getAllPublishedArticlesEngagement(),
  ]);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#D1D5DB] font-sans selection:bg-[#34D399]/20 selection:text-[#E2E8F0] relative overflow-hidden">
      
      {/* Ambient Corner Lights (Floating Orbs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-[#34D399]/5 blur-[120px] pointer-events-none animate-[spin_10s_linear_infinite] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-[#6366F1]/5 blur-[150px] pointer-events-none animate-[spin_12s_linear_infinite_reverse] mix-blend-screen" />

      <Navbar />
      
      <main className="relative z-10 pt-28 pb-24 max-w-5xl mx-auto px-6 sm:px-8">
        
        {/* Navigasi Kembali */}
        <div className="mb-6 flex items-center justify-start">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#34D399]/40 text-xs font-mono tracking-wider text-white/70 hover:text-white transition-all group shadow-sm backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#34D399]" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <HeroSlider />

        {/* Main Content (Premium Search, Filter, Grid) */}
        <BlogSearchFilter 
          posts={posts} 
          initialEngagement={initialEngagement}
          loraClassName={lora.className} 
        />
        
      </main>
    </div>
  );
}
