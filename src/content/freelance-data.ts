export interface FreelanceStats {
  projectsBuilt: number;
  skillsDeveloping: number;
  placesToWork: string;
  weeklyFocusHours: string;
  clientsTarget: string;
  revenueStage: string;
}

export interface FreelanceStatus {
  stage: "Learning" | "Building" | "Finding Clients" | "Remote Work" | "Independence";
  stageIndex: number; // 0 to 4
  headline: string;
  subtext: string;
  currentLocation: string;
  locationStatus: string;
  workMode: string;
  coreFocus: string;
}

export interface JourneyMilestone {
  id: string;
  date: string;
  title: string;
  tagline: string;
  status: "completed" | "in-progress" | "planned";
  category: "Foundations" | "Services" | "Client Work" | "Expansion";
  description: string;
  lessons: string[];
  articleSlug?: string;
}

export interface ServiceCluster {
  id: string;
  title: string;
  badge: string;
  shortDesc: string;
  deliverables: string[];
  techStack: string[];
  idealFor: string[];
  timeline: string;
  startingRange: string;
  iconName: "Cpu" | "Layout" | "TrendingUp";
}

export interface CaseStudy {
  id: string;
  title: string;
  clientOrProject: string;
  role: string;
  summary: string;
  image?: string;
  accentColor: string;
  stack: string[];
  impactMetrics: { label: string; value: string }[];
  keySolutions: string[];
  link?: string;
  badge: string;
}

export interface ToolkitItem {
  id: string;
  name: string;
  category: "Find Work" | "Build" | "Productivity" | "Business";
  badge: "I Use" | "Testing" | "Recommended";
  cost: "Free" | "Freemium" | "Paid";
  description: string;
  tip: string;
  url?: string;
}

export interface FreelanceResource {
  id: string;
  title: string;
  category: "Starting" | "Clients" | "Pricing" | "AI Tools" | "Remote";
  readTime: string;
  summary: string;
  badge: string;
  highlights: string[];
  link?: string;
}

export interface RemoteLocation {
  id: string;
  city: string;
  country: string;
  flag: string;
  status: "current" | "planned" | "someday";
  statusLabel: string;
  vibe: string;
  targetTimeline?: string;
  notes: string;
}

export interface FreelanceNote {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  slug?: string;
}

// -------------------------------------------------------------
// DATA CONSTANTS
// -------------------------------------------------------------

export const FREELANCE_STATUS: FreelanceStatus = {
  stage: "Building",
  stageIndex: 1, // Learning(0) -> Building(1) -> Finding Clients(2) -> Remote Work(3) -> Independence(4)
  headline: "Building portfolio & finding sustainable remote opportunities.",
  subtext: "Bukan sekadar menawarkan jasa—aku sedang mendokumentasikan setiap eksperimen, kegagalan, dan kemenangan dalam transisi menjadi remote product builder independen.",
  currentLocation: "Bekasi, Indonesia",
  locationStatus: "Home Studio Base",
  workMode: "Remote / Asynchronous",
  coreFocus: "AI-Assisted Product Engineering × High-Conversion Systems",
};

export const FREELANCE_STATS: FreelanceStats = {
  projectsBuilt: 3,
  skillsDeveloping: 6,
  placesToWork: "∞",
  weeklyFocusHours: "35+ hrs",
  clientsTarget: "1-2 High Trust",
  revenueStage: "Zero to $1K Phase",
};

export const JOURNEY_STAGES = [
  { name: "Learning", desc: "Fundamental craft & AI stack", isPassed: true, isCurrent: false },
  { name: "Building", desc: "Crafting defensible proof of work", isPassed: false, isCurrent: true },
  { name: "Finding Clients", desc: "Inbound positioning & outreach", isPassed: false, isCurrent: false },
  { name: "Remote Work", desc: "Sustainable remote contracts", isPassed: false, isCurrent: false },
  { name: "Independence", desc: "Location & time sovereignty", isPassed: false, isCurrent: false },
];

