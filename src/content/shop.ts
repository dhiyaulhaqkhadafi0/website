import type { Product } from "@/lib/commerce-types";
export type OfferingType = "original" | "recommended" | "service";
export type ShopItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: OfferingType;
  provider: string;
  topic: string;
  format: string;
  tags: string[];
  href: string;
  price: number | null;
  priceLabel: string;
  artwork:
    | "book"
    | "chatgpt"
    | "figma"
    | "notion"
    | "vercel"
    | "web"
    | "prototype"
    | "strategy";
  cover?: string;
  updatedAt: string;
};
export type CuratedTool = ShopItem & {
  type: "recommended";
  officialUrl: string;
  pricingUrl: string;
  benefits: string[];
  audience: string;
  limitation: string;
  reason: string;
  affiliate: false;
  verifiedAt: string;
};
export const CURATED_TOOLS: CuratedTool[] = [
  {
    id: "pick-chatgpt",
    slug: "chatgpt",
    title: "ChatGPT",
    provider: "OpenAI",
    type: "recommended",
    description:
      "Ruang berpikir untuk merapikan ide, menulis draf, dan mengeksplorasi pendekatan sebelum mulai membangun.",
    topic: "AI & Tools",
    format: "Software",
    tags: ["ai", "writing", "riset", "prompt", "productivity"],
    href: "/products/chatgpt",
    price: null,
    priceLabel: "Cek paket di provider",
    artwork: "chatgpt",
    updatedAt: "2026-10-16",
    officialUrl: "https://chatgpt.com/overview/",
    pricingUrl: "https://chatgpt.com/pricing/",
    affiliate: false,
    verifiedAt: "2026-10-16",
    benefits: [
      "Mengembangkan draf tulisan dan alternatif ide.",
      "Membantu menjelaskan konsep dan meninjau pendekatan kerja.",
      "Mendukung pekerjaan coding dan analisis sesuai fitur paket.",
    ],
    audience:
      "Builder, kreator, dan pekerja digital yang membutuhkan partner berpikir serta tetap meninjau hasilnya sendiri.",
    limitation:
      "Jawaban dapat keliru. Periksa sumber dan hasil kerja; fitur, kuota, dan harga mengikuti paket OpenAI. Jangan memasukkan data klien tanpa izin.",
    reason:
      "Berguna pada langkah awal: membawa catatan yang masih tersebar menjadi pertanyaan, draf, atau rencana yang bisa diperiksa.",
  },
  {
    id: "pick-figma",
    slug: "figma",
    title: "Figma Design",
    provider: "Figma",
    type: "recommended",
    description:
      "Dari sketsa alur sampai prototype: pikirkan pengalaman produk sebelum menulis implementasinya.",
    topic: "Product Building",
    format: "Software",
    tags: ["design", "ui", "ux", "prototype", "website"],
    href: "/products/figma",
    price: null,
    priceLabel: "Cek paket di provider",
    artwork: "figma",
    updatedAt: "2026-10-16",
    officialUrl: "https://www.figma.com/design/",
    pricingUrl: "https://www.figma.com/pricing/",
    affiliate: false,
    verifiedAt: "2026-10-16",
    benefits: [
      "Merancang tampilan dan alur antarmuka.",
      "Menguji gagasan lewat prototype interaktif.",
      "Menyatukan feedback desain dan handover dalam satu tempat.",
    ],
    audience:
      "Solo builder dan tim produk yang ingin menguji flow serta menjaga konsistensi antarmuka.",
    limitation:
      "Membutuhkan akun untuk membuat dan menyimpan desain. Batas file, kolaborasi, dan fitur mengikuti paket; prototype tidak otomatis menjadi produk production.",
    reason:
      "Membuat keputusan desain terasa nyata lebih awal, sehingga diskusi dapat bertumpu pada alur yang terlihat.",
  },
  {
    id: "pick-notion",
    slug: "notion",
    title: "Notion",
    provider: "Notion",
    type: "recommended",
    description:
      "Tempat yang rapi untuk brief, dokumentasi, kalender konten, dan pengetahuan proyek yang terus bertumbuh.",
    topic: "Digital Business",
    format: "Software",
    tags: ["workspace", "notes", "content", "planning", "productivity"],
    href: "/products/notion",
    price: null,
    priceLabel: "Cek paket di provider",
    artwork: "notion",
    updatedAt: "2026-10-16",
    officialUrl: "https://www.notion.com/product",
    pricingUrl: "https://www.notion.com/pricing",
    affiliate: false,
    verifiedAt: "2026-10-16",
    benefits: [
      "Menghubungkan catatan, dokumen, dan database kerja.",
      "Menyusun brief serta dokumentasi yang mudah diperbarui.",
      "Mengatur proyek dan kalender editorial dalam workspace.",
    ],
    audience:
      "Kreator, freelancer, dan tim kecil yang ingin dokumentasi serta rencana kerja lebih mudah ditemukan.",
    limitation:
      "Ini rekomendasi software, bukan template Khadafi. Akun diperlukan; kolaborasi, unggahan, dan fitur AI mengikuti ketentuan paket provider.",
    reason:
      "Sederhana untuk memulai dari satu halaman, lalu berkembang menjadi sistem dokumentasi yang sesuai cara kerja sendiri.",
  },
  {
    id: "pick-vercel",
    slug: "vercel",
    title: "Vercel",
    provider: "Vercel",
    type: "recommended",
    description:
      "Bawa aplikasi web dari repository ke preview yang bisa dibagikan, lalu kelola deployment sesuai kebutuhan proyek.",
    topic: "Product Building",
    format: "Platform",
    tags: ["hosting", "deployment", "nextjs", "frontend", "developer"],
    href: "/products/vercel",
    price: null,
    priceLabel: "Cek paket di provider",
    artwork: "vercel",
    updatedAt: "2026-10-16",
    officialUrl: "https://vercel.com/",
    pricingUrl: "https://vercel.com/pricing",
    affiliate: false,
    verifiedAt: "2026-10-16",
    benefits: [
      "Membagikan preview aplikasi untuk review.",
      "Menghubungkan deployment dengan repository proyek.",
      "Mengelola hosting frontend dan fungsi server sesuai dukungan platform.",
    ],
    audience:
      "Developer dan builder yang sudah memiliki source aplikasi web serta memahami kebutuhan deployment-nya.",
    limitation:
      "Paket Hobby ditujukan untuk penggunaan personal nonkomersial. Proyek komersial perlu paket yang sesuai; batas penggunaan dan biaya tambahan mengikuti Vercel.",
    reason:
      "Preview yang mudah dibagikan membantu feedback terhadap aplikasi nyata, terutama pada iterasi antarmuka.",
  },
];
export type Service = ShopItem & {
  type: "service";
  intro: string;
  audience: string;
  scope: string[];
  deliverables: string[];
  exclusions: string[];
  requirements: string[];
  process: [string, string][];
  timeline: string;
};
export const SERVICES: Service[] = [
  {
    id: "service-web",
    slug: "website-landing-page",
    title: "Website & Landing Page",
    provider: "Khadafi",
    type: "service",
    description:
      "Digital presence yang terasa tepat: tampilan yang terarah, alur yang jelas, dan fondasi website yang nyaman digunakan.",
    topic: "Product Building",
    format: "Proyek custom",
    tags: ["website", "landing", "development", "bisnis", "ui", "ux"],
    href: "/services/website-landing-page",
    price: null,
    priceLabel: "Penawaran sesuai scope",
    artwork: "web",
    updatedAt: "2026-10-16",
    intro:
      "Website yang bukan hanya enak dilihat. Setiap halaman perlu membantu pengunjung memahami siapa kamu, apa yang kamu tawarkan, dan langkah berikutnya.",
    audience:
      "Kreator, profesional independen, dan bisnis yang membutuhkan landing page atau website dengan tujuan yang jelas.",
    scope: [
      "Diskusi tujuan, audiens, dan struktur halaman.",
      "Arah visual dan desain responsif.",
      "Implementasi halaman serta integrasi yang disepakati.",
      "Pengujian alur utama dan persiapan handover.",
    ],
    deliverables: [
      "Source website sesuai ruang lingkup tertulis.",
      "Layout responsif untuk perangkat yang disepakati.",
      "Pemeriksaan fungsi utama dan dokumentasi handover.",
    ],
    exclusions: [
      "Domain, hosting, lisensi, dan biaya layanan pihak ketiga.",
      "Penulisan seluruh konten, identitas merek, atau pemotretan kecuali disepakati.",
      "Pemeliharaan berkelanjutan dan revisi tanpa batas.",
    ],
    requirements: [
      "Tujuan website dan contoh referensi.",
      "Materi brand, konten, dan daftar halaman awal.",
      "Kebutuhan integrasi serta akses teknis yang relevan setelah scope disetujui.",
    ],
    process: [
      ["Discovery", "Menyamakan tujuan, kebutuhan, dan batas pekerjaan."],
      ["Direction", "Menyepakati struktur, tampilan, jadwal, dan penawaran."],
      [
        "Build & review",
        "Implementasi dan review pada milestone yang disetujui.",
      ],
      ["Handover", "Pengujian akhir, dokumentasi, dan penyerahan hasil."],
    ],
    timeline:
      "Jadwal ditentukan setelah jumlah halaman, materi, integrasi, dan waktu feedback diketahui. Tidak ada janji tanggal sebelum scope disepakati.",
  },
  {
    id: "service-prototype",
    slug: "product-prototyping",
    title: "Product Prototyping & MVP",
    provider: "Khadafi",
    type: "service",
    description:
      "Bawa ide ke bentuk yang bisa diuji. Mulai dari alur, prototype, sampai fitur inti yang memang perlu dibangun.",
    topic: "Product Building",
    format: "Proyek custom",
    tags: ["mvp", "ai", "prototype", "app", "product", "workflow"],
    href: "/services/product-prototyping",
    price: null,
    priceLabel: "Penawaran sesuai scope",
    artwork: "prototype",
    updatedAt: "2026-10-16",
    intro:
      "Ide besar sering lebih mudah dimulai dari satu alur kecil yang bekerja. Kita tentukan apa yang perlu dipelajari, lalu bangun bentuk paling relevan untuk mengujinya.",
    audience:
      "Solo founder, kreator, dan tim kecil yang membutuhkan prototype atau implementasi awal dengan batas yang terukur.",
    scope: [
      "Merumuskan masalah, pengguna, dan alur prioritas.",
      "Menyusun batas fitur dan asumsi yang ingin diuji.",
      "Prototype atau implementasi fitur terpilih dengan AI sebagai alat bantu.",
      "Review hasil, batas teknis, dan langkah lanjutan.",
    ],
    deliverables: [
      "Brief produk dan alur prioritas.",
      "Prototype atau source MVP sesuai kesepakatan.",
      "Catatan pengujian, batas sistem, dan dokumentasi handover.",
    ],
    exclusions: [
      "Jaminan product-market fit, pendanaan, atau hasil bisnis.",
      "Semua fitur roadmap sekaligus.",
      "Audit keamanan tersertifikasi, operasi 24/7, dan biaya infrastruktur.",
    ],
    requirements: [
      "Masalah dan pengguna yang ingin dibantu.",
      "Contoh alur serta asumsi utama.",
      "Batas anggaran, waktu, dan kebutuhan integrasi jika sudah ada.",
    ],
    process: [
      ["Frame", "Tentukan masalah dan pertanyaan yang ingin dijawab."],
      ["Scope", "Pilih satu alur inti dan definisikan selesai."],
      ["Prototype / build", "Wujudkan fitur prioritas dan review bersama."],
      ["Learn", "Dokumentasikan temuan serta pilihan iterasi berikutnya."],
    ],
    timeline:
      "Durasi mengikuti kompleksitas alur, integrasi, dan bentuk hasil: prototype atau implementasi. Estimasi diberikan setelah discovery.",
  },
  {
    id: "service-strategy",
    slug: "content-marketing-strategy",
    title: "Content & Marketing Strategy",
    provider: "Khadafi",
    type: "service",
    description:
      "Rapikan pesan, tentukan prioritas, dan susun rencana konten yang berangkat dari produk serta audiensmu.",
    topic: "Creator & Marketing",
    format: "Audit & strategi",
    tags: [
      "content",
      "marketing",
      "strategy",
      "audit",
      "creator",
      "positioning",
    ],
    href: "/services/content-marketing-strategy",
    price: null,
    priceLabel: "Penawaran sesuai scope",
    artwork: "strategy",
    updatedAt: "2026-10-16",
    intro:
      "Konten yang terarah dimulai dari pesan yang jelas. Kita meninjau digital presence, memahami kebutuhan audiens, lalu menyusun langkah yang realistis untuk dijalankan.",
    audience:
      "Kreator dan bisnis yang ingin menata komunikasi produk serta rencana konten, sebelum menambah volume produksi.",
    scope: [
      "Audit kanal dan materi yang disepakati.",
      "Penajaman audiens, pesan, dan arah konten.",
      "Content pillars serta contoh kerangka editorial.",
      "Action plan dan prioritas pengukuran.",
    ],
    deliverables: [
      "Dokumen temuan audit dan rekomendasi.",
      "Content framework serta contoh rencana editorial.",
      "Action plan dengan indikator yang dapat dievaluasi.",
    ],
    exclusions: [
      "Jaminan viral, jumlah followers, atau target pendapatan.",
      "Biaya iklan, produksi harian, dan pengelolaan akun kecuali disepakati.",
      "Riset berbayar serta lisensi aset pihak ketiga.",
    ],
    requirements: [
      "Produk, audiens, dan tujuan komunikasi.",
      "Tautan kanal serta materi yang boleh ditinjau.",
      "Data performa yang boleh dibagikan jika tersedia; tidak perlu kata sandi.",
    ],
    process: [
      ["Listen", "Pahami konteks produk, audiens, dan kendala."],
      ["Audit", "Tinjau materi serta pola komunikasi saat ini."],
      ["Shape", "Susun arah pesan dan kerangka konten."],
      ["Plan", "Prioritaskan langkah eksekusi serta evaluasi."],
    ],
    timeline:
      "Jadwal bergantung pada jumlah kanal, ketersediaan data, dan kedalaman audit. Cakupan serta jumlah review disepakati dalam penawaran.",
  },
];
export function originalItem(product: Product): ShopItem {
  return {
    id: product.id,
    slug: product.slug,
    title: product.name,
    description: product.short_description,
    type: "original",
    provider: "Khadafi",
    topic: product.category === "Ebook" ? "Ebooks" : "Digital Business",
    format: product.category,
    tags: [product.category, "original", "digital"],
    href: "/products/" + product.slug,
    price: product.price,
    priceLabel:
      product.price === 0
        ? "Gratis"
        : new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(product.price),
    artwork: "book",
    cover: product.cover_url,
    updatedAt: product.updated_at,
  };
}
export const OFFERING_LABELS = {
  all: "Semua Koleksi",
  original: "Produk Original",
  recommended: "Affiliate Picks",
  service: "Jasa Khadafi",
} as const;
