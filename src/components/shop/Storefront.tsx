import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publishedProducts } from "@/lib/commerce-server";
import { CURATED_TOOLS, SERVICES, originalItem } from "@/content/shop";
import { readFilters, type ShopFilters } from "@/lib/shop-discovery";
import { ShopArtwork } from "./ShopArtwork";
import { ShopDiscovery } from "./ShopDiscovery";
import s from "./shop.module.css";
export type ShopSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;
export async function Storefront({
  searchParams,
  mode = "all",
}: {
  searchParams: ShopSearchParams;
  mode?: ShopFilters["type"];
}) {
  const products = await publishedProducts();
  const items = [...products.map(originalItem), ...CURATED_TOOLS, ...SERVICES];
  const params = await searchParams,
    query = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    if (typeof value === "string") query.set(key, value);
  const initial = readFilters(query, items, mode);
  const featured = products.find((p) => p.featured) || products[0];
  const displayBook = featured
    ? originalItem(featured)
    : {
        artwork: "book" as const,
        title: "Formula Profitable Blueprint",
        cover: "/products/formula-profitable-blueprint-cover.webp",
      };
  return (
    <>
      {mode === "all" ? (
        <>
          <section className={s.hero}>
            <div>
              <span className={s.eyebrow}>KHADAFI / STUDIO & SHOP</span>
              <h1>
                Discover tools.
                <br />
                Build something
                <br />
                <em>great.</em>
              </h1>
              <p className={s.lead}>
                Produk digital, rekomendasi pilihan, dan layanan kreatif untuk
                membantumu berkarya dan membangun sesuatu.
              </p>
              <div className={s.actions}>
                <a href="#koleksi" className={s.button}>
                  Jelajahi koleksi <ArrowUpRight />
                </a>
                <Link href="/services" className={s.textLink}>
                  Mari berkolaborasi <ArrowUpRight />
                </Link>
              </div>
              <div className={s.heroNote}>
                <i />
                FOR BUILDERS, FREELANCERS & CREATORS
              </div>
            </div>
            <div className={s.heroFeature}>
              <ShopArtwork item={displayBook} priority />
              <span className={s.featureTag}>
                {featured ? "Made by Khadafi" : "Sedang disiapkan"}
              </span>
              <div className={s.featureCaption}>
                <span>THE INDEPENDENT BUILDER SERIES</span>
                <span>
                  {featured ? "Karya original" : "Cover awal · belum dijual"}
                </span>
              </div>
              {featured && (
                <Link
                  href={"/products/" + featured.slug}
                  className={s.textLink}
                >
                  {featured.name} <ArrowUpRight />
                </Link>
              )}
            </div>
          </section>
          <div className={s.principles}>
            <div>
              <strong>
                <span>01 /</span>Made with intention
              </strong>
              <p>Karya original, dibuat dengan perhatian.</p>
            </div>
            <div>
              <strong>
                <span>02 /</span>Chosen for a reason
              </strong>
              <p>Tools pilihan, dengan konteks yang jelas.</p>
            </div>
            <div>
              <strong>
                <span>03 /</span>Built together
              </strong>
              <p>Ide berikutnya, kita wujudkan bersama.</p>
            </div>
          </div>
        </>
      ) : (
        <section className={s.serviceHero}>
          <div>
            <span className={s.eyebrow}>
              KHADAFI /{" "}
              {mode === "original" ? "MADE BY KHADAFI" : "CURATED FOR YOU"}
            </span>
            <h1>
              {mode === "original" ? (
                <>
                  Dibuat perlahan.
                  <br />
                  <em>Untuk dipakai.</em>
                </>
              ) : (
                <>
                  Good tools.
                  <br />
                  <em>Thoughtful choices.</em>
                </>
              )}
            </h1>
          </div>
          <p>
            {mode === "original"
              ? "Ebook dan bekal digital original yang berangkat dari proses belajar serta membangun. Produk hanya tersedia saat isi dan aksesnya benar-benar siap."
              : "Empat tools untuk berpikir, merancang, menata, dan meluncurkan. Kenali manfaat serta batasnya sebelum memilih paket di website resmi."}
          </p>
        </section>
      )}
      <ShopDiscovery items={items} initial={initial} defaultType={mode} />
      {mode === "all" && (
        <section className={s.editorialSection}>
          <div className={s.workWith}>
            <div>
              <span className={s.eyebrow}>02 / WORK WITH KHADAFI</span>
              <h2>
                Punya ide?
                <br />
                <em>Mari wujudkan.</em>
              </h2>
              <p>
                Dari website yang terasa tepat sampai prototype yang bisa diuji.
                Kita mulai dari kebutuhanmu, lalu menyepakati langkah yang masuk
                akal.
              </p>
              <div className={s.actions}>
                <Link href="/services" className={s.secondary}>
                  Jelajahi layanan <ArrowUpRight />
                </Link>
              </div>
            </div>
            <div className={s.workList}>
              {SERVICES.map((service, index) => (
                <Link href={service.href} key={service.id}>
                  <div>
                    <span>0{index + 1}</span>
                    {service.title}
                  </div>
                  <ArrowUpRight />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className={s.editorialSection}>
        <div className={s.makerNote}>
          <div>
            <span className={s.eyebrow}>A NOTE FROM THE MAKER</span>
            <h2>
              Bukan sekadar dikoleksi.
              <br />
              <em>Untuk melangkah lagi.</em>
            </h2>
          </div>
          <div>
            <p>
              Aku percaya ide menjadi berharga ketika mulai dikerjakan. Ruang
              ini menyatukan bekal yang kubuat, tools yang relevan, dan cara
              kita bisa membangun bersama.
            </p>
            <small>DAFFA KHADAFI / INDEPENDENT BUILDER</small>
            <div className={s.actions}>
              <Link href="/about" className={s.textLink}>
                Kenali pembuatnya <ArrowUpRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className={s.editorialSection}>
        <div className={s.faqGrid}>
          <div>
            <span className={s.eyebrow}>A FEW THINGS TO KNOW</span>
            <h2>Sebelum memilih.</h2>
            <p className={s.lead}>
              Biar langkah berikutnya
              <br />
              terasa lebih jelas.
            </p>
          </div>
          <div>
            <details className={s.faq}>
              <summary>Apakah produk original sudah bisa dibeli?</summary>
              <p>
                Formula Profitable Blueprint masih disiapkan dan belum dijual.
                Produk yang siap akan memiliki halaman detail, informasi akses,
                serta checkout yang aktif. Untuk sekarang, kamu bisa menggunakan
                panduan gratis di{" "}
                <Link href="/resources">Learning Library</Link>.
              </p>
            </details>
            <details className={s.faq}>
              <summary>Apa bedanya rekomendasi dan produk Khadafi?</summary>
              <p>
                Rekomendasi adalah produk milik provider lain. Akun, harga,
                pembayaran, dan dukungan mengikuti provider. Empat rekomendasi
                saat ini menggunakan tautan resmi non-affiliate. Hubungan
                affiliate, jika ditambahkan, akan dijelaskan sebelum kamu
                membuka tautannya.
              </p>
            </details>
            <details className={s.faq}>
              <summary>Bagaimana cara mendiskusikan proyek?</summary>
              <p>
                Pilih layanan dan isi brief singkat di{" "}
                <Link href="/services#inquiry">formulir proyek</Link>. Ruang
                lingkup, jadwal, biaya, dan jumlah revisi akan dibahas dalam
                penawaran. Mengirim brief tidak membuat pesanan atau kewajiban
                pembayaran.
              </p>
            </details>
            <details className={s.faq}>
              <summary>Di mana akses produk yang sudah dimiliki?</summary>
              <p>
                Produk original yang aksesnya sudah terkonfirmasi dapat
                ditemukan di <Link href="/account/library">Library akunmu</Link>
                . Pembelian di website provider tidak masuk ke pesanan Khadafi.
              </p>
            </details>
          </div>
        </div>
      </section>
      <div className={s.closing}>
        <div>
          <h2>
            Mulai kecil. <em>Terus bergerak.</em>
          </h2>
          <p>
            Belum tahu mulai dari mana? Ada bekal gratis untuk langkah
            pertamamu.
          </p>
        </div>
        <Link href="/resources" className={s.secondary}>
          Buka resources <ArrowUpRight />
        </Link>
      </div>
    </>
  );
}
