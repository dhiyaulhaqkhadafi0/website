import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/content/shop";
import { ShopArtwork } from "@/components/shop/ShopArtwork";
import { ServiceInquiry } from "@/components/shop/ServiceInquiry";
import s from "@/components/shop/shop.module.css";
export const metadata: Metadata = {
  title: "Jasa & Kolaborasi — Work with Khadafi",
  description:
    "Website, product prototyping, dan strategi konten. Ceritakan kebutuhanmu; ruang lingkup dan penawaran disepakati sebelum proyek dimulai.",
  alternates: { canonical: "/services" },
};
export default function ServicesPage() {
  return (
    <>
      <section className={s.serviceHero}>
        <div>
          <span className={s.eyebrow}>KHADAFI / SERVICES & COLLABORATION</span>
          <h1>
            Punya ide?
            <br />
            Mari bangun
            <br />
            <em>sesuatu yang berarti.</em>
          </h1>
        </div>
        <p>
          Website, prototype, dan arah komunikasi yang berangkat dari
          kebutuhanmu. Kita mulai dari percakapan, lalu tentukan apa yang paling
          berarti untuk dibangun.
        </p>
      </section>
      <div className={s.actions} style={{ marginTop: 0, marginBottom: 50 }}>
        <a href="#inquiry" className={s.button}>
          Diskusikan proyek <ArrowUpRight />
        </a>
        <Link href="/about#journey" className={s.textLink}>
          Kenali cara kerjaku <ArrowUpRight />
        </Link>
      </div>
      <section
        className={`${s.cardGrid} ${s.serviceGrid}`}
        aria-label="Pilihan layanan"
      >
        {SERVICES.map((item, index) => (
          <Link href={item.href} key={item.id} className={s.card}>
            <ShopArtwork item={item} />
            <div className={s.cardBody}>
              <div className={s.cardMeta}>
                <span>0{index + 1} / SERVICES</span>
                <span>{item.format}</span>
              </div>
              <h2
                style={{
                  fontSize: 23,
                  lineHeight: 1.3,
                  letterSpacing: "-.035em",
                  fontWeight: 500,
                }}
              >
                {item.title}
              </h2>
              <p>{item.description}</p>
              <div className={s.cardFoot}>
                <strong>{item.priceLabel}</strong>
                <span>Lihat ruang lingkup ↗</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <section className={s.editorialSection}>
        <div className={s.makerNote}>
          <div>
            <span className={s.eyebrow}>HOW WE WORK</span>
            <h2>
              Tujuan yang jelas.
              <br />
              <em>Langkah yang terukur.</em>
            </h2>
          </div>
          <ol className={s.processList}>
            <li>
              <span>01</span>
              <div>
                <strong>Pahami dulu.</strong>
                <p>Tujuan, pengguna, dan batas proyek menjadi titik awal.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Sepakati yang penting.</strong>
                <p>
                  Scope, hasil kerja, jadwal, biaya, dan review ditulis sebelum
                  mulai.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Bangun dan tinjau.</strong>
                <p>
                  Review pada milestone yang disepakati, kemudian handover hasil
                  dan dokumentasi.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <ServiceInquiry />
      <div className={s.closing}>
        <div>
          <h2>
            Ingin melihat <em>konteksnya?</em>
          </h2>
          <p>
            Perjalanan, prinsip, dan eksplorasi produk yang sedang kukerjakan.
          </p>
        </div>
        <Link href="/about" className={s.secondary}>
          Tentang Khadafi <ArrowUpRight />
        </Link>
      </div>
    </>
  );
}