export const JOURNEY_TIMELINE: JourneyMilestone[] = [
  {
    id: "m1",
    date: "SEPTEMBER 2026",
    title: "Starting The Freelance Journey",
    tagline: "Meletakkan fondasi identitas, positioning, dan build in public.",
    status: "completed",
    category: "Foundations",
    description: "Memutuskan untuk tidak sekadar melamar kerja biasa, melainkan membangun jalur independen. Menyiapkan website personal dengan filosofi transparansi penuh: membagikan proses dari nol, bukan berpura-pura sudah sukses.",
    lessons: [
      "Positioning harus spesifik: Generalist developer kalah dengan AI-Assisted Product Engineer.",
      "Dokumentasi proses (Build in Public) adalah magnet trust paling otentik.",
      "Membangun portofolio dari produk nyata, bukan sekadar tutorial cloning."
    ],
    articleSlug: "/blog"
  },
  {
    id: "m2",
    date: "OKTOBER 2026",
    title: "Packaging The 3 Core Services",
    tagline: "Merumuskan penawaran bernilai tinggi yang berorientasi hasil.",
    status: "in-progress",
    category: "Services",
    description: "Menyusun batas scope, deliverables, dan arsitektur harga untuk 3 klaster jasa: AI-Assisted Product Development, Product & UI/UX Design, serta Digital Growth Landing Systems.",
    lessons: [
      "Klien tidak membeli baris kode atau jam kerja; mereka membeli kecepatan dan hasil nyata.",
      "Deliverable 1–3 minggu dengan komunikasi asinkron sangat disukai early-stage founders.",
      "Membuat template proposal dan kontrak defensibel sebelum berhadapan dengan prospek."
    ],
  },
  {
    id: "m3",
    date: "NOVEMBER 2026",
    title: "The First Remote Client & Deliverable",
    tagline: "Validasi pasar nyata dan sprint eksekusi berkecepatan tinggi.",
    status: "planned",
    category: "Client Work",
    description: "Mendapatkan klien berbayar pertama melalui kombinasi inbound content, sharing tools, dan direct outreach ke founders yang butuh prototipe AI fungsional dalam hitungan hari.",
    lessons: [
      "Mengutamakan over-delivery pada klien perdana untuk membangun reputasi dan rekomendasi.",
      "Mengumpulkan feedback mendalam dan mengubah proyek menjadi case study terperinci."
    ],
  },
  {
    id: "m4",
    date: "2027 ONWARD",
    title: "Location Independence & Systems",
    tagline: "Membawa laptop ke kota berikutnya tanpa penurunan standar kualitas kerja.",
    status: "planned",
    category: "Expansion",
    description: "Mencapai ritme kerja remote yang matang dengan recurring retainers, produk digital mandiri, dan mobilitas geografis dari Bali, Yogyakarta, hingga nomad hubs Asia Tenggara.",
    lessons: [
      "Otomatisasi invoice dan operasional bisnis membebaskan energi untuk deep work kreatif.",
      "Kebebasan tempat adalah hasil sampingan dari disiplin dan sistem kerja yang kuat."
    ],
  }
];

export const SERVICE_CLUSTERS: ServiceCluster[] = [
  {
    id: "ai-product",
    title: "AI-Assisted Product Development",
    badge: "Most Requested",
    shortDesc: "Ubah ide abstrak menjadi MVP web app fungsional berkecepatan tinggi dengan Next.js, Supabase, dan integrasi model LLM.",
    deliverables: [
      "Fullstack Web App / MVP dalam 1–3 minggu",
      "Integrasi OpenAI / Claude / Gemini API",
      "Arsitektur Database PostgreSQL & Auth Supabase",
      "Deployment instan di Cloudflare / Vercel Edge",
      "Sistem asinkron & optimasi performa sub-detik"
    ],
    techStack: ["Next.js 16", "React 19", "Supabase", "TypeScript", "Tailwind CSS", "LLM APIs"],
    idealFor: ["Founders yang butuh validasi pasar cepat", "Solopreneurs yang butuh AI copilot tools", "Startups tahap pre-seed"],
    timeline: "1–3 Minggu",
    startingRange: "Fixed-Price Milestones",
    iconName: "Cpu"
  },
  {
    id: "product-uiux",
    title: "Product & UI/UX Design System",
    badge: "Craft & Clarity",
    shortDesc: "Desain antarmuka modern dengan estetika editorial, hierarki visual yang tajam, dan flow produk yang intuitif serta minim friksi.",
    deliverables: [
      "High-Fidelity UI System di Figma berskala komponen",
      "User Journey, Wireframes & Information Architecture",
      "Interactive Clickable Prototype siap demo",
      "Micro-interactions & Motion choreography",
      "Handoff aset desain rapi siap implementasi dev"
    ],
    techStack: ["Figma", "Design Tokens", "Framer Motion Principles", "Typography Pairing"],
    idealFor: ["Produk digital yang butuh tampilan world-class", "Aplikasi kompleks yang butuh penyederhanaan UX"],
    timeline: "1–2 Minggu",
    startingRange: "Sprint / Project Basis",
    iconName: "Layout"
  },
  {
    id: "digital-growth",
    title: "Digital Growth & Landing Systems",
    badge: "High Conversion",
    shortDesc: "Landing page berkecepatan tinggi dengan visual wow-factor, copywriting persuasif, dan fondasi Technical SEO yang defensibel.",
    deliverables: [
      "Custom Editorial Landing Page (bukan template generik)",
      "Technical SEO & Structured Data (JSON-LD)",
      "OpenGraph visual branding & metadata dinamis",
      "Integrasi analitik privasi & conversion tracking",
      "Copywriting & Value Proposition framing"
    ],
    techStack: ["Next.js App Router", "Tailwind CSS", "Semantic HTML5", "JSON-LD Schema"],
    idealFor: ["Kreator, agensi, & konsultan yang ingin upgrade citra", "Peluncuran produk baru (product hunt / waitlist)"],
    timeline: "3–7 Hari",
    startingRange: "Fixed Scope Sprint",
    iconName: "TrendingUp"
  }
];

