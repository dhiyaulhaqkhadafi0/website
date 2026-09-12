"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Flame,
  Layers,
  Cpu,
  PenTool,
  Box,
  Coins,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  BookOpen,
  User,
  Heart,
  Share2,
  ExternalLink,
  Code2,
  Send,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";
import type { BlogCardItem } from "@/lib/mdx";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"] });

interface CommunityViewProps {
  recentPosts: BlogCardItem[];
}

const FAQS = [
  {
    q: "Siapa yang paling cocok bergabung di komunitas ini?",
    a: "Komunitas ini dirancang untuk kreator konten, freelancer, indie hacker, software engineer, dan digital builder pemula maupun berpengalaman yang ingin memanfaatkan AI untuk menghasilkan karya nyata, membangun personal brand defensibel, dan membuka peluang monetisasi.",
  },
  {
    q: "Apakah saya harus memiliki keahlian teknis atau bisa coding?",
    a: "Tidak wajib. Pembahasan di komunitas mencakup spektrum luas: dari pemanfaatan AI untuk penulisan dan riset, pembuatan workflow otomatis tanpa kode (no-code), hingga vibe coding dan rekayasa produk digital. Semua level disambut dengan hangat.",
  },
  {
    q: "Apa saja topik utama yang akan dibahas sehari-hari?",
    a: "Fokus utama berkisar pada 4 bidang: (1) AI-Assisted Creation, (2) Personal Brand & Content System, (3) Digital Product Building (MVP & launch), serta (4) Monetization & Independent Career. Seluruh topik diikat oleh pendekatan 'System Thinking'.",
  },
  {
    q: "Apa yang bisa saya lakukan setelah masuk ke dalam komunitas?",
    a: "Kamu bisa berdiskusi, membagikan log progres harian (build log), meminta masukan objektif atas karya atau prototipe yang sedang dibuat, mengakses arsip resource & template prompt kurasi Khadafi, serta menjalin kolaborasi dengan sesama builder.",
  },
  {
    q: "Di mana wadah komunitas ini akan berlangsung?",
    a: "Saat ini kami sedang menyiapkan area anggota (community portal) di website ini serta satu kanal komunikasi terverifikasi yang terfokus agar interaksi berlangsung tertib, bermakna, dan mudah diakses kembali.",
  },
  {
    q: "Apakah akses komunitas ini gratis atau berbayar?",
    a: "Akses awal komunitas dipersiapkan secara terbuka tanpa pungutan biaya, sebagai ruang belajar dan bertumbuh bersama. Detail skema akses publik berkelanjutan akan diumumkan secara transparan menjelang peluncuran resmi.",
  },
];

const FOUR_PILLARS = [
  {
    num: "01",
    title: "AI-Assisted Creation",
    subtitle: "Menjadikan AI sebagai partner berpikir dan akselerator eksekusi",
    icon: Cpu,
    highlights: [
      "Prompting presisi & context engineering",
      "Workflow AI untuk riset mendalam & sintesis",
      "Vibe coding & pembuatan prototipe interaktif",
      "Automasi tugas repetitif tanpa kerumitan",
      "Pemilihan tools AI berdasarkan kebutuhan riil",
    ],
  },
  {
    num: "02",
    title: "Personal Brand & Content",
    subtitle: "Mengubah keahlian dan proses berkarya menjadi reputasi terpercaya",
    icon: PenTool,
    highlights: [
      "Menentukan positioning yang otentik dan defensible",
      "Storytelling terstruktur & prinsip build in public",
      "Sistem ideasi, naskah, dan kalender konten konsisten",
      "Repurposing konten panjang ke multi-format lintas platform",
      "Membangun audience loyal & portfolio of proof",
    ],
  },
  {
    num: "03",
    title: "Digital Product Building",
    subtitle: "Mengubah ruang masalah yang ambigu menjadi produk digital bernilai",
    icon: Box,
    highlights: [
      "Validasi masalah & ide sebelum menulis kode",
      "Product thinking, arsitektur informasi & UX intuitif",
      "Membangun MVP cepat dan fungsional dengan bantuan AI",
      "Peluncuran website, aplikasi mini, template & info-product",
      "Siklus pengumpulan feedback pengguna & iterasi terukur",
    ],
  },
  {
    num: "04",
    title: "Monetization & Independent Career",
    subtitle: "Membuka peluang ekonomi nyata dari keahlian yang kamu miliki",
    icon: Coins,
    highlights: [
      "Jasa freelance bernilai tinggi berbasis skill AI",
      "Pengemasan dan penjualan produk digital mandiri",
      "Creator monetization: membership, sponsorship & affiliate",
      "Membangun portofolio studi kasus yang meyakinkan klien",
      "Solopreneurship: sistem operasional bisnis satu orang",
    ],
  },
];

