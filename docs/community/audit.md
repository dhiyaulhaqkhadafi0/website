# Audit UX / UI / Copy: Halaman Komunitas

Tanggal: 7 September 2026
Status: Selesai (Fase 0)

---

## 1. Stack & Runtime Aktual

- **Framework**: Next.js 16.3.3 (App Router, Turbopack)
- **Runtime Target**: Cloudflare Workers via `@opennextjs/cloudflare` (`open-next.config.ts`, `wrangler.jsonc`)
- **Bahasa**: TypeScript 5
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, `@tailwindcss/typography`)
- **Motion & UI**: `framer-motion` (v13), `lucide-react`
- **Data & Konten**:
  - MDX lokal di `src/content/blog/` melalui `src/lib/mdx.ts`
  - Supabase client di `src/lib/supabase.ts` (Blog Studio private workspace)
- **Typography**:
  - Body: `Plus_Jakarta_Sans` (didefinisikan di `src/app/layout.tsx`)
  - Editorial Headings: `Lora` (Google Fonts, subset latin)

---

## 2. Peta Route & Tautan Komunitas Existing

- **Navbar**: Di `src/components/shared/navbar.tsx` terdapat menu `{ label: "Komunitas", href: "/#komunitas" }`.
- **Halaman Komunitas**: Belum ada route `/komunitas` atau `/community` di dalam `src/app/`. Target anchor `/#komunitas` di `src/app/page.tsx` saat ini belum memiliki elemen target.
- **Rekomendasi Route**:
  - Canonical Route: `/komunitas`
  - Fallback / Redirect: `/community` mengarah ke `/komunitas`
  - Update Navbar: Mengubah `href: "/#komunitas"` menjadi `href: "/komunitas"`.

---

## 3. Sumber Konten & Reuse

- **Catatan Perjalanan**: Menggunakan fungsi helper `getBlogListingPosts()` dari `src/lib/mdx.ts` yang hanya memuat artikel dengan status publik/published (aman dari kebocoran draft Studio).
- **Studi Kasus Internal**: Chikki, Gerakasa, dan HCFTL sebagai studi kasus nyata milik Khadafi dengan label jelas ("Studi Kasus Internal").
- **Auth & Studio Boundary**: Fitur komunitas Fase 1 adalah halaman publik murni tanpa login/session atau akses database, sehingga terisolasi 100% dari Blog Studio (`src/app/studio/`).

---

## 4. Design Tokens & Visual Hierarchy

- **Background Palette**: `#05050A` (canvas utama), `#090A10` (card surface), `#14151B` (elevated container).
- **Border & Glass**: `border-white/10`, `backdrop-blur-xl`, hover glow `border-emerald-500/30`.
- **Aksen**: Emerald (`#34D399`), Indigo (`#818CF8`), Sky (`#38BDF8`).
- **Navigasi Kembali**: Standar tombol kapsul `← Kembali ke Beranda` konsisten dengan `/blog`, `/lab`, dan `/about`.