export const SELECTED_WORK: CaseStudy[] = [
  {
    id: "chikki",
    title: "CHIKKI — Immersive Writing Network",
    clientOrProject: "In-House Digital Ecosystem",
    role: "Product Designer & AI-Assisted Engineer",
    summary: "Platform studio penulisan dengan TipTap WYSIWYG, AI repurposing engine lintas format, real-time reader engagement analytics, dan antarmuka editorial dark-mode yang elegan.",
    accentColor: "from-indigo-600/30 to-purple-600/20",
    badge: "Live Product MVP",
    stack: ["Next.js 16", "Supabase", "TipTap", "Tailwind CSS", "Framer Motion"],
    impactMetrics: [
      { label: "Velocity", value: "Built in 2 Weeks" },
      { label: "Core Feature", value: "Multi-Format AI Repurpose" },
      { label: "Performance", value: "Sub-100ms Interactions" }
    ],
    keySolutions: [
      "Mendesain canvas editor bebas distraksi dengan dukungan format kaya dan image handling otomatis.",
      "Membangun modal AI repurposing untuk mengubah artikel panjang menjadi tweet thread, LinkedIn post, dan newsletter.",
      "Arsitektur database Supabase dengan Row Level Security untuk melindungi privasi draf kreator."
    ],
    link: "/studio"
  },
  {
    id: "gerakasa",
    title: "GERAKASA — Fitness Intelligence Super App",
    clientOrProject: "Strategic Product Architecture",
    role: "Lead Architect & UI Concept Designer",
    summary: "Spesifikasi blueprint produk komprehensif dan prototype interaktif untuk orkestrasi kebugaran harian secara otomatis yang menghubungkan pengguna dengan pelatih, sasana, dan sensor fisik.",
    accentColor: "from-emerald-600/30 to-teal-600/20",
    badge: "Product Architecture",
    stack: ["Next.js", "Design Tokens", "Fitness Graph Ontology", "Spatial UI"],
    impactMetrics: [
      { label: "Blueprint Scope", value: "5 Strategic Pillars" },
      { label: "Horizon Span", value: "10-Year Roadmap" },
      { label: "B2B Infrastructure", value: "4 Business Modules" }
    ],
    keySolutions: [
      "Menyusun ontologi Fitness Graph terstruktur untuk merekam riwayat latihan longitudinal.",
      "Merancang antarmuka spatial dan prototype interaktif yang meminimalkan beban pengambilan keputusan harian pengguna.",
      "Perancangan modul ekosistem B2B (Gerakasa Pro, Partner, Business & OS API)."
    ],
    link: "/#apps"
  },
  {
    id: "hcftl",
    title: "HCFTL — AI Frontier Research Laboratory",
    clientOrProject: "Human-Centered Frontier Technology Lab",
    role: "Visual Engineer & Web Architect",
    summary: "Portal riset interaktif untuk eksplorasi AI frontier dan augmented human intelligence dengan visual atmospheric, tipografi presisi, dan navigasi riset multidimensi.",
    accentColor: "from-sky-600/30 to-blue-600/20",
    badge: "Research & Systems",
    stack: ["Next.js 16", "Tailwind CSS", "Framer Motion", "Accessible Dark Theme"],
    impactMetrics: [
      { label: "Research Frontiers", value: "5 Domains" },
      { label: "Visual Vibe", value: "Deep Tech Editorial" },
      { label: "Design System", value: "Zero Generic UI" }
    ],
    keySolutions: [
      "Mengintegrasikan transisi antar-bab yang mulus dengan Framer Motion untuk pengalaman membaca buku putih yang imersif.",
      "Membuat sistem kartu riset dengan metrik status interaktif dan navigasi sticky dinamis.",
      "Optimasi aset dan tipografi untuk performa ultra-ringan pada perangkat mobile."
    ],
    link: "/lab"
  }
];