const COMMUNITY_ACTIVITIES = [
  {
    title: "Diskusi & Tanya Jawab Terarah",
    desc: "Ruang terbuka berdiskusi seputar AI, ide konten, arsitektur sistem, dan hambatan teknis tanpa takut dinilai pemula.",
    tag: "Diskusi",
  },
  {
    title: "Build Log & Progres Karya",
    desc: "Kanal untuk membagikan apa yang sedang kamu bangun hari ini agar tetap konsisten dan memiliki akuntabilitas positif.",
    tag: "Akuntabilitas",
  },
  {
    title: "Ruang Feedback & Telaah",
    desc: "Tempat aman untuk menguji draf tulisan, desain visual, landing page, atau prototipe sebelum dirilis ke publik.",
    tag: "Review",
  },
  {
    title: "Resource & Template Teruji",
    desc: "Koleksi prompt chains, template Notion/code, arsitektur workflow, dan catatan praktis yang dapat langsung kamu duplikasi.",
    tag: "Knowledge",
  },
  {
    title: "Sharing Berkala dari Khadafi",
    desc: "Catatan langsung dari lapangan: bedah eksperimen, keputusan desain produk, dan kegagalan yang dialami secara transparan.",
    tag: "Insight",
  },
  {
    title: "Sesi Temu Komunitas Virtual",
    desc: "Sesi daring berkala yang santai untuk mengupas studi kasus mendalam atau tanya-jawab seputar topik yang sedang hangat.",
    tag: "Sesi",
  },
  {
    title: "Showcase Karya Anggota",
    desc: "Apresiasi dan sorotan berkala atas produk, konten, atau karya anggota yang telah selesai dan diizinkan untuk dipublikasikan.",
    tag: "Showcase",
  },
  {
    title: "Peluang Kolaborasi & Proyek",
    desc: "Informasi proyek lepas (freelance), kerja sama antar anggota, dan kesempatan saling melengkapi keahlian satu sama lain.",
    tag: "Kolaborasi",
  },
];

const TARGET_AUDIENCES = [
  {
    title: "Kreator Konten",
    desc: "Yang ingin memproduksi konten secara konsisten dengan bantuan sistem dan workflow AI tanpa kehilangan keaslian suara personal.",
  },
  {
    title: "Freelancer & Praktisi",
    desc: "Yang ingin meningkatkan nilai tawar jasa, mempercepat kecepatan deliverable, dan memiliki portofolio pembuktian (portfolio of proof).",
  },
  {
    title: "Digital Builder & Indie Hacker",
    desc: "Yang punya tumpukan ide di kepala dan ingin mengeksekusinya menjadi aplikasi mini, landing page, atau produk digital fungsional.",
  },
  {
    title: "Pemula yang Serius Belajar",
    desc: "Yang ingin mempelajari pemanfaatan AI secara terarah dan terstruktur, tanpa tenggelam dalam kebisingan tren sesaat.",
  },
  {
    title: "Calon Solopreneur",
    desc: "Yang ingin membangun kemandirian finansial dan karier independen dengan menggabungkan keahlian, konten, dan produk digital.",
  },
];

const CULTURE_VALUES = [
  {
    title: "Belajar Sambil Membuat",
    desc: "Teori dan konsumsi informasi itu baik, tetapi pemahaman sejati lahir dari menghasilkan karya nyata yang bisa diuji.",
  },
  {
    title: "Pemula Diterima Hangat",
    desc: "Tidak ada pertanyaan yang dianggap sepele. Setiap orang yang sekarang ahli pernah berada di garis awal yang sama.",
  },
  {
    title: "Feedback Fokus pada Karya & Solusi",
    desc: "Masukan diarahkan untuk menyempurnakan struktur, estetika, atau fungsi karya—bukan menghakimi pribadi pembuatnya.",
  },
  {
    title: "Berbagi Proses Secara Jujur",
    desc: "Kita menceritakan keberhasilan sekaligus kegagalan, kendala, dan eksperimen yang belum selesai secara transparan.",
  },
  {
    title: "Promosi Hanya pada Tempatnya",
    desc: "Tersedia kanal khusus untuk membagikan karya dan jasa agar ruang obrolan utama tetap fokus pada diskusi pembelajaran.",
  },
  {
    title: "Menghargai Kepemilikan & Privasi",
    desc: "Ide, karya, dan privasi setiap anggota sepenuhnya dihormati. Tidak ada klaim kepemilikan atas apa yang kamu bangun.",
  },
];

