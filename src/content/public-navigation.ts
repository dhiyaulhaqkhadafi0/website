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
export const PUBLIC_NAV_CATEGORIES: NavCategory[] = [
  {
    key: "produk",
    label: "Produk",
    href: "/#produk",
    badge: "Ventures",
    subMenus: [
      {
        label: "Produk Digital",
        href: "/resources?topic=product",
        description: "Blueprint PRD, arsitektur software & template sistem",
      },
      {
        label: "Buku & Panduan",
        href: "/resources",
        description: "Playbook, mental models & panduan taktis builder",
      },
    ],
  },
  {
    key: "jasa",
    label: "Jasa",
    href: "/about#jasa",
    badge: "Hire Me",
    subMenus: [
      {
        label: "Work With Me & Kapabilitas",
        href: "/about#jasa",
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
        href: "/freelance/belajar/mulai-freelance",
        description: "Panduan flagship langkah awal membangun karier mandiri",
        badge: "Flagship Guide",
      },
      {
        label: "Peluang Remote Jobs",
        href: "/freelance/direktori?type=Remote+Job+Board",
        description: "Kurasi job board & papan lowongan internasional",
      },
      {
        label: "Direktori Platform",
        href: "/freelance/direktori",
        description: "Platform kerja independen & marketplace proyek",
      },
      {
        label: "Tools & Sumber Daya",
        href: "/freelance/cari",
        description: "Pencarian terpadu tools, panduan, dan direktori",
      },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    href: "/resources",
    subMenus: [
      {
        label: "Semua Resources",
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
        label: "Journey / Now",
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
        badge: "Research Lab",
      },
      {
        label: "Changelog",
        href: "/changelog",
        description: "Catatan pembaruan berkala Khadafi Business OS",
      },
    ],
  },
];
export const PUBLIC_FOOTER_GROUPS = [
  {
    title: "Build",
    links: [
      { label: "Products", href: "/#produk", desc: "Aplikasi & aset digital" },
      {
        label: "Services",
        href: "/about#jasa",
        desc: "Engineering & konsultasi",
      },
    ],
  },
  {
    title: "Learn",
    links: [
      {
        label: "Resources",
        href: "/resources",
        desc: "Blueprint & sistem kerja",
      },
      {
        label: "The Digital Grimoire",
        href: "/blog",
        desc: "Esai AI & product building",
      },
      {
        label: "Guides",
        href: "/freelance/belajar/mulai-freelance",
        desc: "Mulai freelance dari nol",
      },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      {
        label: "Freelance Hub",
        href: "/freelance",
        desc: "Navigasi karier remote",
      },
      {
        label: "Community",
        href: "/komunitas",
        desc: "Wadah builder & kreator",
      },
    ],
  },
  {
    title: "Khadafi",
    links: [
      {
        label: "About Khadafi",
        href: "/about",
        desc: "Profil & filosofi builder",
      },
      { label: "HCFTL Lab", href: "/lab", desc: "Human-Centered Tech Lab" },
      {
        label: "Changelog",
        href: "/changelog",
        desc: "Catatan pembaruan sistem",
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
