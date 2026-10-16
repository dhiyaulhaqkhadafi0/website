import { isPublicDestination } from "@/lib/public-routes";
export interface SubMenuItem {
  label: string;
  href: string;
  description: string;
  isExternal?: boolean;
  badge?: string;
}
export interface NavCategory {
  key: string;
  label: string;
  href: string;
  badge?: string;
  subMenus: SubMenuItem[];
}
const NAV_CATEGORIES: NavCategory[] = [
  {
    key: "produk",
    label: "Produk & Jasa",
    href: "/products",
    subMenus: [
      {
        label: "Semua Koleksi",
        href: "/products",
        description: "Produk original, tools pilihan, dan layanan",
      },
      {
        label: "Produk Digital Khadafi",
        href: "/products/original",
        description: "Ebook dan bekal digital original",
      },
      {
        label: "Rekomendasi Pilihan",
        href: "/products/recommended",
        description: "Tools terkurasi, manfaat dan batas yang jelas",
      },
      {
        label: "Jasa & Kolaborasi",
        href: "/services",
        description: "Website, prototype, dan strategi konten",
      },
    ],
  },
  {
    key: "jasa",
    label: "Jasa",
    href: "/services",
    badge: "Hire Me",
    subMenus: [
      {
        label: "Work With Me & Kapabilitas",
        href: "/services",
        description:
          "Prinsip rekayasa produk AI, arsitektur defensible & eksekusi cepat",
      },
      {
        label: "Mulai Proyek / Konsultasi",
        href: "#inquiry",
        description:
          "Diskusikan ide produk, MVP, atau automasi workflow bersama Khadafi",
        badge: "Direct Contact",
      },
    ],
  },
  {
    key: "freelance",
    label: "Freelance",
    href: "/freelance",
    badge: "Hub",
    subMenus: [
      {
        label: "Freelance Journey Hub",
        href: "/freelance",
        description: "Pusat ekosistem, catatan, dan navigasi karier remote",
      },
      {
        label: "Mulai Freelance dari Nol",
        href: "/freelance/tools/mulai-freelance-dari-nol",
        description: "Panduan flagship langkah awal membangun karier mandiri",
        badge: "Flagship Guide",
      },
      {
        label: "Lowongan Remote",
        href: "/freelance/jobs",
        description: "Lowongan individual, lokasi kandidat & sumber resmi",
      },
      {
        label: "Direktori Platform",
        href: "/freelance/direktori",
        description: "Platform kerja independen & marketplace proyek",
      },
      {
        label: "Tools & Sumber Daya",
        href: "/freelance/tools",
        description: "Panduan, template, kalkulator tarif, dan tools pilihan",
      },
    ],
  },
  {
    key: "resources",
    label: "Sumber Daya",
    href: "/resources",
    subMenus: [
      {
        label: "Semua Sumber Daya",
        href: "/resources",
        description: "Kumpulan sistem kerja, blueprint PRD, dan panduan taktis",
      },
      {
        label: "AI & Prompt Engineering",
        href: "/resources?topic=ai",
        description: "Context engineering primer, prompt pack & eval sheet",
      },
      {
        label: "Product Building",
        href: "/resources?topic=product",
        description: "PRD engine, architecture RFC & MVP readiness checklist",
      },
      {
        label: "Digital Business & Assets",
        href: "/resources?topic=business",
        description: "Positioning canvas, monetisasi independen & unit ekonomi",
      },
      {
        label: "Creator Systems",
        href: "/resources?topic=content",
        description: "Content OS, repurposing engine & alur distribusi",
      },
      {
        label: "The Digital Grimoire (Blog)",
        href: "/blog",
        description: "Esai mendalam seputar AI, produk, dan bisnis digital",
        badge: "Editorial",
      },
    ],
  },
  {
    key: "komunitas",
    label: "Komunitas",
    href: "/komunitas",
    subMenus: [
      {
        label: "Tentang Komunitas",
        href: "/komunitas",
        description:
          "Wadah belajar dan berjejaring builder & kreator Indonesia",
      },
      {
        label: "Gabung Komunitas",
        href: "/komunitas#gabung",
        description: "Akses grup diskusi eksklusif & sharing sesi berkala",
      },
      {
        label: "Event & Sesi Diskusi",
        href: "/komunitas",
        description: "Bedah studi kasus produk, demo AI workflow & tanya jawab",
      },
    ],
  },
  {
    key: "tentang",
    label: "Tentang",
    href: "/about",
    subMenus: [
      {
        label: "Tentang Khadafi",
        href: "/about",
        description:
          "Profil builder, AI-assisted product engineer & etos kerja",
      },
      {
        label: "Perjalanan & Fokus",
        href: "/about#journey",
        description: "Fokus eksplorasi saat ini & roadmap pembangunan produk",
      },
      {
        label: "Sertifikasi & Kredensial",
        href: "/#certifications",
        description: "Validasi profesional dari Google, IBM & institusi global",
      },
      {
        label: "HCFTL Lab",
        href: "/lab",
        description:
          "Human-Centered Future Tech Lab: Riset AI & teknologi masa depan",
        badge: "Eksplorasi",
      },
      {
        label: "Changelog",
        href: "/changelog",
        description: "Catatan pembaruan berkala Khadafi Business OS",
      },
    ],
  },
];
export const PUBLIC_NAV_CATEGORIES: NavCategory[] = [
  ...NAV_CATEGORIES.filter((c) =>
    ["produk", "freelance", "resources"].includes(c.key),
  ),
  {
    key: "artikel",
    label: "Artikel",
    href: "/blog",
    subMenus: [
      {
        label: "The Digital Grimoire",
        href: "/blog",
        description: "Catatan AI, produk, dan bisnis digital",
      },
    ],
  },
  ...NAV_CATEGORIES.filter((c) => c.key === "tentang"),
];
export const PUBLIC_FOOTER_GROUPS = [
  {
    title: "Jelajahi",
    links: [
      {
        label: "Produk Digital",
        href: "/products",
        desc: "Bekal untuk langkah berikutnya",
      },
      {
        label: "Jasa & Kemampuan",
        href: "/services",
        desc: "Engineering & konsultasi",
      },
    ],
  },
  {
    title: "Belajar",
    links: [
      {
        label: "Sumber Daya",
        href: "/resources",
        desc: "Blueprint & sistem kerja",
      },
      {
        label: "Artikel",
        href: "/blog",
        desc: "Esai AI & product building",
      },
      {
        label: "Panduan Freelance",
        href: "/freelance/tools/mulai-freelance-dari-nol",
        desc: "Mulai freelance dari nol",
      },
    ],
  },
  {
    title: "Terhubung",
    links: [
      {
        label: "Freelance Hub",
        href: "/freelance",
        desc: "Navigasi karier remote",
      },
      {
        label: "Komunitas",
        href: "/komunitas",
        desc: "Wadah builder & kreator",
      },
      {
        label: "Tentang Khadafi",
        href: "/about",
        desc: "Profil & perjalanan berkarya",
      },
      {
        label: "HCFTL Lab",
        href: "/lab",
        desc: "Eksplorasi teknologi manusia",
      },
    ],
  },
];
for (const link of [
  ...PUBLIC_NAV_CATEGORIES.flatMap((c) => [c, ...c.subMenus]),
  ...PUBLIC_FOOTER_GROUPS.flatMap((g) => g.links),
]) {
  if (!isPublicDestination(link.href))
    throw new Error("Non-public navigation destination: " + link.href);
}