export const FREELANCER_TOOLKIT: ToolkitItem[] = [
  // Find Work
  {
    id: "contra",
    name: "Contra",
    category: "Find Work",
    badge: "Recommended",
    cost: "Free",
    description: "Platform portfolio komisi 0% yang dirancang khusus untuk kreator digital dan product builders.",
    tip: "Sangat cocok untuk menampilkan case study visual dan menagih klien global tanpa potongan komisi sepihak."
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "Find Work",
    badge: "I Use",
    cost: "Free",
    description: "Saluran utama inbound branding dan jaringan koneksi langsung dengan tech founders serta VP Product.",
    tip: "Post breakdown teknis dan hasil karya nyata seminggu 2x untuk menarik direct inquiries."
  },
  {
    id: "x-twitter",
    name: "X (Twitter)",
    category: "Find Work",
    badge: "I Use",
    cost: "Free",
    description: "Tempat build in public, berbagi prototype interaktif, dan terhubung dengan komunitas indie builder dunia.",
    tip: "Gunakan video screen recording pendek berdurasi 30 detik untuk mendemokan fitur yang kamu buat."
  },
  {
    id: "upwork",
    name: "Upwork",
    category: "Find Work",
    badge: "Testing",
    cost: "Freemium",
    description: "Marketplace freelance terbesar untuk menemukan proyek fixed-price bernilai tinggi.",
    tip: "Hanya bid pada job post yang payment-verified dan hindari proyek hourly dengan client micro-management."
  },
  // Build
  {
    id: "cursor",
    name: "Cursor / VS Code",
    category: "Build",
    badge: "I Use",
    cost: "Paid",
    description: "Code editor berbasis AI yang melipatgandakan kecepatan prototyping dan refactoring kode.",
    tip: "Gunakan fitur Composer dan multi-file agentic reasoning untuk mempercepat pembangunan MVP hingga 5x."
  },
  {
    id: "claude-sonnet",
    name: "Claude 3.5 Sonnet",
    category: "Build",
    badge: "Recommended",
    cost: "Paid",
    description: "Model AI penalaran terkuat untuk arsitektur software, logic debugging, dan penulisan teks produk.",
    tip: "Sangat handal dalam menghasilkan komponen Next.js modern yang bersih dari boilerplate yang tidak perlu."
  },
  {
    id: "nextjs",
    name: "Next.js 16",
    category: "Build",
    badge: "I Use",
    cost: "Free",
    description: "Framework React standar industri untuk web application dengan Server Components dan Edge deployment.",
    tip: "Gunakan App Router untuk struktur modular dan performa SSR instan yang disukai search engine."
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Build",
    badge: "I Use",
    cost: "Freemium",
    description: "Backend open-source lengkap dengan PostgreSQL, Autentikasi instan, Storage aset, dan Row Level Security.",
    tip: "Kombinasikan dengan Supabase RLS untuk keamanan data klien tanpa perlu setup server backend rumit."
  },
  {
    id: "figma",
    name: "Figma",
    category: "Build",
    badge: "I Use",
    cost: "Freemium",
    description: "Kanvas desain kolaboratif untuk merancang design tokens, layout wireframe, dan prototype interaktif.",
    tip: "Bangun sistem komponen dengan auto-layout sejak awal agar proses coding ke Tailwind CSS berjalan presisi."
  },
  // Productivity
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    badge: "I Use",
    cost: "Freemium",
    description: "Sistem pusat kendali: Client CRM, Project Kanban, draf konten, dan dokumentasi SOP kerja.",
    tip: "Buat satu halaman client portal bersama yang rapi agar klien bisa melihat progres tanpa harus tanya tiap hari."
  },
  {
    id: "rize",
    name: "Rize",
    category: "Productivity",
    badge: "Testing",
    cost: "Paid",
    description: "Aplikasi pelacak waktu otomatis berbasis AI untuk mengukur deep work dan mencegah kejenuhan (burnout).",
    tip: "Membantu mengetahui secara objektif berapa jam sebenarnya yang dihabiskan untuk coding vs administrasi."
  },
  {
    id: "gcal",
    name: "Google Calendar",
    category: "Productivity",
    badge: "I Use",
    cost: "Free",
    description: "Time-blocking harian untuk memisahkan jam deep-work pagi dan waktu meeting/korespondensi sore.",
    tip: "Jangan pernah biarkan kalender kosong; alokasikan blok waktu 90 menit untuk coding tanpa gangguan ponsel."
  },
  // Business
  {
    id: "wise",
    name: "Wise",
    category: "Business",
    badge: "Recommended",
    cost: "Free",
    description: "Solusi transfer uang internasional dengan kurs pasar riil dan biaya terendah untuk pembayaran dari klien luar negeri.",
    tip: "Gunakan fitur borderless account untuk menerima USD, EUR, atau SGD langsung layaknya akun bank lokal."
  },
  {
    id: "calcom",
    name: "Cal.com",
    category: "Business",
    badge: "Recommended",
    cost: "Free",
    description: "Alat penjadwalan discovery call otomatis yang tersinkronisasi langsung dengan kalender pribadimu.",
    tip: "Sediakan pilihan 15–20 menit untuk discovery call awal dengan kuesioner singkat sebelum meeting."
  },
  {
    id: "freelance-contract",
    name: "Defensible SOW Template",
    category: "Business",
    badge: "I Use",
    cost: "Free",
    description: "Template Scope of Work dan Perjanjian Jasa tertulis yang melindungi hak cipta, revisi, dan termin pembayaran.",
    tip: "Selalu terapkan klausul uang muka (down payment 50%) sebelum baris kode pertama mulai diketik."
  }
];

