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
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { ProductText } from "@/components/commerce/ProductText";
import { CREATOR_NAME, mediaUrl } from "@/lib/product-media";
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
      images: p.cover_url ? [{ url: mediaUrl(p.cover_url), alt: p.name }] : [],
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
  const included = p.included.filter(item => !/^apa yang akan kamu pelajari\s*:?\s*$/i.test(item));
  const available = commerceConfigured(p.price > 0);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.short_description,
    image: mediaUrl(p.cover_url) || undefined,
    author: { "@type": "Person", name: p.creator_name || CREATOR_NAME },
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
          <ProductGallery name={p.name} cover={p.cover_url} gallery={p.gallery} />
          <div>
            <span className={s.eyebrow}>{p.category} / {p.creator_name || CREATOR_NAME}</span>
            <h1>{p.name}</h1>
            <p className={s.lead}>{p.short_description.length > 240 ? p.short_description.slice(0, 237).replace(/\s+\S*$/, "") + "…" : p.short_description}</p>
            {p.short_description.length > 240 && <details className={s.heroSummary}><summary>Baca ringkasan lengkap</summary><ProductText text={p.short_description} /></details>}
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
                <Link href={"/checkout/" + p.slug} className={s.button}>Lihat checkout <ArrowUpRight /></Link>
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
      <section id="tentang-produk" className={`${s.detailSections} ${s.productOverview}`}>
        <div>
          <span className={s.eyebrow}>01 / THE IDEA</span>
          <h2>Tentang produk ini.</h2>
        </div>
        <ProductText text={p.description || p.short_description} />
      </section>
      {p.included.length > 0 && (
        <section className={s.detailSections}>
          <div>
            <span className={s.eyebrow}>02 / WHAT&apos;S INSIDE</span>
            <h2>Bekal yang kamu dapat.</h2>
          </div>
          <div className={s.moduleList}>{Array.from({ length: Math.ceil(included.length / 4) }, (_, group) => <details key={group} className={s.faq} open={group === 0}><summary>Bagian {String(group + 1).padStart(2, "0")} · Materi {group * 4 + 1}–{Math.min(group * 4 + 4, included.length)}</summary><ul>{included.slice(group * 4, group * 4 + 4).map((item, i) => <li key={i}>{item.replace(/^\d+[.)]\s*/, "")}</li>)}</ul></details>)}</div>
        </section>
      )}
      {p.preview && (
        <section className={s.detailSections}>
          <div>
            <span className={s.eyebrow}>A CLOSER LOOK</span>
            <h2>Cuplikan dari dalam.</h2>
          </div>
          <ProductText text={p.preview} />
        </section>
      )}
      {p.audience && (
        <section className={s.detailSections}>
          <div>
            <span className={s.eyebrow}>FOR YOUR JOURNEY</span>
            <h2>Cocok untukmu?</h2>
          </div>
          <ProductText text={p.audience} />
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
              Isi nama dan email di checkout, lalu selesaikan pembayaran. Akses tersedia di halaman pesanan setelah pembayaran terkonfirmasi. Untuk library di perangkat lain, masuk melalui email pembeli yang sama.
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
              {p.creator_name || CREATOR_NAME}, builder independen dan AI-Assisted Product
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
        {!draft && (
          <Link className={s.button} href={"/checkout/" + p.slug}>
            Lanjut ke checkout <ArrowUpRight />
          </Link>
        )}
      </div>
    </>
  );
}
