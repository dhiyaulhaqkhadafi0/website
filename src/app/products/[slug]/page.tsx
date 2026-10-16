import type { Metadata } from "next";
import { CURATED_TOOLS } from "@/content/shop";
import { CuratedDetail } from "@/components/shop/CuratedDetail";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  publishedProduct,
  pageUser,
  commerceConfigured,
} from "@/lib/commerce-server";
import { money, type Product } from "@/lib/commerce-types";
import { BookCover } from "@/components/commerce/BookCover";
import s from "@/components/commerce/commerce.module.css";
export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  if (preview === "1")
    return { title: "Preview produk", robots: { index: false, follow: false } };
  const tool = CURATED_TOOLS.find((item) => item.slug === slug);
  if (tool)
    return {
      title: tool.title + " — Pilihan Khadafi",
      description: tool.description,
      alternates: { canonical: tool.href },
      openGraph: {
        title: tool.title,
        description: tool.description,
        url: tool.href,
      },
    };
  const p = await publishedProduct(slug);
  if (!p) return { title: "Produk tidak ditemukan", robots: { index: false } };
  return {
    title: p.seo_title || p.name,
    description: p.seo_description || p.short_description,
    alternates: { canonical: "/products/" + p.slug },
    openGraph: {
      title: p.name,
      description: p.short_description,
      url: "/products/" + p.slug,
      images: p.cover_url ? [{ url: p.cover_url, alt: p.name }] : [],
    },
  };
}
export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const tool = CURATED_TOOLS.find((item) => item.slug === slug);
  if (tool && preview !== "1") return <CuratedDetail tool={tool} />;
  let p: Product | null;
  if (preview === "1") {
    const auth = await pageUser("/products/" + slug + "?preview=1", true);
    const { data } = await auth.client
      .from("commerce_products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    p = data;
  } else p = await publishedProduct(slug);
  if (!p) notFound();
  const draft = preview === "1";
  const available = commerceConfigured(p.price > 0);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.short_description,
    image: p.cover_url || undefined,
    brand: { "@type": "Brand", name: "Khadafi" },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "IDR",
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: "https://khadafidaffa.com/products/" + p.slug,
    },
  };
  return (
    <>
      {!draft && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <div className={s.breadcrumb}>
        <Link href="/products">Produk</Link>
        <span>/</span>
        <span>{p.category}</span>
      </div>
      {draft && (
        <div className={s.notice}>
          Preview privat · Status: {p.status}.{" "}
          <Link href={"/studio/products/" + p.id}>Kembali ke editor ↗</Link>
        </div>
      )}
      <section className={s.detailHero}>
        <div className={s.heroGrid}>
          <BookCover name={p.name} cover={p.cover_url} />
          <div>
            <span className={s.eyebrow}>{p.category} / BY DAFFA KHADAFI</span>
            <h1>{p.name}</h1>
            <p className={s.lead}>{p.short_description}</p>
            <div className={s.price}>{money(p.price)}</div>
            <div className={s.actions}>
              {draft ? (
                <span className={s.badge}>
                  Checkout tersedia setelah dipublikasikan
                </span>
              ) : available ? (
                <Link href={"/checkout/" + p.slug} className={s.button}>
                  {p.price === 0 ? "Dapatkan gratis" : "Dapatkan produk"}{" "}
                  <ArrowUpRight />
                </Link>
              ) : (
                <span className={s.badge}>Penjualan belum dibuka</span>
              )}
              <a href="#tentang-produk" className={s.secondary}>
                Lihat lebih dekat ↓
              </a>
            </div>
            <p className={s.note}>
              Produk digital · Akses melalui library akunmu
            </p>
          </div>
        </div>
      </section>
      <section id="tentang-produk" className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>01 / THE IDEA</span>
          <h2>Tentang produk ini.</h2>
        </div>
        <div className={s.prose}>{p.description || p.short_description}</div>
      </section>
      {p.included.length > 0 && (
        <section className={s.detailSections}>
          <div>
            <span className={s.eyebrow}>02 / WHAT&apos;S INSIDE</span>
            <h2>Bekal yang kamu dapat.</h2>
          </div>
          <ol className={s.list}>
            {p.included.map((item, i) => (
              <li key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      {p.preview && (
        <section className={s.detailSections}>
          <div>
            <span className={s.eyebrow}>A CLOSER LOOK</span>
            <h2>Cuplikan dari dalam.</h2>
          </div>
          <div className={s.prose}>{p.preview}</div>
        </section>
      )}
      {p.audience && (
        <section className={s.detailSections}>
          <div>
            <span className={s.eyebrow}>FOR YOUR JOURNEY</span>
            <h2>Cocok untukmu?</h2>
          </div>
          <div className={s.prose}>{p.audience}</div>
        </section>
      )}
      <section className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>A FEW DETAILS</span>
          <h2>Sebelum memulai.</h2>
        </div>
        <div>
          <details className={s.faq}>
            <summary>Bagaimana cara mengakses produk?</summary>
            <p>
              Masuk atau buat akun, lalu selesaikan checkout. Setelah pesanan
              dikonfirmasi, produk akan tersedia di library akunmu.
            </p>
          </details>
          <details className={s.faq}>
            <summary>Di mana saya bisa mengunduhnya?</summary>
            <p>
              Buka Akun saya → Library dan pilih Unduh produk. Link unduhan
              bersifat sementara; kamu bisa membuat link baru dari library.
            </p>
          </details>
          <details className={s.faq}>
            <summary>Bagaimana lisensi dan bantuan produk?</summary>
            <p>
              Hak penggunaan mengikuti ketentuan produk pada saat pembelian dan{" "}
              <Link href="/terms">Syarat & Ketentuan</Link>. Jangan menjual
              ulang atau mendistribusikan file tanpa izin. Untuk pertanyaan
              produk, hubungi{" "}
              <a href="mailto:daffadhiyaulhaqkhadafi@gmail.com">
                email Khadafi
              </a>
              .
            </p>
          </details>
          <details className={s.faq}>
            <summary>Siapa yang membuat produk ini?</summary>
            <p>
              Daffa Khadafi, builder independen dan AI-Assisted Product
              Engineer. <Link href="/about">Kenali lebih jauh ↗</Link>
            </p>
          </details>
        </div>
      </section>
      <div className={s.closing}>
        <div>
          <h2>
            Siap mengambil <em>langkah berikutnya?</em>
          </h2>
          <p>
            {p.name} · {money(p.price)}
          </p>
        </div>
        {!draft && available && (
          <Link className={s.button} href={"/checkout/" + p.slug}>
            Dapatkan produk <ArrowUpRight />
          </Link>
        )}
      </div>
    </>
  );
}
