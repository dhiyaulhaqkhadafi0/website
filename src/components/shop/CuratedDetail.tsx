import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { type CuratedTool, CURATED_TOOLS } from "@/content/shop";
import { ShopArtwork } from "./ShopArtwork";
import s from "./shop.module.css";
export function CuratedDetail({ tool }: { tool: CuratedTool }) {
  return (
    <>
      <div className={s.breadcrumb}>
        <Link href="/products">Studio & Shop</Link>
        <span>/</span>
        <Link href="/products/recommended">Rekomendasi</Link>
        <span>/</span>
        <span>{tool.title}</span>
      </div>
      <section className={s.detailHero}>
        <ShopArtwork item={tool} />
        <div>
          <span className={s.eyebrow}>CURATED FOR YOU / {tool.provider}</span>
          <h1>{tool.title}</h1>
          <p className={s.lead}>{tool.description}</p>
          <div className={s.detailMeta}>
            <span>{tool.topic}</span>
            <span>{tool.format}</span>
            <span>Kurasi non-affiliate</span>
          </div>
          <div className={s.actions}>
            <a
              className={s.button}
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat di Website Resmi <ExternalLink />
            </a>
            <a
              className={s.textLink}
              href={tool.pricingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cek paket terbaru <ArrowUpRight />
            </a>
          </div>
          <p className={s.formNote}>
            Membuka website {tool.provider} di tab baru. Akun, pembayaran, dan
            dukungan ditangani provider.
          </p>
        </div>
      </section>
      <section className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>01 / WHY IT&apos;S HERE</span>
          <h2>Dipilih dengan alasan.</h2>
        </div>
        <p className={s.prose}>{tool.reason}</p>
      </section>
      <section className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>02 / WHAT IT HELPS WITH</span>
          <h2>Ruang untuk berkembang.</h2>
        </div>
        <div className={s.prose}>
          <ul>
            {tool.benefits.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>03 / A GOOD FIT</span>
          <h2>Cocok untuk siapa?</h2>
        </div>
        <p className={s.prose}>{tool.audience}</p>
      </section>
      <section className={s.detailSections}>
        <div>
          <span className={s.eyebrow}>04 / BEFORE YOU CHOOSE</span>
          <h2>Ketahui batasnya.</h2>
        </div>
        <div className={s.prose}>
          <p>{tool.limitation}</p>
          <p>
            Tautan ini bukan affiliate dan tidak menghasilkan komisi untuk
            Khadafi. Harga tidak disalin ke katalog agar kamu selalu melihat
            paket terbaru langsung dari provider.
          </p>
          <p className={s.formNote}>
            Sumber resmi diperiksa 16 Oktober 2026. Fitur dan ketentuan provider
            dapat berubah.
          </p>
        </div>
      </section>
      <section className={s.editorialSection}>
        <div className={s.sectionHeading}>
          <div>
            <span className={s.eyebrow}>KEEP EXPLORING</span>
            <h2>
              Tools lain, <em>sudut baru.</em>
            </h2>
          </div>
          <Link href="/products/recommended" className={s.textLink}>
            Semua rekomendasi <ArrowUpRight />
          </Link>
        </div>
        <div className={s.workList}>
          {CURATED_TOOLS.filter((t) => t.id !== tool.id).map((t) => (
            <Link href={t.href} key={t.id}>
              <div>
                {t.title}
                <small className={s.optional}> / {t.topic}</small>
              </div>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
