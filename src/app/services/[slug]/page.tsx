import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/content/shop";
import { ShopArtwork } from "@/components/shop/ShopArtwork";
import { ServiceInquiry } from "@/components/shop/ServiceInquiry";
import s from "@/components/shop/shop.module.css";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((item) => item.slug === slug);
  return service
    ? {
        title: service.title + " — Jasa Khadafi",
        description: service.description,
        alternates: { canonical: service.href },
        openGraph: {
          title: service.title,
          description: service.description,
          url: service.href,
        },
      }
    : { title: "Layanan tidak ditemukan", robots: { index: false } };
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((item) => item.slug === slug);
  if (!service) notFound();
  const listSections = [
    ["02 / SCOPE", "Apa yang kita kerjakan.", service.scope],
    ["03 / DELIVERABLES", "Hasil yang bisa dipegang.", service.deliverables],
    ["04 / STARTING POINT", "Yang perlu disiapkan.", service.requirements],
    ["05 / BOUNDARIES", "Batas yang disepakati.", service.exclusions],
  ] as const;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.description,
            provider: {
              "@type": "Person",
              name: "Daffa Khadafi",
              url: "https://khadafidaffa.com/about",
            },
            url: "https://khadafidaffa.com" + service.href,
          }).replace(/</g, "\\u003c"),
        }}
      />
      <div className={s.breadcrumb}>
        <Link href="/products">Studio & Shop</Link>
        <span>/</span>
        <Link href="/services">Jasa</Link>
        <span>/</span>
        <span>{service.title}</span>
      </div>
      <section className={s.detailHero}>
        <ShopArtwork item={service} />
        <div>
          <span className={s.eyebrow}>
            WORK WITH KHADAFI / {service.format}
          </span>
          <h1>{service.title}</h1>
          <p className={s.lead}>{service.intro}</p>
          <div className={s.detailMeta}>
            <span>{service.priceLabel}</span>
            <span>Scope disepakati sebelum mulai</span>
          </div>
          <div className={s.actions}>
            <a href="#inquiry" className={s.button}>
              Diskusikan proyek <ArrowUpRight />
            </a>
            <a href="#scope" className={s.textLink}>
              Lihat ruang lingkup ↓
            </a>
          </div>
        </div>
      </section>
      <section className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>01 / A GOOD FIT</span>
          <h2>Berangkat dari kebutuhanmu.</h2>
        </div>
        <p className={s.prose}>{service.audience}</p>
      </section>
      {listSections.map(([eyebrow, heading, list], index) => (
        <section
          id={index === 0 ? "scope" : undefined}
          className={s.detailSections}
          key={heading}
        >
          <div>
            <span className={s.eyebrow}>{eyebrow}</span>
            <h2>{heading}</h2>
          </div>
          <div className={s.prose}>
            <ul>
              {list.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}
      <section className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>06 / THE PROCESS</span>
          <h2>
            Dari percakapan
            <br />
            <em>ke pekerjaan nyata.</em>
          </h2>
        </div>
        <ol className={s.processList}>
          {service.process.map(([title, text], index) => (
            <li key={title}>
              <span>0{index + 1}</span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>07 / TIMING & CONTEXT</span>
          <h2>Ruang untuk merencanakan.</h2>
        </div>
        <div className={s.prose}>
          <p>{service.timeline}</p>
          <p>
            Untuk memahami konteks cara kerjaku, lihat{" "}
            <Link href="/about#journey" className={s.textLink}>
              perjalanan dan eksplorasi produk ↗
            </Link>
            . Eksplorasi pribadi bukan studi kasus klien.
          </p>
        </div>
      </section>
      <ServiceInquiry service={service.slug} />
      <div className={s.closing}>
        <div>
          <h2>
            Butuh sudut <em>yang berbeda?</em>
          </h2>
          <p>Lihat layanan lain dan pilih titik awal yang paling dekat.</p>
        </div>
        <Link href="/services" className={s.secondary}>
          Semua layanan <ArrowUpRight />
        </Link>
      </div>
    </>
  );
}
