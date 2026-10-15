import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publishedProducts } from "@/lib/commerce-server";
import { ProductCatalog } from "@/components/commerce/ProductCatalog";
import { BookCover } from "@/components/commerce/BookCover";
import s from "@/components/commerce/commerce.module.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Produk digital untuk langkah berikutnya",
  description:
    "Ebook, panduan, dan bekal digital dari Daffa Khadafi untuk builder, freelancer, dan kreator independen.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Produk digital — Khadafi",
    description: "Ide yang bagus. Bekal yang nyata.",
    url: "/products",
    images: [
      {
        url: "/products/formula-profitable-blueprint-cover.webp",
        alt: "Formula Profitable Blueprint — Daffa Khadafi",
      },
    ],
  },
};
export default async function ProductsPage() {
  const products = await publishedProducts();
  const featured = products.find((p) => p.featured) || products[0];
  return (
    <>
      <section className={s.hero}>
        <div className={s.heroGrid}>
          <div>
            <span className={s.eyebrow}>KHADAFI / DIGITAL PRODUCT STORE</span>
            <h1>
              Ide yang bagus.
              <br />
              Bekal yang <em>nyata.</em>
            </h1>
            <p className={s.lead}>
              Ebook, panduan, dan alat bantu yang aku buat untuk menemani kamu
              bekerja, berkarya, dan membangun sesuatu yang berarti.
            </p>
            <div className={s.actions}>
              <a href="#koleksi" className={s.button}>
                Jelajahi koleksi <ArrowUpRight aria-hidden="true" />
              </a>
              <Link href="/resources" className={s.secondary}>
                Mulai dari yang gratis
              </Link>
            </div>
            <div className={s.meta}>
              <span className={s.dot} />
              <span>FOR BUILDERS, FREELANCERS & CREATORS</span>
            </div>
          </div>
          <BookCover
            name={featured?.name || "Formula Profitable Blueprint"}
            cover={featured ? featured.cover_url : "/products/formula-profitable-blueprint-cover.webp"}
            label={featured ? "Pilihan utama" : "Sedang disiapkan"}
          />
        </div>
      </section>
      <div className={s.principles}>
        <div>
          <strong>01 / Dibuat dengan perhatian</strong>
          <p>Berangkat dari proses belajar dan membangun.</p>
        </div>
        <div>
          <strong>02 / Digital, mudah dibawa</strong>
          <p>Bekal yang bisa kamu buka di perangkatmu.</p>
        </div>
        <div>
          <strong>03 / Satu tempat untuk aksesmu</strong>
          <p>Produk yang kamu miliki tersimpan di library.</p>
        </div>
      </div>
      {featured && (
        <section className={s.section}>
          <div className={s.feature}>
            <div>
              <span className={s.eyebrow}>IN FOCUS / {featured.category}</span>
              <h2>{featured.name}</h2>
              <p className={s.lead}>{featured.short_description}</p>
              <div className={s.actions}>
                <Link href={"/products/" + featured.slug} className={s.button}>
                  Kenali produknya <ArrowUpRight />
                </Link>
                <strong>
                  {featured.price === 0
                    ? "Gratis"
                    : new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(featured.price)}
                </strong>
              </div>
            </div>
            <p className={s.prose}>{featured.description.slice(0, 500)}</p>
          </div>
        </section>
      )}
      <ProductCatalog products={products} />
      <section
        className={s.section}
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <div className={s.feature}>
          <div>
            <span className={s.eyebrow}>A NOTE FROM THE CREATOR</span>
            <h2>
              Bukan sekadar dikoleksi.
              <br />
              <em>Untuk dipakai.</em>
            </h2>
          </div>
          <div>
            <p className={s.lead} style={{ marginTop: 0 }}>
              Aku percaya ide menjadi berharga ketika kita mulai mengerjakannya.
              Ruang ini adalah tempat untuk membagikan bekal yang aku susun
              sepanjang perjalanan sebagai builder independen.
            </p>
            <p className={s.note}>
              Daffa Khadafi · AI-Assisted Product Engineer
            </p>
            <div className={s.actions}>
              <Link href="/about" className={s.secondary}>
                Tentang pembuatnya <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className={s.closing}>
        <div>
          <h2>
            Mulai kecil. <em>Terus bergerak.</em>
          </h2>
          <p>Temukan panduan gratis untuk langkah pertamamu.</p>
        </div>
        <Link href="/resources" className={s.secondary}>
          Buka resources <ArrowUpRight />
        </Link>
      </div>
    </>
  );
}
