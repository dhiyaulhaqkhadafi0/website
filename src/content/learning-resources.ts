export type LearningCategory = "ai" | "product" | "marketing" | "business";
export type LearningResource = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: LearningCategory;
  format:
    "article" | "course" | "template" | "checklist" | "video" | "playbook";
  level: "beginner" | "intermediate" | "advanced";
  language: "id" | "en" | "mixed";
  sourceType: "original" | "curated";
  provider: string;
  externalUrl?: string;
  internalPath?: string;
  accessNote: string;
  featured: boolean;
  status: "draft" | "review" | "published";
  verifiedAt: string;
};
export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: "learning-01",
    slug: "high-context-prompts-pack",
    title: "High-Context Prompts Pack",
    description:
      "24 prompt untuk riset, spesifikasi produk, pemeriksaan kode, dan tulisan. Lengkapi konteksnya, lalu uji hasilnya.",
    category: "ai",
    format: "template",
    level: "intermediate",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/high-context-prompts-pack",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-02",
    slug: "ai-assisted-research-workflow",
    title: "AI-Assisted Research & Synthesis Workflow",
    description:
      "Alur riset yang memisahkan bukti, interpretasi, dan pertanyaan terbuka. Termasuk lembar catatan sumber.",
    category: "ai",
    format: "playbook",
    level: "intermediate",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/ai-assisted-research-workflow",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-03",
    slug: "ai-product-blueprint",
    title: "AI Product Blueprint & PRD Engine",
    description:
      "Susun kebutuhan pengguna, alur produk, batas MVP, dan kriteria penerimaan dalam satu dokumen yang bisa disalin.",
    category: "product",
    format: "template",
    level: "intermediate",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/ai-product-blueprint",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-04",
    slug: "vibe-coding-field-guide",
    title: "Vibe Coding Field Guide",
    description:
      "Tujuh prinsip bekerja bersama coding assistant: konteks yang jelas, perubahan kecil, dan verifikasi nyata.",
    category: "product",
    format: "playbook",
    level: "intermediate",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/vibe-coding-field-guide",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-05",
    slug: "mvp-readiness-checklist",
    title: "MVP Readiness Checklist",
    description:
      "32 pemeriksaan untuk meninjau keamanan, pengalaman pengguna, data, dan kesiapan peluncuran produk.",
    category: "product",
    format: "checklist",
    level: "intermediate",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/mvp-readiness-checklist",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-06",
    slug: "ai-content-operating-system",
    title: "AI Content Operating System",
    description:
      "Dari satu ide menjadi artikel dan materi distribusi. Gunakan papan kerja Markdown tanpa akun tambahan.",
    category: "marketing",
    format: "template",
    level: "beginner",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/ai-content-operating-system",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-07",
    slug: "personal-brand-positioning-canvas",
    title: "Personal Brand Positioning Canvas",
    description:
      "Lembar kerja untuk merumuskan audiens, keahlian, sudut pandang, dan bukti kerja yang bisa ditunjukkan.",
    category: "marketing",
    format: "template",
    level: "beginner",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/personal-brand-positioning-canvas",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-08",
    slug: "creator-to-founder-framework",
    title: "Creator-to-Founder Transition Framework",
    description:
      "Kenali masalah berulang, kemas keahlian menjadi layanan, lalu uji ide produk secara bertahap.",
    category: "business",
    format: "playbook",
    level: "intermediate",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/creator-to-founder-framework",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-09",
    slug: "prompting-fundamentals",
    title: "Prompting Fundamentals",
    description:
      "Pelajari cara memberi tujuan, konteks, format hasil, dan batasan saat bekerja dengan ChatGPT.",
    category: "ai",
    format: "article",
    level: "beginner",
    language: "en",
    sourceType: "curated",
    provider: "OpenAI Academy",
    externalUrl: "https://learn.chatgpt.com/docs/prompting",
    accessNote:
      "Panduan dapat dibaca gratis. Akun ChatGPT diperlukan untuk mencoba; fitur dan batas paket dapat berbeda.",
    featured: true,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-10",
    slug: "generative-ai-and-agents",
    title: "Introduction to Generative AI and Agents",
    description:
      "Pengenalan model bahasa, prompt, dan agen AI melalui modul bertahap dari Microsoft Learn.",
    category: "ai",
    format: "course",
    level: "beginner",
    language: "en",
    sourceType: "curated",
    provider: "Microsoft Learn",
    externalUrl:
      "https://learn.microsoft.com/en-us/training/modules/fundamentals-generative-ai/",
    accessNote:
      "Modul dapat dibaca gratis. Akun Microsoft diperlukan untuk menyimpan pencapaian. Kenali konsep AI dasar terlebih dahulu; latihan layanan dapat memiliki ketentuan tersendiri.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-11",
    slug: "prompting-for-content-creators",
    title: "Prompt Engineering for Content Creators",
    description:
      "Video pengantar menyusun konteks dan arahan untuk ide, skrip, serta konten yang sesuai dengan gaya sendiri.",
    category: "ai",
    format: "video",
    level: "beginner",
    language: "en",
    sourceType: "curated",
    provider: "OpenAI Academy",
    externalUrl:
      "https://academy.openai.com/en/public/clubs/india-gkubq/videos/prompt-engineering-fundamentals-for-content-creators-2025-09-15",
    accessNote:
      "Konten komunitas gratis; halaman meminta masuk atau bergabung untuk melanjutkan. Bahasa pengantar Inggris, ketersediaan subtitle mengikuti penyedia.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-12",
    slug: "figma-design-for-beginners",
    title: "Figma Design for Beginners",
    description:
      "Belajar frame, komponen, auto layout, dan prototipe sambil merancang website portofolio.",
    category: "product",
    format: "course",
    level: "beginner",
    language: "en",
    sourceType: "curated",
    provider: "Figma",
    externalUrl:
      "https://help.figma.com/hc/en-us/articles/30848209492887-Course-overview-Figma-Design-for-beginners-2025",
    accessNote:
      "Materi gratis. Akun Figma dan komputer diperlukan untuk latihan; paket Starter cukup. Tampilan video 2025 dapat berbeda dari versi terbaru.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-13",
    slug: "introduction-to-github",
    title: "Introduction to GitHub",
    description:
      "Latihan langsung menggunakan repository, branch, commit, dan pull request dalam proyek kecil.",
    category: "product",
    format: "course",
    level: "beginner",
    language: "en",
    sourceType: "curated",
    provider: "GitHub Skills",
    externalUrl: "https://github.com/skills/introduction-to-github",
    accessNote:
      "Materi dan latihan gratis. Akun GitHub diperlukan untuk membuat repository latihan.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-14",
    slug: "learn-nextjs-app-router",
    title: "Learn Next.js — App Router",
    description:
      "Bangun aplikasi web sambil mempelajari routing, data, formulir, dan autentikasi.",
    category: "product",
    format: "course",
    level: "intermediate",
    language: "en",
    sourceType: "curated",
    provider: "Next.js",
    externalUrl: "https://nextjs.org/learn/dashboard-app",
    accessNote:
      "Kursus gratis. Membutuhkan dasar React, Node.js, serta akun GitHub dan Vercel untuk mengikuti semua latihan. Layanan hosting tambahan memiliki batas paket.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-15",
    slug: "content-marketing-certification",
    title: "Content Marketing Certification",
    description:
      "Kursus tentang strategi konten, perencanaan, distribusi, dan evaluasi dari HubSpot Academy.",
    category: "marketing",
    format: "course",
    level: "beginner",
    language: "en",
    sourceType: "curated",
    provider: "HubSpot Academy",
    externalUrl: "https://academy.hubspot.com/courses/content-marketing",
    accessNote:
      "Kursus dan sertifikasi ini gratis dengan akun HubSpot Academy. Produk HubSpot berbayar tidak diperlukan untuk belajar.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-16",
    slug: "panduan-memulai-seo",
    title: "Panduan Memulai SEO",
    description:
      "Kenali cara mesin pencari menemukan konten dan praktik dasar agar website mudah dipahami.",
    category: "marketing",
    format: "article",
    level: "beginner",
    language: "id",
    sourceType: "curated",
    provider: "Google Search Central",
    externalUrl:
      "https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=id",
    accessNote:
      "Panduan berbahasa Indonesia, gratis dan tanpa login. Praktik SEO tidak menjamin peringkat tertentu.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-17",
    slug: "upwork-for-beginners",
    title: "How to Use Upwork as a Freelancer",
    description:
      "Panduan menyusun profil, memilih peluang, mengirim proposal, dan memahami alur proyek di Upwork.",
    category: "business",
    format: "article",
    level: "beginner",
    language: "en",
    sourceType: "curated",
    provider: "Upwork",
    externalUrl: "https://www.upwork.com/resources/upwork-for-beginners",
    accessNote:
      "Artikel gratis tanpa login. Akun diperlukan untuk menggunakan platform; lamaran dapat memerlukan Connects berbayar dan pendapatan dikenai biaya layanan.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-18",
    slug: "startup-school",
    title: "Startup School",
    description:
      "Kursus mandiri untuk memahami masalah pengguna, menguji ide, dan mulai membangun perusahaan.",
    category: "business",
    format: "course",
    level: "beginner",
    language: "en",
    sourceType: "curated",
    provider: "Y Combinator",
    externalUrl: "https://www.startupschool.org/",
    accessNote:
      "Kursus online gratis. Akun diperlukan untuk mengikuti program dan menyimpan aktivitas. Tidak menjamin pendanaan atau penerimaan ke program YC.",
    featured: false,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-19",
    slug: "product-idea-brief",
    title: "Product Idea Brief — Dari Masalah ke MVP",
    description:
      "Mulai dengan masalah yang jelas. Panduan, template siap salin, dan contoh terisi untuk ide produk pertamamu.",
    category: "product",
    format: "template",
    level: "beginner",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/product-idea-brief",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: true,
    status: "published",
    verifiedAt: "2026-10-16",
  },
  {
    id: "learning-20",
    slug: "checklist-persiapan-freelance",
    title: "Checklist Persiapan Freelance 0–1",
    description:
      "Pilih layanan, siapkan dua karya, tulis proposal, dan susun 30 hari pertamamu. Dengan checklist yang bisa dicetak.",
    category: "business",
    format: "checklist",
    level: "beginner",
    language: "id",
    sourceType: "original",
    provider: "Khadafi",
    internalPath: "/resources/checklist-persiapan-freelance",
    accessNote:
      "Gratis, tanpa login. Materi dan template tersedia langsung di halaman.",
    featured: true,
    status: "published",
    verifiedAt: "2026-10-16",
  },
];
export const LEARNING_TOPICS = [
  {
    id: "ai",
    label: "AI & Automation",
    short: "AI",
    description: "Bekerja dengan rasa ingin tahu.",
    mark: "✳",
    count: 5,
  },
  {
    id: "product",
    label: "Product Building & Design",
    short: "Product",
    description: "Dari sebuah ide menjadi nyata.",
    mark: "◈",
    count: 7,
  },
  {
    id: "marketing",
    label: "Marketing & Content",
    short: "Marketing",
    description: "Cerita yang menemukan audiensnya.",
    mark: "↗",
    count: 4,
  },
  {
    id: "business",
    label: "Freelance & Digital Business",
    short: "Freelance",
    description: "Bangun jalan independenmu.",
    mark: "⌁",
    count: 4,
  },
] as const;
export const FORMAT_LABELS: Record<LearningResource["format"], string> = {
  article: "Artikel",
  course: "Kursus",
  template: "Template",
  checklist: "Checklist",
  video: "Video",
  playbook: "Panduan",
};
export const LEVEL_LABELS: Record<LearningResource["level"], string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
};
export const LANGUAGE_LABELS = {
  id: "Indonesia",
  en: "Inggris",
  mixed: "Indonesia & Inggris",
};
export const learningHref = (r: LearningResource) =>
  r.externalUrl || r.internalPath || "/resources";
export const LEARNING_PATHS = [
  {
    title: "AI for Creators",
    intro: "Kenali dasarnya, beri arahan yang jelas, lalu buat alur kontenmu.",
    slugs: [
      "generative-ai-and-agents",
      "prompting-fundamentals",
      "ai-content-operating-system",
    ],
  },
  {
    title: "Bangun produk pertamamu",
    intro: "Pahami masalahnya. Rancang, simpan perubahan, lalu bangun.",
    slugs: [
      "product-idea-brief",
      "figma-design-for-beginners",
      "introduction-to-github",
      "learn-nextjs-app-router",
    ],
  },
  {
    title: "Freelance dari nol",
    intro: "Siapkan keahlian, tunjukkan karya, dan kenali cara mencari klien.",
    slugs: [
      "checklist-persiapan-freelance",
      "personal-brand-positioning-canvas",
      "upwork-for-beginners",
    ],
  },
];