export const FREELANCE_RESOURCES: FreelanceResource[] = [
  {
    id: "r1",
    title: "Panduan Memulai Freelance dari Nol: From Zero to Remote",
    category: "Starting",
    readTime: "8 min read",
    badge: "Essential Guide",
    summary: "Langkah demi langkah bertransisi dari nol menjadi freelancer remote: memilih spesialisasi tajam, menyusun portofolio defensibel, dan mengatasi sindrom penipu (impostor syndrome).",
    highlights: ["Menentukan single high-value skill", "Membangun 3 bukti karya nyata", "Menyiapkan infrastruktur dasar"],
    link: "/blog"
  },
  {
    id: "r2",
    title: "Cold Outreach Framework: Cara Menghubungi Founders Tanpa Spam",
    category: "Clients",
    readTime: "6 min read",
    badge: "Client Acquisition",
    summary: "Struktur email dan DM singkat yang berfokus memberi nilai instan: bagaimana menemukan bottleneck pada website prospek dan menawarkan solusi konkret.",
    highlights: ["Formula 4 paragraf ramah founder", "Loom audit video 2 menit", "Follow up santai tanpa memaksa"],
    link: "/blog"
  },
  {
    id: "r3",
    title: "Value-Based Pricing: Berhenti Menjual Waktu per Jam",
    category: "Pricing",
    readTime: "7 min read",
    badge: "Finance & Rate",
    summary: "Mengapa hourly rate merugikan freelancer produktif, dan bagaimana bertransisi ke fixed-price milestone berbasis dampak bisnis yang dihasilkan.",
    highlights: ["Formula kalkulasi nilai proyek", "Menentukan buffer risiko scope creep", "Menghilangkan kecemasan menyebut angka"],
    link: "/blog"
  },
  {
    id: "r4",
    title: "AI-Powered Freelancing: Melipatgandakan Output Tanpa Kompromi",
    category: "AI Tools",
    readTime: "10 min read",
    badge: "Velocity & System",
    summary: "Workflow praktis menggunakan Cursor, Claude 3.5, dan script otomatis untuk memangkas waktu pengerjaan web app dari 2 bulan menjadi 2 minggu.",
    highlights: ["Prompting untuk refactoring kode", "Generasi mock data realistis", "Quality assurance otomatis"],
    link: "/lab"
  },
  {
    id: "r5",
    title: "Checklist Kontrak & Invoice Defensibel untuk Freelancer",
    category: "Pricing",
    readTime: "5 min read",
    badge: "Legal Protection",
    summary: "Klausul hukum penting yang wajib ada di setiap kesepakatan: batasan revisi, hak kekayaan intelektual (IP), denda keterlambatan, dan termin pembatalan.",
    highlights: ["Klausul batasan 2 putaran revisi", "Hak retensi source code hingga lunas", "Prosedur change request resmi"],
    link: "/resources"
  },
  {
    id: "r6",
    title: "Work From Anywhere: Sistem Kerja Remote Tanpa Burnout",
    category: "Remote",
    readTime: "6 min read",
    badge: "Lifestyle & Mindset",
    summary: "Membangun batas tegas antara ruang kerja dan kehidupan pribadi saat bekerja dari rumah atau kamar sewaan di berbagai kota.",
    highlights: ["Protokol transisi pagi & sore", "Manajemen baterai mental & mata", "Ergonomis setup portable"],
    link: "/blog"
  }
];

