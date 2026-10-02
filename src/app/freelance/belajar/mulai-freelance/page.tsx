import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { ReadingProgress } from "@/components/freelance/ReadingProgress";
import { LearningGuideTOC } from "@/components/freelance/LearningGuideTOC";

export const metadata: Metadata = {
  title: "Mulai Freelance dari Nol | Khadafi",
  description:
    "Panduan praktis memahami dunia freelance, menentukan arah, menyiapkan skill, membangun portfolio, hingga mencari peluang pertama.",
};

const TOC_ITEMS = [
  { id: "01-memahami", label: "01", title: "Memahami Freelance" },
  { id: "02-menentukan-arah", label: "02", title: "Skill & Arah" },
  { id: "03-niche", label: "03", title: "Positioning & Niche" },
  { id: "04-portfolio", label: "04", title: "Portfolio Utama" },
  { id: "05-harga", label: "05", title: "Pricing & Rate" },
  { id: "06-peluang", label: "06", title: "Mencari Peluang" },
  { id: "07-client", label: "07", title: "Manajemen Client" },
];

export default function MulaiFreelancePage() {
  return (
    <>
      <ReadingProgress />
      <Navbar />
      <main className="min-h-screen bg-[#292A27] text-[#ECEDE7] flex-1 flex flex-col font-sans selection:bg-[#A5AC91]/20 selection:text-[#ECEDE7]">
        
        {/* 1. DARK HERO SECTION */}
        <section className="relative w-full pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-[#292A27]">
          {/* Subtle glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#A5AC91]/[0.04] blur-[160px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 max-w-[1240px] relative z-10 flex justify-center">
            <div className="w-full max-w-[800px] lg:mr-auto lg:ml-0 xl:mx-auto">
              {/* Breadcrumb */}
              <div className="mb-12 flex items-center gap-2 text-[12px] font-medium text-[#8C8E87]">
                <Link href="/freelance" className="hover:text-[#ECEDE7] transition-colors">Freelance</Link>
                <span>/</span>
                <span className="hover:text-[#ECEDE7] transition-colors cursor-default">Belajar</span>
                <span>/</span>
                <span className="text-[#A1A39B]">Mulai Freelance</span>
              </div>

              <span className="block text-[11px] font-bold tracking-[0.22em] uppercase text-[#A1A39B] mb-6">
                Worldwide Freelancer · Panduan 01
              </span>

              <h1 className="text-[48px] md:text-[56px] lg:text-[64px] font-black tracking-[-0.03em] text-[#ECEDE7] leading-[1.05] max-w-2xl mb-8">
                Mulai Freelance<br />
                <span className="text-[#A1A39B]">dari Nol.</span>
              </h1>

              <p className="text-[17px] md:text-[18px] text-[#C3C5BD] leading-relaxed max-w-2xl mb-12">
                Panduan praktis memahami dunia freelance, menentukan arah, menyiapkan skill, membangun portfolio, hingga mencari peluang pertama.
              </p>

              <div className="flex items-center gap-6 text-[13px] font-medium text-[#ECEDE7] border-t border-[rgba(255,255,255,0.07)] pt-6 max-w-2xl">
                <span className="text-[#A1A39B]">Diperbarui <span className="text-[#ECEDE7]">Oktober 2026</span></span>
                <span className="text-[rgba(255,255,255,0.1)]">|</span>
                <span className="text-[#A1A39B]">± <span className="text-[#ECEDE7]">25 menit</span> baca</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. LEARNING ROADMAP SECTION */}
        <section className="w-full bg-[#2E2F2B] border-t border-[rgba(255,255,255,0.04)] py-12">
          <div className="container mx-auto px-6 max-w-[1240px]">
            <div className="flex flex-col xl:flex-row xl:items-center gap-8 xl:gap-16">
              <div className="shrink-0">
                <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#A5AC91] mb-2">
                  Jalur Belajar
                </span>
                <p className="text-[14px] text-[#A1A39B] max-w-xs">
                  Ikuti berurutan jika kamu benar-benar mulai dari nol, atau lompat ke bagian yang kamu butuhkan.
                </p>
              </div>

              <div className="flex-1 flex flex-wrap items-center gap-y-4 gap-x-3 text-[13px] font-semibold">
                {TOC_ITEMS.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <a href={`#${item.id}`} className="flex items-center gap-2 group">
                      <span className="text-[11px] font-bold text-[#A1A39B]">{item.label}</span>
                      <span className="text-[#C3C5BD] group-hover:text-[#ECEDE7] transition-colors">{item.title}</span>
                    </a>
                    {idx < TOC_ITEMS.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-[#8C8E87]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. WARM PAPER ARTICLE CONTENT */}
        <section className="relative w-full py-20 md:py-32 bg-[#F1F0EA] text-[#242521]">
          <div className="container mx-auto px-6 max-w-[1240px]">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-[80px]">
              
              {/* SIDEBAR (Left) */}
              <aside className="hidden lg:block w-[180px] shrink-0">
                <LearningGuideTOC items={TOC_ITEMS} />
              </aside>

              {/* MAIN ARTICLE CONTENT (Right) */}
              <div className="flex-1 max-w-[720px]">
                
                {/* Chapter 01 */}
                <div id="01-memahami" className="mb-24 md:mb-32 scroll-mt-32">
                  <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8E87] mb-4">
                    01 — Memahami Dunia Freelance
                  </span>
                  <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.02em] text-[#242521] leading-[1.1] mb-8">
                    Freelance itu sebenarnya apa?
                  </h2>
                  
                  <div className="prose prose-lg prose-p:text-[#4A4B45] prose-p:leading-[1.8] prose-p:text-[17px] max-w-none">
                    <p>
                      Freelance bukan sekadar &ldquo;kerja tanpa kantor&rdquo; atau bisa bangun siang sesuka hati. Ada beberapa bentuk hubungan kerja yang perlu dipahami sebelum menentukan jalurmu. Menyamaratakan semua jenis pekerjaan remote akan membuat ekspektasimu salah saat berhadapan dengan client.
                    </p>

                    <div className="my-10 overflow-x-auto rounded-[8px] border border-[#D9D8D2] bg-white">
                      <table className="w-full text-left text-[14px]">
                        <thead>
                          <tr className="border-b border-[#D9D8D2] bg-[#F7F6F1]">
                            <th className="py-4 px-6 font-bold text-[#242521]">Model</th>
                            <th className="py-4 px-6 font-bold text-[#242521]">Cara Kerja</th>
                            <th className="py-4 px-6 font-bold text-[#242521]">Dibayar Berdasarkan</th>
                          </tr>
                        </thead>
                        <tbody className="text-[#4A4B45]">
                          <tr className="border-b border-[#D9D8D2]">
                            <td className="py-4 px-6 font-medium text-[#242521]">Freelance Project</td>
                            <td className="py-4 px-6">Berdasarkan scope project tertentu</td>
                            <td className="py-4 px-6 font-medium">Deliverable (Hasil)</td>
                          </tr>
                          <tr className="border-b border-[#D9D8D2]">
                            <td className="py-4 px-6 font-medium text-[#242521]">Remote Full-time</td>
                            <td className="py-4 px-6">Bagian dari tim inti perusahaan</td>
                            <td className="py-4 px-6 font-medium">Waktu / Gaji Bulanan</td>
                          </tr>
                          <tr className="border-b border-[#D9D8D2]">
                            <td className="py-4 px-6 font-medium text-[#242521]">Contract</td>
                            <td className="py-4 px-6">Durasi kontrak periode tertentu (3/6 bulan)</td>
                            <td className="py-4 px-6 font-medium">Term kontrak</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-6 font-medium text-[#242521]">Retainer</td>
                            <td className="py-4 px-6">Hubungan berulang jangka panjang</td>
                            <td className="py-4 px-6 font-medium">Kapasitas per bulan</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-10 p-6 sm:p-8 bg-[#E9E8E1] border-l-4 border-[#242521] rounded-r-[8px]">
                      <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#242521] mb-2">
                        Intinya
                      </h4>
                      <p className="text-[16px] text-[#4A4B45] leading-relaxed m-0">
                        Freelance bukan sekadar kerja dari rumah. Yang paling membedakan adalah <strong>bentuk hubungan kerjanya</strong>. Mengetahui bentuk kemitraan sejak awal akan menentukan cara kamu menetapkan harga dan mengatur waktu kerja.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chapter 02 */}
                <div id="02-menentukan-arah" className="mb-24 md:mb-32 scroll-mt-32">
                  <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8E87] mb-4">
                    02 — Menentukan Skill & Arah
                  </span>
                  <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.02em] text-[#242521] leading-[1.1] mb-8">
                    Skill apa yang bisa kamu jual?
                  </h2>
                  
                  <div className="prose prose-lg prose-p:text-[#4A4B45] prose-p:leading-[1.8] prose-p:text-[17px] max-w-none">
                    <p>
                      Tidak semua hobi bisa dijadikan layanan freelance. Dan tidak semua skill teknis menjamin kamu mendapat client yang rela membayar mahal. Mulailah dari membedah persimpangan antara tiga hal:
                    </p>
                    
                    <div className="bg-[#242521] text-[#F1F0EA] p-8 sm:p-12 rounded-[12px] my-12 flex flex-col items-center justify-center font-mono">
                      <div className="relative w-full max-w-[400px] flex flex-col items-center text-center">
                        <div className="text-[14px] font-bold tracking-widest mb-4">YANG BISA KAMU KERJAKAN</div>
                        <div className="text-[20px]">○</div>
                        
                        <div className="flex justify-between w-full mt-4 mb-4 relative">
                          <div className="text-[20px] absolute left-10 -top-2">○</div>
                          <div className="w-full flex items-center justify-center gap-4">
                            <span className="text-[#A5AC91]">─────</span>
                            <span className="font-bold tracking-widest text-[#A5AC91] px-2 py-1 border border-[#A5AC91] rounded-[4px] text-[12px]">SWEET SPOT</span>
                            <span className="text-[#A5AC91]">─────</span>
                          </div>
                          <div className="text-[20px] absolute right-10 -top-2">○</div>
                        </div>

                        <div className="flex justify-between w-full px-4">
                          <div className="text-[14px] font-bold tracking-widest">DIBUTUHKAN PASAR</div>
                          <div className="text-[14px] font-bold tracking-widest text-[#A1A39B]">MINAT</div>
                        </div>
                      </div>

                      <p className="mt-12 text-[14px] text-center max-w-[340px] text-[#C3C5BD] leading-relaxed font-sans font-medium m-0">
                        Skill yang layak dijual berada di persimpangan antara <span className="text-white">kemampuanmu</span>, <span className="text-white">kebutuhan pasar</span>, dan hal yang <span className="text-white">masih ingin kamu kerjakan</span> dalam jangka panjang.
                      </p>
                    </div>

                    <p>
                      Fokus pada apa yang dibutuhkan pasar, namun tetap sejalan dengan hal yang ingin kamu kembangkan. Skill yang kamu jual hari ini tidak harus persis sama dengan skill yang kamu tawarkan dua tahun lagi. Yang terpenting adalah mengemas skill tersebut sebagai <strong>solusi bisnis</strong>.
                    </p>

                    <div className="my-12 p-8 bg-white border border-[#D9D8D2] rounded-[8px]">
                      <h4 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#8C8E87] mb-6 flex items-center gap-3">
                        <span className="w-4 h-[1px] bg-[#8C8E87]" /> Real Example
                      </h4>
                      <p className="mb-6">
                        Sebagai contoh konkret, saya sendiri fokus pada *AI-assisted development* dan *technical writing*.
                      </p>
                      <ul className="space-y-4 m-0 p-0 list-none">
                        <li className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 border-b border-[#F1F0EA] pb-3">
                          <span className="text-[#8C8E87] font-semibold text-[14px]">Skill Utama</span>
                          <span className="text-[#242521] font-medium">Full-stack Web Development (Next.js, TypeScript)</span>
                        </li>
                        <li className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 border-b border-[#F1F0EA] pb-3">
                          <span className="text-[#8C8E87] font-semibold text-[14px]">Masalah Pasar</span>
                          <span className="text-[#242521] font-medium">Bisnis butuh MVP/website rilis lebih cepat & efisien.</span>
                        </li>
                        <li className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 border-b border-[#F1F0EA] pb-3">
                          <span className="text-[#8C8E87] font-semibold text-[14px]">Output Real</span>
                          <span className="text-[#242521] font-medium">Situs korporat, MVP SaaS, landing page produk.</span>
                        </li>
                        <li className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                          <span className="text-[#8C8E87] font-semibold text-[14px]">Ideal Client</span>
                          <span className="text-[#242521] font-medium">Startup founders, creator independen, UMKM digital.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Praktik Block */}
                  <div className="mt-16 p-8 sm:p-10 bg-[#E9E8E1] rounded-[12px]">
                    <h3 className="text-[18px] font-bold tracking-tight text-[#242521] mb-2">
                      Coba Sekarang
                    </h3>
                    <p className="text-[15px] text-[#60635C] mb-8">
                      Ambil catatanmu, dan tuliskan tiga hal fundamental ini sebelum kita lanjut mencari peluang:
                    </p>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full border border-[#8C8E87] flex items-center justify-center text-[13px] font-bold text-[#8C8E87]">
                          01
                        </div>
                        <div className="pt-1.5">
                          <span className="block text-[15px] font-semibold text-[#242521]">Skill apa yang sudah cukup kamu kuasai hari ini?</span>
                          <span className="block text-[13px] text-[#8C8E87] mt-1">Gunakan kemampuan yang tidak perlu kamu pelajari lagi dari nol saat mengerjakan project.</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full border border-[#8C8E87] flex items-center justify-center text-[13px] font-bold text-[#8C8E87]">
                          02
                        </div>
                        <div className="pt-1.5">
                          <span className="block text-[15px] font-semibold text-[#242521]">Masalah bisnis apa yang bisa kamu selesaikan?</span>
                          <span className="block text-[13px] text-[#8C8E87] mt-1">Jangan jual &ldquo;desain logo&rdquo;, juallah &ldquo;identitas brand profesional agar dipercaya investor&rdquo;.</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full border border-[#8C8E87] flex items-center justify-center text-[13px] font-bold text-[#8C8E87]">
                          03
                        </div>
                        <div className="pt-1.5">
                          <span className="block text-[15px] font-semibold text-[#242521]">Siapa orang/perusahaan yang rela membayar untuk hasilnya?</span>
                          <span className="block text-[13px] text-[#8C8E87] mt-1">Targetkan segmentasi yang jelas (misal: agensi marketing di US, pemilik online shop lokal).</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapters 3 to 7 remain structural for now */}
                {TOC_ITEMS.slice(2).map((item) => (
                  <div key={item.id} id={item.id} className="mb-24 scroll-mt-32">
                    <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8E87] mb-4">
                      {item.label} — {item.title}
                    </span>
                    <div className="p-8 border border-dashed border-[#D9D8D2] rounded-[8px] text-center bg-white/50">
                      <p className="text-[14px] text-[#8C8E87] italic m-0">
                        Modul <strong>{item.title}</strong> sedang dalam tahap penyusunan dan akan dirilis secara bertahap pada update Freelance Hub berikutnya.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. NEXT ACTION SECTION (GRAPHITE + DARK CTA) */}
        <section className="w-full bg-[#292A27] py-24 md:py-32 border-t border-[rgba(255,255,255,0.04)]">
          <div className="container mx-auto px-6 max-w-[1240px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1000px] mx-auto">
              
              {/* Next Step / Content Flow */}
              <div className="bg-[#30312E] p-10 sm:p-12 rounded-[12px] flex flex-col items-start justify-between">
                <div>
                  <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#A1A39B] mb-6">
                    Panduan Selanjutnya
                  </span>
                  <h3 className="text-[26px] font-bold tracking-[-0.02em] text-[#ECEDE7] leading-tight mb-4">
                    Bangun Portfolio Pertamamu
                  </h3>
                  <p className="text-[15px] text-[#A1A39B] leading-relaxed">
                    Panduan spesifik untuk mengonversi skill dan personal project menjadi portfolio yang meyakinkan calon client, meskipun kamu belum punya pengalaman dibayar.
                  </p>
                </div>
                
                <button className="mt-12 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[8px] bg-[#F0EFEA] text-[#242521] font-bold text-[13px] hover:bg-white hover:-translate-y-[2px] transition-all duration-300">
                  Lanjut ke Panduan 02 <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Action / Directory Entry */}
              <div className="bg-[#2E2F2B] border border-[rgba(255,255,255,0.07)] p-10 sm:p-12 rounded-[12px] flex flex-col items-start justify-between">
                <div>
                  <span className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#A1A39B] mb-6">
                    Praktik & Eksplorasi
                  </span>
                  <h3 className="text-[26px] font-bold tracking-[-0.02em] text-[#ECEDE7] leading-tight mb-4">
                    Cari Peluang Pertamamu
                  </h3>
                  <p className="text-[15px] text-[#A1A39B] leading-relaxed">
                    Jelajahi berbagai platform freelance dan job board remote yang sudah saya kurasi, lengkap dengan spesialisasi setiap platform-nya.
                  </p>
                </div>
                
                <Link href="/freelance/direktori" className="mt-12 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[8px] bg-transparent border border-[rgba(255,255,255,0.14)] text-[#ECEDE7] font-bold text-[13px] hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.25)] transition-all duration-300 group">
                  Buka Direktori Kerja <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}
