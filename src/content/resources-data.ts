import {
  ResourceItem,
  ResourceTopic,
  SignatureSystemPillar,
  IntentPath,
} from "@/lib/resource-types";

export const SIGNATURE_SYSTEMS: SignatureSystemPillar[] = [
  {
    id: "product-system",
    num: "01",
    name: "Product System",
    tagline: "Problem → Validation → PRD → Prototype → Test → Ship",
    flow: ["Problem", "Validation", "PRD Engine", "AI Build", "Ship"],
    description:
      "Metodologi end-to-end merumuskan ide kabur menjadi software production-ready dengan memanfaatkan AI sebagai copilot arsitektur dan eksekusi.",
    keyOutputs: ["PRD 1-Pager", "Architecture RFC", "MVP Scope Matrix", "Launch Checklist"],
    primaryResourceSlug: "ai-product-blueprint",
    accent: "from-sky-500/20 via-blue-500/10 to-transparent",
  },
  {
    id: "creator-system",
    num: "02",
    name: "Creator System",
    tagline: "Idea → Research → Systemize → Publish → Repurpose",
    flow: ["Idea Spark", "Deep Research", "Synthesize", "Multi-Publish", "Asset Vault"],
    description:
      "Sistem produksi pemikiran dan konten digital tanpa burnout: mengubah satu esai mendalam menjadi puluhan format mikro secara terstruktur.",
    keyOutputs: ["Content OS", "Hook & Frame Vault", "Repurposing Engine", "Audience Loop"],
    primaryResourceSlug: "ai-content-operating-system",
    accent: "from-indigo-500/20 via-purple-500/10 to-transparent",
  },
  {
    id: "ai-work-system",
    num: "03",
    name: "AI Work System",
    tagline: "Context → Prompt Architecture → Agentic Flow → Verify → Scale",
    flow: ["Context Priming", "Prompt Blueprint", "Agent Pipeline", "Verification", "Automation"],
    description:
      "Fondasi context engineering dan prompt presisi untuk memprogram LLM bertindak layaknya staf ahli spesialis, bukan generator teks generik.",
    keyOutputs: ["High-Context Prompts", "Eval Metric Sheet", "Agent Custom Rules", "Skill Recipes"],
    primaryResourceSlug: "high-context-prompts-pack",
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "business-system",
    num: "04",
    name: "Business System",
    tagline: "Audience → Irresistible Value → Digital Product → Distribution → Scale",
    flow: ["Audience Trust", "Free Value Vault", "Paid Ecosystem", "Direct Channel", "Flywheel"],
    description:
      "Kerangka monetisasi keahlian independen menjadi produk digital defensibel yang memiliki margin tinggi dan retensi berkelanjutan.",
    keyOutputs: ["Positioning Canvas", "Pricing Matrix", "Funnel Architecture", "Offer Playbook"],
    primaryResourceSlug: "creator-to-founder-framework",
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
];

export const INTENT_PATHS: IntentPath[] = [
  {
    id: "build-ai-product",
    label: "Bangun Produk dengan AI",
    topic: "product",
    description: "Dari ide abstrak menjadi PRD dan MVP yang siap diluncurkan.",
    iconName: "Rocket",
    highlightResourceSlug: "ai-product-blueprint",
  },
  {
    id: "learn-vibe-coding",
    label: "Kuasai Vibe Coding",
    topic: "vibe-coding",
    description: "Kembangkan software modern dengan AI tanpa terjebak syntax hell.",
    iconName: "Terminal",
    highlightResourceSlug: "vibe-coding-field-guide",
  },
  {
    id: "create-content-system",
    label: "Sistem Konten & Distribusi",
    topic: "content",
    description: "Bangun mesin konten terstruktur dari satu ide mendalam.",
    iconName: "PenTool",
    highlightResourceSlug: "ai-content-operating-system",
  },
  {
    id: "personal-brand-authority",
    label: "Personal Brand & Niche",
    topic: "business",
    description: "Definisikan positioning yang defensibel dan bangun authority digital.",
    iconName: "ShieldCheck",
    highlightResourceSlug: "personal-brand-positioning-canvas",
  },
];

export const RESOURCES_DATA: ResourceItem[] = [
  {
    id: "res-01",
    slug: "ai-product-blueprint",
    title: "AI Product Blueprint & PRD Engine",
    tagline: "Framework terstruktur mengubah ide abstrak menjadi produk digital siap bangun bersama AI.",
    description:
      "Dokumen spesifikasi produk (PRD) yang dirancang khusus untuk era generative AI dan vibe coding. Dilengkapi dengan batasan konteks, pemetaan use case pengguna, kriteria penerimaan (acceptance criteria), dan pembagian fase rilis MVP yang ketat.",
    type: "template",
    topic: "product",
    accessLevel: "direct-access",
    readTimeOrEffort: "15 min apply",
    featured: true,
    badge: "Signature System",
    accentGlow: "rgba(56, 189, 248, 0.25)",
    whatYouGet: [
      "Notion PRD Master Template versi AI-native",
      "Format context priming untuk coding agent (Claude, Cursor, Copilot)",
      "Feature Prioritization Matrix (Must, Should, Won't)",
      "Blueprint arsitektur data & schema checklist",
      "Struktur prompt untuk meng-generate test scenario",
    ],
    bestFor: ["Product Builder", "Founder / Solopreneur", "Vibe Coder", "Indie Hacker"],
    howKhadafiUsesThis:
      "Saya menggunakan template ini sebelum membuka IDE atau menulis baris kode pertama. Menghabiskan 20 menit menyusun blueprint ini terbukti menghemat 20+ jam debugging dan mencegah 'context drift' saat berkolaborasi dengan AI coding agent.",
    stats: {
      usersOrDownloads: "1.2k+ builders",
      version: "v2.4",
      lastUpdated: "September 2026",
    },
    actionLabel: "Buka Notion Blueprint",
    actionUrl: "https://notion.so",
    updatedAt: "2026-09-01",
    relatedResourcesSlugs: ["vibe-coding-field-guide", "mvp-readiness-checklist"],
    previewContent: {
      type: "framework-steps",
      summaryTitle: "Tahapan PRD Engine",
      frameworkSteps: [
        {
          step: "01",
          name: "Problem Space Isolation",
          description: "Mendefinisikan rasa sakit nyata pengguna dan menghapus fitur artifisial yang tidak esensial.",
          deliverable: "1-Sentence Core Problem & Negative Scope",
        },
        {
          step: "02",
          name: "User Story & AI Capability Map",
          description: "Memetakan logika bisnis deterministik vs mana yang dieksekusi oleh LLM / AI inference.",
          deliverable: "Capability Division & Latency Expectations",
        },
        {
          step: "03",
          name: "Context Architecture for Agents",
          description: "Menyiapkan prompt briefing arsitektural yang dibaca oleh IDE agent agar tidak halusinasi stack.",
          deliverable: "System Prompt Context Primer",
        },
        {
          step: "04",
          name: "Milestone & Verification Gate",
          description: "Rencana rilis MVP 3-hari dengan verifikasi fungsionalitas kritis tanpa over-engineering.",
          deliverable: "Pass/Fail Acceptance Criteria Matrix",
        },
      ],
    },
  },
  {
    id: "res-02",
    slug: "vibe-coding-field-guide",
    title: "Vibe Coding Field Guide & Mental Models",
    tagline: "Panduan taktis membangun software produksi dengan AI tanpa terjebak syntax hell dan dependency spiral.",
    description:
      "Vibe coding bukan berarti mengetik asal dan berharap AI menebak segalanya. Ini adalah panduan mengarahkan AI agent, membaca arsitektur kode di level tinggi, menjaga git hygiene, dan merefaktor basis kode secara bertahap dan aman.",
    type: "playbook",
    topic: "vibe-coding",
    accessLevel: "open",
    readTimeOrEffort: "12 min read",
    featured: true,
    badge: "Most Popular",
    accentGlow: "rgba(99, 102, 241, 0.25)",
    whatYouGet: [
      "7 Aturan Emas berinteraksi dengan AI Coding Assistants",
      "Struktur repo anti-halusinasi (AGENTS.md & context injection)",
      "Strategi recovery saat AI merusak codebase (rollback & diff discipline)",
      "Teknik dekomposisi fitur kompleks menjadi instruksi atomic",
      "Daftar perintah CLI esensial untuk inspeksi kode instan",
    ],
    bestFor: ["Software Engineer", "Non-technical Founder", "Creative Technologist", "Product Designer"],
    howKhadafiUsesThis:
      "Panduan ini dirumuskan dari ribuan jam interaksi langsung dengan LLM di puluhan proyek software nyata. Ini adalah kompas kerja saya saat membangun aplikasi full-stack hanya dalam hitungan hari.",
    stats: {
      usersOrDownloads: "2.8k+ readers",
      version: "v3.1",
      lastUpdated: "Agustus 2026",
    },
    actionLabel: "Baca Playbook Lengkap",
    updatedAt: "2026-08-28",
    relatedResourcesSlugs: ["ai-product-blueprint", "high-context-prompts-pack"],
    previewContent: {
      type: "markdown",
      markdownContent: `
### Ringkasan 7 Prinsip Vibe Coding Presisi:
1. **Never let the AI guess your stack** — Berikan batasan teknologi eksplisit di \`AGENTS.md\` atau prompt header.
2. **One atomic change at a time** — Jangan meminta AI membuat sistem auth, pembayaran, dan UI sekaligus dalam satu prompt.
3. **Inspect the diff, not just the preview** — Selalu review \`git diff\` untuk memastikan tidak ada import diam-diam yang merusak bundle.
4. **Decouple data from presentation** — Minta AI mendefinisikan interface/schema TypeScript terlebih dahulu sebelum komponen JSX.
5. **Use automated verification early** — Buat \`tsc --noEmit\` dan unit test berjalan cepat agar AI bisa memperbaiki kesalahannya sendiri.
6. **Guard the context window** — Hindari menjejali ribuan baris log; berikan hanya kutipan error yang relevan.
7. **Know when to take the wheel** — Jika AI berputar-putar dalam loop error 3 kali berturut-turut, reset instruksi dan sederhanakan pendekatannya.
      `,
    },
  },
  {
    id: "res-03",
    slug: "high-context-prompts-pack",
    title: "High-Context Prompts Pack (24 Curated Prompts)",
    tagline: "Koleksi prompt sistem teruji untuk riset produk, context engineering, arsitektur data, dan copywriting.",
    description:
      "Bukan prompt receh 'tuliskan saya artikel'. Kumpulan 24 prompt berstruktur tinggi yang menyertakan persona, batasan negatif (what NOT to do), format output terstruktur (JSON/Markdown), dan rantai logika beberapa langkah (step-by-step chain).",
    type: "prompt-pack",
    topic: "ai",
    accessLevel: "open",
    readTimeOrEffort: "Instant Copy",
    featured: true,
    badge: "Essential Toolkit",
    accentGlow: "rgba(52, 211, 153, 0.25)",
    whatYouGet: [
      "8 Prompt Riset & Validasi Ide Pasar",
      "6 Prompt Arsitektur Produk & Evaluasi PRD",
      "5 Prompt Code Review & Bug Isolation",
      "5 Prompt Editorial Framing & Content Repurposing",
      "Panduan mengisi placeholder konteks secara presisi",
    ],
    bestFor: ["AI Power User", "Product Manager", "Content Strategist", "Researcher"],
    howKhadafiUsesThis:
      "Tersimpan di snippet manager saya dan dipakai harian. Format constraint dan few-shot examples di dalamnya menghilangkan 90% waktu bolak-balik merevisi jawaban LLM.",
    stats: {
      usersOrDownloads: "3.4k+ copies",
      version: "v2.0",
      lastUpdated: "September 2026",
    },
    actionLabel: "Buka & Salin Prompt",
    updatedAt: "2026-09-02",
    relatedResourcesSlugs: ["ai-product-blueprint", "ai-content-operating-system"],
    previewContent: {
      type: "prompt-pack",
      summaryTitle: "Contoh Prompt Unggulan dalam Paket Ini",
      promptItems: [
        {
          id: "prompt-01",
          title: "PRD Reality-Check & Stress Tester",
          targetRoleOrTask: "Product Architecture & Risk Audit",
          variables: ["[DESKRIPSI_PRODUK]", "[TARGET_USER]", "[TECH_STACK]"],
          promptText:
            "Bertindaklah sebagai Principal Product Architect dan Skeptical Technical Auditor dengan pengalaman 15 tahun. Tinjau rencana produk berikut:\n\n[DESKRIPSI_PRODUK]\nTarget Audiens: [TARGET_USER]\nStack: [TECH_STACK]\n\nTugasmu: Jangan memuji ide ini. Berikan audit brutal dalam 4 bagian:\n1. 3 celah asumsi fatal yang paling sering membunuh produk di fase ini.\n2. Scope creep tersembunyi yang berisiko memperlambat peluncuran.\n3. Pertanyaan paling sulit yang akan diajukan oleh pengguna pertama.\n4. Rencana pemangkasan fitur: apa 50% fitur yang harus dibuang agar MVP bisa live dalam 5 hari?\nFormat jawaban dalam markdown terstruktur tanpa basa-basi.",
        },
        {
          id: "prompt-02",
          title: "Editorial Story Hook & Angle Deconstructor",
          targetRoleOrTask: "High-Authority Content Framing",
          variables: ["[TOPIK_UTAMA]", "[AUDIENS_IDEAL]", "[KEY_INSIGHT]"],
          promptText:
            "Kamu adalah Senior Editorial Director untuk publikasi teknologi premium. Saya memiliki insight mentah berikut:\n[KEY_INSIGHT] mengenai topik [TOPIK_UTAMA] untuk audiens [AUDIENS_IDEAL].\n\nBantu saya merekonstruksi insight ini menjadi 3 sudut pandang (angles) berbeda:\n1. The Contrarian Angle: Membongkar mitos umum yang dipercaya banyak orang di industri ini.\n2. The System Angle: Menjelaskan masalah ini sebagai kegagalan sistemik, bukan kesalahan individu.\n3. The Tactical Playbook: Step-by-step implementasi praktis yang bisa langsung dicoba hari ini.\nUntuk setiap sudut pandang, berikan 1 headline provokatif, pembuka 2 kalimat, dan outline 3 poin utama.",
        },
      ],
    },
  },
  {
    id: "res-04",
    slug: "ai-content-operating-system",
    title: "AI Content Operating System (Content OS)",
    tagline: "Sistem kerja end-to-end mengubah 1 ide sentral menjadi puluhan aset distribusi tanpa burnout.",
    description:
      "Kerangka kerja komprehensif bagi kreator solopreneur dan profesional untuk mengubah riset lapangan atau esai mendalam menjadi alur distribusi multi-platform (Blog, X/Twitter, LinkedIn, Newsletter, dan Micro-clips) secara sistematis.",
    type: "template",
    topic: "content",
    accessLevel: "direct-access",
    readTimeOrEffort: "20 min setup",
    featured: false,
    badge: "Field-Tested",
    accentGlow: "rgba(168, 85, 247, 0.25)",
    whatYouGet: [
      "Notion Content Dashboard (Ideation to Distribution pipeline)",
      "Matrix Repurposing: 1 Longform Essay → 5 Short Posts → 1 Thread",
      "SOP Riset Cepat dengan AI Research Assistant",
      "Kalender Editorial berbasis Batching & Systems",
      "Formula penulisan pembuka (hook) tanpa clickbait murahan",
    ],
    bestFor: ["Content Creator", "Founders Building in Public", "Freelancer", "Thought Leader"],
    howKhadafiUsesThis:
      "Sistem ini adalah tulang punggung di balik publikasi konsisten saya di blog pribadi dan media sosial. Menjaga fokus tetap pada substansi pemikiran tanpa terbebani rutinitas teknis distribusi.",
    stats: {
      usersOrDownloads: "1.9k+ users",
      version: "v2.1",
      lastUpdated: "Juli 2026",
    },
    actionLabel: "Gunakan Template Notion",
    actionUrl: "https://notion.so",
    updatedAt: "2026-07-15",
    relatedResourcesSlugs: ["high-context-prompts-pack", "personal-brand-positioning-canvas"],
    previewContent: {
      type: "checklist",
      summaryTitle: "Alur Pipeline Content OS",
      checklistItems: [
        {
          id: "cos-1",
          category: "Fase 1: Capture & Seed",
          title: "Tangkap Raw Spark",
          description: "Catat setiap ide atau temuan eksperimen ke dalam Inbox tanpa perlu menyusun rapi seketika.",
        },
        {
          id: "cos-2",
          category: "Fase 2: Synthesis",
          title: "Uji Kedalaman Argumen",
          description: "Gunakan AI untuk mencari kelemahan tesis tulisan dan menyusun data pendukung yang valid.",
        },
        {
          id: "cos-3",
          category: "Fase 3: Pillar Crafting",
          title: "Tulis Esai Fondasi (Pillar Content)",
          description: "Selesaikan 1 artikel panjang 1,200+ kata dengan gaya editorial yang khas dan bernas.",
        },
        {
          id: "cos-4",
          category: "Fase 4: Multi-Channel Splitting",
          title: "Dekomposisi Menjadi Micro-Assets",
          description: "Ekstrak 3 kutipan kunci, 1 alur visual diagram, dan 1 ringkasan takeaways untuk media sosial.",
        },
      ],
    },
  },
  {
    id: "res-05",
    slug: "mvp-readiness-checklist",
    title: "MVP Readiness Checklist (32 Poin Kritis)",
    tagline: "Daftar periksa komprehensif sebelum meluncurkan produk digital atau SaaS pertama ke audiens.",
    description:
      "Mencegah momen memalukan di hari peluncuran. Checklist 32 poin mencakup keamanan auth, error handling, mobile responsiveness, tracking analitik, integrasi pembayaran, open graph meta tags, dan kesiapan load data.",
    type: "checklist",
    topic: "product",
    accessLevel: "open",
    readTimeOrEffort: "10 min audit",
    featured: false,
    badge: "Interactive Tool",
    accentGlow: "rgba(245, 158, 11, 0.25)",
    whatYouGet: [
      "Checklist interaktif yang bisa dicentang langsung di browser",
      "Kategori Keamanan & Autentikasi (RLS, API Keys, Environment variables)",
      "Kategori UX & Performance (Core Web Vitals, Responsive Safe Area)",
      "Kategori SEO & Metadata (OG images, sitemap, canonical links)",
      "Exportable summary status kesiapan MVP",
    ],
    bestFor: ["Indie Developer", "Product Manager", "Early-Stage Startup", "Solo Builder"],
    howKhadafiUsesThis:
      "Setiap kali saya menyelesaikan build baru, checklist ini wajib dipenuhi 100% sebelum domain produksi diarahkan ke traffic publik.",
    stats: {
      usersOrDownloads: "2.1k+ audits",
      version: "v1.8",
      lastUpdated: "September 2026",
    },
    actionLabel: "Buka Checklist Interaktif",
    updatedAt: "2026-09-04",
    relatedResourcesSlugs: ["ai-product-blueprint", "vibe-coding-field-guide"],
    previewContent: {
      type: "checklist",
      summaryTitle: "Pratinjau Poin Kritis Peluncuran",
      checklistItems: [
        {
          id: "mvp-1",
          category: "Security & Keys",
          title: "Zero Private Keys in Bundle",
          description: "Pastikan service role key atau database secret tidak bocor ke sisi client (browser bundle).",
        },
        {
          id: "mvp-2",
          category: "Database & RLS",
          title: "Row Level Security (RLS) Verified",
          description: "Setiap tabel Supabase memiliki kebijakan RLS aktif sehingga user tidak bisa mengintip data orang lain.",
        },
        {
          id: "mvp-3",
          category: "SEO & Social Sharing",
          title: "Dynamic OpenGraph Card Tested",
          description: "URL terlihat rapi dan memiliki visual cover saat dibagikan di WhatsApp, X, atau Telegram.",
        },
        {
          id: "mvp-4",
          category: "Performance",
          title: "Lighthouse Performance > 90 on Mobile",
          description: "Waktu muat awal di bawah 1.5 detik dengan optimasi gambar dan dynamic import tepat.",
        },
      ],
    },
  },
  {
    id: "res-06",
    slug: "creator-to-founder-framework",
    title: "Creator-to-Founder Transition Framework",
    tagline: "Peta jalan bertahap beralih dari sekadar mengejar views menjadi pemilik produk dan aset digital mandiri.",
    description:
      "Kerangka berpikir strategis bagi konten kreator dan pekerja lepas untuk melangkah naik di rantai nilai: dari 'jasa per jam' menuju 'produk terstandardisasi', dan akhirnya 'software / ekosistem digital'.",
    type: "framework",
    topic: "business",
    accessLevel: "open",
    readTimeOrEffort: "15 min read",
    featured: false,
    badge: "Strategic Playbook",
    accentGlow: "rgba(236, 72, 153, 0.25)",
    whatYouGet: [
      "4 Tahap Evolusi: Freelancer → Curator → Product Creator → Ecosystem Founder",
      "Formula menemukan Unfair Advantage pribadi",
      "Kriteria produk digital pertama yang minim risiko namun bernilai tinggi",
      "Strategi distribusi organik tanpa budget iklan besar",
      "Panduan menentukan harga berbasis value, bukan jam kerja",
    ],
    bestFor: ["Freelancer", "Kreator Konten", "Konsultan Independen", "Tech Professional"],
    howKhadafiUsesThis:
      "Ini adalah kerangka kompas yang memandu transisi karir saya sendiri selama 4 tahun terakhir: membangun aset yang terus bekerja bahkan saat saya sedang offline.",
    stats: {
      usersOrDownloads: "1.5k+ founders",
      version: "v1.4",
      lastUpdated: "Agustus 2026",
    },
    actionLabel: "Pelajari Framework",
    updatedAt: "2026-08-20",
    relatedResourcesSlugs: ["personal-brand-positioning-canvas", "ai-content-operating-system"],
    previewContent: {
      type: "framework-steps",
      summaryTitle: "4 Fase Evolusi Menuju Pemilik Aset",
      frameworkSteps: [
        {
          step: "Fase 1",
          name: "Direct Skill Monetization",
          description: "Menjual keahlian teknis atau kreatif langsung untuk membangun reputasi dan pemahaman pasar.",
          deliverable: "High-Trust Client Portfolio & Cash Flow",
        },
        {
          step: "Fase 2",
          name: "SOP & Tool Packaging",
          description: "Mendokumentasikan cara kerja menjadi template atau checklist yang bisa dipakai orang lain.",
          deliverable: "1st Digital Asset (Notion/Code Template)",
        },
        {
          step: "Fase 3",
          name: "Productized Service & Cohort",
          description: "Menjual hasil akhir yang terdefinisi jelas dengan durasi dan output pasti.",
          deliverable: "Recurring Inbound Engine",
        },
        {
          step: "Fase 4",
          name: "Proprietary Software & Ecosystem",
          description: "Membangun platform atau software berbasis kebutuhan audiens yang sudah terverifikasi.",
          deliverable: "Autonomous Defensible IP",
        },
      ],
    },
  },
  {
    id: "res-07",
    slug: "ai-assisted-research-workflow",
    title: "AI-Assisted Research & Synthesis Workflow",
    tagline: "Metode mengekstrak wawasan dari ratusan halaman dokumen, paper riset, dan analisis kompetitor dalam hitungan menit.",
    description:
      "Alur kerja riset mendalam menggabungkan web scraper, semantic search, dan prompt bertingkat. Dirancang agar kamu tidak hanya mendapatkan ringkasan dangkal, melainkan sintesis komparatif yang menemukan pola-pola tersembunyi.",
    type: "playbook",
    topic: "ai",
    accessLevel: "open",
    readTimeOrEffort: "10 min read",
    featured: false,
    badge: "Research Tool",
    accentGlow: "rgba(14, 165, 233, 0.25)",
    whatYouGet: [
      "Pipeline 3-langkah ekstraksi paper teknis dan laporan industri",
      "Struktur prompt untuk perbandingan multi-dokumen (Cross-Synthesis)",
      "Cara menghindari bias konfirmasi saat riset pasar dengan AI",
      "Template catatan riset Markdown yang ramah PKM (Obsidian/Notion)",
    ],
    bestFor: ["Product Strategist", "Researcher", "Tech Writer", "Investment Analyst"],
    howKhadafiUsesThis:
      "Saya menggunakan metode ini saat memetakan frontier teknologi di HCFTL (Human-Centered Frontier Technology Lab) dan meriset arsitektur baru.",
    stats: {
      usersOrDownloads: "980+ researchers",
      version: "v1.2",
      lastUpdated: "Agustus 2026",
    },
    actionLabel: "Pelajari Workflow Riset",
    updatedAt: "2026-08-10",
    relatedResourcesSlugs: ["high-context-prompts-pack", "vibe-coding-field-guide"],
  },
  {
    id: "res-08",
    slug: "personal-brand-positioning-canvas",
    title: "Personal Brand Positioning Canvas",
    tagline: "Lembar kerja 1 halaman untuk menemukan sudut pandang defensibel dan positioning otoritas di era AI.",
    description:
      "Ketika AI bisa menghasilkan konten generik dalam hitungan detik, diferensiasi personal brand tidak lagi datang dari 'volume postingan', melainkan dari sudut pandang (POV), standar selera (taste), dan rekam jejak eksekusi nyata.",
    type: "framework",
    topic: "career",
    accessLevel: "direct-access",
    readTimeOrEffort: "15 min exercise",
    featured: false,
    badge: "Self-Audit",
    accentGlow: "rgba(139, 92, 246, 0.25)",
    whatYouGet: [
      "Canvas 1-Halaman pemetaan 3 pilar: Skill Stack, POV Unik, Proof of Work",
      "Latihan mengidentifikasi 'The 1 Thing' yang kamu tahu benar namun diabaikan orang lain",
      "Audit bio dan profil sosial media yang profesional dan berwibawa",
      "Panduan menentukan topik inti (3 Bucket Konten)",
    ],
    bestFor: ["Digital Builder", "Software Engineer", "Freelancer", "Kreator Konten"],
    howKhadafiUsesThis:
      "Canvas ini saya evaluasi setiap 6 bulan untuk memastikan positioning saya tetap relevan di tengah pergeseran cepat teknologi AI.",
    stats: {
      usersOrDownloads: "1.4k+ builders",
      version: "v1.5",
      lastUpdated: "September 2026",
    },
    actionLabel: "Buka Positioning Canvas",
    actionUrl: "https://notion.so",
    updatedAt: "2026-09-03",
    relatedResourcesSlugs: ["creator-to-founder-framework", "ai-content-operating-system"],
  },
];

export const TOPIC_FILTERS: { value: ResourceTopic; label: string }[] = [
  { value: "all", label: "Semua Topik" },
  { value: "ai", label: "AI & LLMs" },
  { value: "product", label: "Product & PRD" },
  { value: "vibe-coding", label: "Vibe Coding" },
  { value: "content", label: "Content System" },
  { value: "business", label: "Business & Assets" },
  { value: "career", label: "Career & Brand" },
];

export const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Semua Format" },
  { value: "template", label: "Template" },
  { value: "playbook", label: "Playbook" },
  { value: "framework", label: "Framework" },
  { value: "prompt-pack", label: "Prompt Pack" },
  { value: "checklist", label: "Checklist" },
];