export default function CommunityView({ recentPosts }: CommunityViewProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes("@")) return;
    // Local pre-release acknowledgment state
    setWaitlistSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#05050A] text-[#E2E8F0] selection:bg-[#34D399]/20 selection:text-[#E2E8F0] overflow-x-hidden font-sans">
      {/* Ambient background light gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#34D399]/10 via-[#10B981]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-[#34D399]/5 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-[#10B981]/5 blur-[180px] pointer-events-none" />

      {/* ───────────────────────────────────────────────────────────────────────
          1. HERO SECTION (SPLIT COMPOSITION)
         ─────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 sm:pt-36 md:pt-40 pb-20 md:pb-28 px-6 sm:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Breadcrumb / Back hint */}
            <div className="mb-6 flex items-center gap-2 text-xs font-mono text-white/50">
              <Link href="/" className="hover:text-white transition-colors">
                khadafidaffa.com
              </Link>
              <span>/</span>
              <span className="text-[#34D399]">komunitas</span>
            </div>

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399] font-mono text-xs tracking-wider uppercase mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Komunitas Creator & Digital Builder</span>
            </div>

            {/* Headline */}
            <h1
              className={`${lora.className} text-4xl sm:text-5xl md:text-6xl font-normal text-[#F8FAFC] tracking-tight leading-[1.1] mb-6`}
            >
              Dari banyak ide,{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] via-emerald-400 to-[#F8FAFC]">
                menjadi karya yang nyata.
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#94A3B8] text-base sm:text-lg md:text-xl leading-relaxed font-light max-w-xl mb-8">
              Ruang belajar dan bertumbuh bagi kreator, freelancer, dan digital builder yang ingin menggunakan AI untuk membangun personal brand, menghasilkan karya, dan menciptakan peluang dari keahliannya.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => scrollToSection("gabung")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#34D399] to-[#10B981] hover:from-[#2EB882] hover:to-[#059669] text-[#05050A] font-semibold text-sm tracking-wide transition-all shadow-lg shadow-[#34D399]/20 hover:scale-[1.02] cursor-pointer"
              >
                <span>Gabung Komunitas</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("pembelajaran")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-medium text-sm transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#34D399]" />
                <span>Lihat yang Dipelajari</span>
              </button>
            </div>

            {/* Reassurance text */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                Komunitas Terbuka Berkelanjutan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                Bukan Kelas atau Bootcamp Kaku
              </span>
            </div>
          </div>

          {/* Right Column: Visual Preview of Community Experience */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-3xl bg-[#090A10]/95 border border-white/15 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span className="text-[11px] font-mono tracking-wider text-white/70 uppercase font-semibold">
                    Preview Pengalaman Komunitas
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                  Mockup Desain
                </span>
              </div>

              {/* Mock Feed Items */}
              <div className="space-y-3.5">
                {/* Feed item 1: Discussion */}
                <div className="p-3.5 rounded-2xl bg-[#11131A] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-[#34D399] flex items-center justify-center font-bold text-[10px]">
                        D
                      </div>
                      <span className="text-white/80 font-medium">Dimas P.</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-white/40">
                        #AI-Workflow
                      </span>
                    </div>
                    <span className="text-[10px] font-mono">2j lalu</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Mendesain prompt chaining untuk mengubah artikel panjang menjadi 5 format konten berbeda. Ada masukan untuk format thread?
                  </p>
                  <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-white/5 text-[11px] text-white/50">
                    <span className="flex items-center gap-1 hover:text-[#34D399]">
                      <MessageSquare className="w-3 h-3" /> 6 Tanggapan
                    </span>
                    <span className="flex items-center gap-1 hover:text-rose-400">
                      <Heart className="w-3 h-3" /> 14 Suka
                    </span>
                  </div>
                </div>

                {/* Feed item 2: Build Log */}
                <div className="p-3.5 rounded-2xl bg-[#11131A] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                        S
                      </div>
                      <span className="text-white/80 font-medium">Siti Rahma</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-white/40">
                        #BuildLog
                      </span>
                    </div>
                    <span className="text-[10px] font-mono">5j lalu</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Hari ini resmi menerbitkan landing page produk digital pertama saya menggunakan vibe coding. Feedback layout sangat dinantikan!
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-[#34D399]">
                    <span className="px-2 py-0.5 rounded bg-[#34D399]/10 border border-[#34D399]/20">
                      ✓ Karya Terbit
                    </span>
                  </div>
                </div>

                {/* Feed item 3: Resource Drop by Khadafi */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/20 to-[#11131A] border border-[#34D399]/20">
                  <div className="flex items-center gap-2 text-xs mb-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#34D399] text-[#05050A] flex items-center justify-center font-bold text-[10px]">
                      K
                    </div>
                    <span className="text-[#34D399] font-medium">Khadafi</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#34D399]/20 text-[#34D399]">
                      Host
                    </span>
                  </div>
                  <p className="text-xs text-white/90 font-medium leading-snug">
                    Resource Baru: Blueprint System Thinking untuk Creator Solo & Rekayasa Produk AI
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-white/50 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-[#34D399]" />
                    <span>Tersimpan di Tab Resources</span>
                  </div>
                </div>
              </div>

              {/* Bottom status note */}
              <div className="mt-4 pt-3 border-t border-white/10 text-center">
                <span className="text-[11px] font-mono text-white/40">
                  Anggota saling berbagi perkembangan, bertanya, dan menguji karya
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          2. TRANSFORMASI ANGGOTA (TITIK A KE TITIK B)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="transformasi" className="py-24 px-6 sm:px-8 border-t border-white/5 bg-[#08090E]/60 relative z-10 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] mb-2 block">
              Perjalanan Bertumbuh
            </span>
            <h2 className={`${lora.className} text-3xl sm:text-4xl text-white font-normal mb-4`}>
              Dari mana kamu mulai, ke mana kamu bisa bertumbuh.
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed">
              Bukan janji sukses instan, melainkan arah perubahan nyata dari sekadar pengamat dan konsumen ide menjadi produsen karya yang mandiri.
            </p>
          </div>

          {/* Comparison Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Titik A (Sebelum) */}
            <div className="p-8 rounded-3xl bg-[#0B0C12] border border-white/10 relative">
              <div className="flex items-center gap-2 mb-6 text-xs font-mono text-white/50 uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-white/40" />
                <span>Kondisi Umum Saat Ini (Titik A)</span>
              </div>
              <ul className="space-y-4 text-sm text-white/70 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono text-xs mt-0.5">✕</span>
                  <span>Punya banyak ide di kepala, tetapi bingung harus mulai dari mana.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono text-xs mt-0.5">✕</span>
                  <span>Terjebak hanya mengonsumsi konten AI tanpa pernah menghasilkan karya nyata.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono text-xs mt-0.5">✕</span>
                  <span>Belajar tools secara acak tanpa sistem yang terhubung satu sama lain.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono text-xs mt-0.5">✕</span>
                  <span>Sulit konsisten membuat konten dan membangun personal brand yang meyakinkan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono text-xs mt-0.5">✕</span>
                  <span>Karya berhenti sebagai draf atau file lokal yang tidak pernah dipublikasikan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono text-xs mt-0.5">✕</span>
                  <span>Berjalan sendirian dalam sunyi tanpa ada teman untuk saling memberi masukan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/30 font-mono text-xs mt-0.5">✕</span>
                  <span>Belum memahami jalur yang jelas untuk menghasilkan pendapatan dari keahliannya.</span>
                </li>
              </ul>
            </div>

            {/* Titik B (Setelah Bertumbuh di Komunitas) */}
            <div className="p-8 rounded-3xl bg-[#090A10] border border-[#34D399]/30 relative shadow-xl shadow-[#34D399]/5">
              <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#34D399] uppercase tracking-wider font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Arah Pertumbuhan Bersama (Titik B)</span>
              </div>
              <ul className="space-y-4 text-sm text-white/90 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-[#34D399] font-mono text-xs mt-0.5">✓</span>
                  <span>Memiliki arah yang jelas dan langkah aksi konkret yang bisa dieksekusi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#34D399] font-mono text-xs mt-0.5">✓</span>
                  <span>Menggunakan AI sebagai partner kerja nyata untuk mempercepat penyelesaian karya.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#34D399] font-mono text-xs mt-0.5">✓</span>
                  <span>Memiliki alur kerja (workflow) teruji yang dapat digunakan berulang kali.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#34D399] font-mono text-xs mt-0.5">✓</span>
                  <span>Membangun kebiasaan menerbitkan konten dan portofolio pembuktian (proof).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#34D399] font-mono text-xs mt-0.5">✓</span>
                  <span>Berani meluncurkan prototipe, produk mini, atau tulisan ke hadapan publik.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#34D399] font-mono text-xs mt-0.5">✓</span>
                  <span>Mendapat feedback konstruktif dan relasi sehat dari sesama digital builder.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#34D399] font-mono text-xs mt-0.5">✓</span>
                  <span>Memahami pilihan jalur freelance, produk digital, dan monetisasi mandiri.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          3. EMPAT BIDANG UTAMA (PILLARS)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="pembelajaran" className="py-24 px-6 sm:px-8 max-w-6xl mx-auto relative z-10 scroll-mt-20">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] mb-2 block">
            Kurikulum & Topik Utama
          </span>
          <h2 className={`${lora.className} text-3xl sm:text-4xl text-white font-normal mb-4`}>
            Empat bidang untuk membangun kemandirian digital.
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed">
            <strong className="text-white font-medium">System thinking</strong> menjadi benang merah yang menghubungkan seluruh topik—mengubah keahlian acak menjadi proses yang terstruktur, berulang, dan bernilai ekonomi nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FOUR_PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="p-8 rounded-3xl bg-[#090A10] border border-white/10 hover:border-[#34D399]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-white/40 tracking-wider">
                      {pillar.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#34D399] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] font-light mb-6 leading-relaxed">
                    {pillar.subtitle}
                  </p>

                  <div className="pt-4 border-t border-white/5 space-y-2.5">
                    {pillar.highlights.map((point) => (
                      <div key={point} className="flex items-start gap-2.5 text-xs text-white/80 font-light">
                        <span className="text-[#34D399] font-mono mt-0.5">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          4. APA YANG ADA DI DALAM KOMUNITAS
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="aktivitas" className="py-24 px-6 sm:px-8 border-t border-white/5 bg-[#08090E]/50 relative z-10 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] mb-2 block">
              Pengalaman di Dalam
            </span>
            <h2 className={`${lora.className} text-3xl sm:text-4xl text-white font-normal mb-4`}>
              Apa yang bisa kamu temukan di dalam komunitas.
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed">
              Ruang yang dirancang untuk mendukung aksi dan kebiasaan berkarya nyata, bukan sekadar grup obrolan bising yang membuang waktu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMUNITY_ACTIVITIES.map((act) => (
              <div
                key={act.title}
                className="p-6 rounded-2xl bg-[#0D0E15] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/60 mb-3 inline-block">
                    {act.tag}
                  </span>
                  <h3 className="text-base font-semibold text-white mb-2">{act.title}</h3>
                  <p className="text-xs text-white/60 font-light leading-relaxed">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          5. PREVIEW AREA ANGGOTA (MOCKUP DASHBOARD UI)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="preview-area" className="py-24 px-6 sm:px-8 max-w-6xl mx-auto relative z-10 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] mb-2 block">
            Preview Area Anggota
          </span>
          <h2 className={`${lora.className} text-3xl sm:text-4xl text-white font-normal mb-4`}>
            Eksplorasi ruang kerja komunitas.
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed">
            Gambaran antarmuka dan pengalaman yang sedang kami siapkan untuk anggota saat masuk ke dalam portal komunitas.
          </p>
        </div>

        {/* Mockup Dashboard Window */}
        <div className="rounded-3xl bg-[#090A10] border border-white/15 shadow-2xl overflow-hidden backdrop-blur-3xl">
          {/* Top Window Bar */}
          <div className="px-5 py-3.5 bg-[#12131A] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/60" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-3 text-xs font-mono text-white/40 hidden sm:inline">
                khadafidaffa.com / ruang-bertumbuh
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Status: Dalam Tahap Pengembangan</span>
            </div>
          </div>

          {/* Inner Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Sidebar Mockup */}
            <div className="lg:col-span-3 bg-[#0B0C12] p-5 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
                  Navigasi Anggota
                </div>
                <div className="px-3 py-2 rounded-xl bg-[#34D399]/15 text-[#34D399] text-xs font-medium flex items-center gap-2.5">
                  <Compass className="w-4 h-4" />
                  <span>Community Feed</span>
                </div>
                <div className="px-3 py-2 rounded-xl text-white/60 hover:text-white text-xs flex items-center gap-2.5 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Diskusi & Q&A</span>
                </div>
                <div className="px-3 py-2 rounded-xl text-white/60 hover:text-white text-xs flex items-center gap-2.5 transition-colors">
                  <Layers className="w-4 h-4" />
                  <span>Feedback Lab</span>
                </div>
                <div className="px-3 py-2 rounded-xl text-white/60 hover:text-white text-xs flex items-center gap-2.5 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  <span>Resources & Notes</span>
                </div>
                <div className="px-3 py-2 rounded-xl text-white/60 hover:text-white text-xs flex items-center gap-2.5 transition-colors">
                  <Flame className="w-4 h-4" />
                  <span>Build Log Publik</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-6 lg:mt-0 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-[#34D399] flex items-center justify-center text-xs font-bold font-mono">
                  M
                </div>
                <div className="text-left text-xs">
                  <div className="text-white font-medium">Anggota Komunitas</div>
                  <div className="text-white/40 text-[10px] font-mono">Portal Akses Mandiri</div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 p-6 sm:p-8 bg-[#07080D] flex flex-col justify-between">
              <div>
                {/* Welcome Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-indigo-950/20 border border-white/10 mb-6">
                  <h4 className="text-base font-semibold text-white mb-1">
                    Selamat datang di Ruang Bertumbuh.
                  </h4>
                  <p className="text-xs text-white/70 font-light">
                    Karya apa yang ingin kamu mulai, diskusikan, atau selesaikan hari ini?
                  </p>
                </div>

                {/* Filter tags mockup */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-mono">
                  <span className="px-3 py-1 rounded-lg bg-[#34D399] text-[#05050A] font-semibold">
                    Semua
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-white/60 hover:text-white">
                    #AI-Creation
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-white/60 hover:text-white">
                    #Content-System
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-white/60 hover:text-white">
                    #Product-MVP
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white/5 text-white/60 hover:text-white">
                    #Monetisasi
                  </span>
                </div>

                {/* Sample Threads */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#0D0E15] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-1">
                        <span className="text-[#34D399]">#Product-MVP</span>
                        <span>•</span>
                        <span>Ditulis oleh Alex K.</span>
                      </div>
                      <h5 className="text-sm font-medium text-white">
                        Membuat sistem registrasi tanpa password menggunakan Supabase Auth & Next.js
                      </h5>
                    </div>
                    <span className="text-xs font-mono text-white/50 flex-shrink-0">
                      8 tanggapan
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0D0E15] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 mb-1">
                        <span className="text-[#34D399]">#AI-Creation</span>
                        <span>•</span>
                        <span>Ditulis oleh Maya S.</span>
                      </div>
                      <h5 className="text-sm font-medium text-white">
                        Prompt framework untuk menyusun outline buku non-fiksi berdasar riset jurnal
                      </h5>
                    </div>
                    <span className="text-xs font-mono text-white/50 flex-shrink-0">
                      14 tanggapan
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-xs text-white/40 font-mono text-center sm:text-left">
                * Area interaktif di atas merupakan representasi antarmuka portal yang sedang dikembangkan.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          6. CATATAN DARI KHADAFI (EDITORIAL PERSONAL SECTION)
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="catatan-khadafi" className="py-24 px-6 sm:px-8 border-t border-white/5 bg-[#08090E]/40 relative z-10 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0B0C12] border border-white/10 relative">
            <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] mb-4 block">
              Catatan dari Host
            </span>

            <blockquote className={`${lora.className} text-xl sm:text-2xl md:text-3xl text-white font-normal leading-relaxed mb-8`}>
              &ldquo;Saya membangun komunitas ini karena perjalanan belajar, membuat konten, dan membangun produk terasa jauh lebih berat ketika dijalani sendirian. Di sini saya membagikan proses nyata—termasuk keputusan desain, eksperimen, kegagalan, dan sistem yang sedang saya bangun—agar kita bisa belajar dan menghasilkan sesuatu bersama.&rdquo;
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-base font-semibold text-white">Daffa Dhiyaulhaq Khadafi</div>
                <div className="text-xs text-white/50 font-mono">
                  Host Komunitas · AI-Assisted Product Engineer
                </div>
              </div>

              {/* Supporting context chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <Link
                  href="/blog"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
                >
                  Chikki Studio ↗
                </Link>
                <Link
                  href="/lab"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
                >
                  HCFTL Lab ↗
                </Link>
                <Link
                  href="/blog"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
                >
                  Digital Grimoire ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          7. UNTUK SIAPA KOMUNITAS INI
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="untuk-siapa" className="py-24 px-6 sm:px-8 max-w-5xl mx-auto relative z-10 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] mb-2 block">
            Kesesuaian Anggota
          </span>
          <h2 className={`${lora.className} text-3xl sm:text-4xl text-white font-normal mb-4`}>
            Untuk siapa ruang ini diciptakan?
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed">
            Komunitas ini tidak eksklusif hanya untuk programmer atau orang teknis, melainkan untuk siapa pun yang bertekad mewujudkan gagasannya menjadi kenyataan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TARGET_AUDIENCES.map((target) => (
            <div
              key={target.title}
              className="p-6 rounded-2xl bg-[#090A10] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-semibold text-white mb-2">{target.title}</h3>
                <p className="text-xs text-white/70 font-light leading-relaxed">{target.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          8. BUDAYA KOMUNITAS
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="budaya" className="py-24 px-6 sm:px-8 border-t border-white/5 bg-[#08090E]/60 relative z-10 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] mb-2 block">
              Prinsip & Nilai
            </span>
            <h2 className={`${lora.className} text-3xl sm:text-4xl text-white font-normal mb-4`}>
              Budaya yang kita jaga bersama.
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] font-light leading-relaxed">
              Kenyamanan dan produktivitas komunitas bertumpu pada cara kita memperlakukan satu sama lain dan menghargai karya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CULTURE_VALUES.map((c, idx) => (
              <div
                key={c.title}
                className="p-6 rounded-2xl bg-[#0B0C12] border border-white/10 flex items-start gap-4"
              >
                <span className="text-xs font-mono text-[#34D399] mt-0.5">0{idx + 1}.</span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">{c.title}</h3>
                  <p className="text-xs text-white/60 font-light leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────
          9. FAQ DAN CTA BERGABUNG
         ─────────────────────────────────────────────────────────────────────── */}
      <section id="gabung" className="py-24 px-6 sm:px-8 max-w-4xl mx-auto relative z-10 scroll-mt-20">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] mb-2 block">
            Pertanyaan Umum
          </span>
          <h2 className={`${lora.className} text-3xl sm:text-4xl text-white font-normal mb-4`}>
            Hal yang sering ditanyakan.
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-20">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-[#0B0C12] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-medium text-white hover:text-[#34D399] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform duration-300 ${
                      isOpen ? "-rotate-180 text-[#34D399]" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-white/70 font-light leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Final CTA Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0D0E15] to-[#08090E] border border-white/15 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#34D399]/10 blur-[100px] pointer-events-none" />

          <h2 className={`${lora.className} text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4 relative z-10`}>
            Tidak harus membangun semuanya sendirian.
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] font-light max-w-xl mx-auto mb-8 leading-relaxed relative z-10">
            Temukan teman belajar, bagikan progresmu, dan ubah ide menjadi karya yang bisa dilihat dunia.
          </p>

          <div className="max-w-md mx-auto relative z-10">
            {!waitlistSubmitted ? (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Masukkan email kamu..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#34D399] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#34D399] hover:bg-[#2EB882] text-[#05050A] font-semibold text-sm transition-all shadow-md shadow-[#34D399]/20 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
                >
                  Gabung Antrean Minat
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-[#34D399]/40 text-emerald-300 text-xs font-mono">
                ✓ Terima kasih! Email kamu telah dicatat. Kami akan mengabari saat pintu akses dibuka.
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-white/40">
              <span>Status: Akses komunitas sedang disiapkan</span>
              <span>•</span>
              <button
                type="button"
                onClick={() => scrollToSection("pembelajaran")}
                className="text-[#34D399] hover:underline cursor-pointer"
              >
                Pelajari Topik Komunitas ↑
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