export const REMOTE_LOCATIONS: RemoteLocation[] = [
  {
    id: "bekasi",
    city: "Bekasi",
    country: "Indonesia",
    flag: "🇮🇩",
    status: "current",
    statusLabel: "Current Base",
    vibe: "Home Lab & Deep Focus Station",
    targetTimeline: "Present (2026)",
    notes: "Tempat meletakkan fondasi awal: koneksi internet serat optik stabil, dual monitor workstation, dan waktu hening tanpa distraksi untuk merancang produk berkecepatan tinggi."
  },
  {
    id: "bali",
    city: "Canggu & Ubud, Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    status: "planned",
    statusLabel: "Planned Remote Base",
    vibe: "Coworking, Coastal Air & Global Nomad Energy",
    targetTimeline: "Target Mid 2027",
    notes: "Rencana bulan kerja pertama dari pulau dewata: menguji ritme sprint coding di coworking space terkemuka, lari pagi di pinggir pantai, dan networking dengan digital nomads internasional."
  },
  {
    id: "yogya",
    city: "Yogyakarta",
    country: "Indonesia",
    flag: "🇮🇩",
    status: "planned",
    statusLabel: "Planned Workation",
    vibe: "Creative Scene, Artisan Coffee & Slow Living",
    targetTimeline: "Target Late 2027",
    notes: "Eksplorasi kota budaya untuk fase penulisan draf dan perancangan konsep produk baru sambil menikmati suasana kedai kopi lokal yang hangat dan ramah kreator."
  },
  {
    id: "bangkok",
    city: "Bangkok & Chiang Mai",
    country: "Thailand",
    flag: "🇹🇭",
    status: "someday",
    statusLabel: "Someday Vision",
    vibe: "International Nomad Hub & Street Food Haven",
    targetTimeline: "Future Milestone",
    notes: "Pengalaman pertama bekerja lintas negara: menguji ketahanan sistem asinkron saat berada di zona waktu dan budaya yang berbeda secara mandiri."
  }
];

export const FREELANCE_NOTES: FreelanceNote[] = [
  {
    id: "note-1",
    title: "Kenapa Saya Memilih Jalur Freelance & Remote Builder",
    date: "Sep 2026",
    category: "Filosofi & Pilihan",
    readTime: "5 min",
    excerpt: "Bekerja dari satu tempat yang sama setiap hari bukanlah impianku. Freelance bukan sekadar cara mencari nafkah, melainkan kendaraan menuju kebebasan lokasi dan kedaulatan waktu.",
    slug: "/blog"
  },
  {
    id: "note-2",
    title: "Mencari Klien Pertama: Eksperimen Dari Nol Tanpa Portofolio Mewah",
    date: "Sep 2026",
    category: "Strategi Akuisisi",
    readTime: "7 min",
    excerpt: "Ketika kamu belum punya testimoni, apa yang bisa kamu tawarkan? Jawaban singkat: bukti eksekusi langsung (Proof of Work) yang memecahkan masalah nyata mereka hari ini.",
    slug: "/blog"
  },
  {
    id: "note-3",
    title: "Berapa Sebenarnya Harga Jasa Saya? Membongkar Logika Pricing",
    date: "Sep 2026",
    category: "Finansial & Bisnis",
    readTime: "6 min",
    excerpt: "Bagaimana cara menentukan tarif proyek tanpa merasa bersalah atau terjebak dalam perang harga murah yang menguras energi dan membunuh kreativitas.",
    slug: "/blog"
  },
  {
    id: "note-4",
    title: "Stack AI yang Benar-Benar Mengakselerasi Pengerjaan Web",
    date: "Sep 2026",
    category: "Teknologi & Workflow",
    readTime: "8 min",
    excerpt: "Bukan sekadar prompt ChatGPT sembarangan. Ini adalah cara memadukan Cursor, Claude 3.5 Sonnet, dan arsitektur Next.js untuk hasil kerja tingkat enterprise.",
    slug: "/blog"
  }
];
