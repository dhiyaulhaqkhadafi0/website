import { ReaderContents } from "@/components/freelance/BusinessInteractions";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HubShell,
  HubBreadcrumb,
  AssetDownloadLinks,
} from "@/components/freelance/BusinessHubShared";
import {
  sbs,
  assets,
  SBS_PATH,
  chapterHref,
  RATE_PATH,
} from "@/content/business-hub";
import s from "@/components/freelance/business-hub.module.css";
export const dynamicParams = false;
export const generateStaticParams = () =>
  sbs.chapters.map((c) => ({ chapter: c.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter } = await params;
  const c = sbs.chapters.find((x) => x.slug === chapter);
  if (!c) notFound();
  return {
    title: `${c.title} — Service Business System`,
    description:
      c.components.map((x) => x.title).join(", ") +
      ". Panduan bisnis jasa dan dokumen gratis tanpa login.",
    alternates: { canonical: chapterHref(c.slug) },
  };
}
export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const index = sbs.chapters.findIndex((c) => c.slug === chapter);
  if (index < 0) notFound();
  const c = sbs.chapters[index];
  const words = JSON.stringify(c).split(/\s+/).length;
  return (
    <HubShell>
      <header className={s.hero}>
        <div className={s.wrap}>
          <HubBreadcrumb
            label={c.title}
            parent={{ href: SBS_PATH, title: "Service Business System" }}
          />
          <span className={s.eyebrow}>
            Bab 0{index + 1} / 06 · {Math.ceil(words / 200)} menit baca
          </span>
          <h1>
            {c.title}
            <em>.</em>
          </h1>
          <p>{c.components.map((x) => x.title).join(" · ")}</p>
          <div className={s.meta}>
            <span>Panduan lengkap · Gratis</span>
            <span>Contoh DEMO-001 Kedai Senja bersifat fiktif</span>
          </div>
        </div>
      </header>
      <div className={s.wrap}>
        <div className={s.reader}>
          <ReaderContents>
            <nav aria-label="Indeks bab">
              {sbs.chapters.map((x) => (
                <Link
                  key={x.slug}
                  href={chapterHref(x.slug)}
                  aria-current={x.slug === c.slug ? "page" : undefined}
                >
                  {x.title}
                </Link>
              ))}
              <div className={s.anchors}>
                {c.components.map((x) => (
                  <a key={x.id} href={`#${x.anchor}`}>
                    {x.title} ↓
                  </a>
                ))}
              </div>
              <Link href={`${SBS_PATH}#dokumen`}>Pustaka dokumen ↗</Link>
            </nav>
          </ReaderContents>
          <article className={s.article}>
            {c.slug === "fondasi" && (
              <section>
                <span className={s.eyebrow}>Lima lensa layanan</span>
                <h2>Model boleh beririsan.</h2>
                <p>{sbs.model_note}</p>
                {sbs.model_lenses.map((m) => (
                  <p key={m.name}>
                    <strong>{m.name}</strong> — {m.description}
                  </p>
                ))}
              </section>
            )}
            {c.components.map((x) => (
              <section key={x.id} id={x.anchor} data-component={x.id}>
                <span className={s.eyebrow}>
                  {x.id.replace("component-", "Komponen ")} / 24
                </span>
                <h2>
                  <a href={`#${x.anchor}`}>{x.title}</a>
                </h2>
                <p>{x.summary}</p>
                {x.sections.map((section, i) => (
                  <div key={i}>
                    <h3>{section.heading}</h3>
                    {section.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                ))}
                <h3>Langkah praktik</h3>
                <ol>
                  {x.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <aside className={s.example}>
                  <small>{x.example.label}</small>
                  <p>{x.example.text}</p>
                </aside>
                <h3>Kesalahan yang perlu dihindari</h3>
                <p>{x.common_mistake}</p>
                <aside className={s.relatedDocs}>
                  <span>Dokumen terkait / Gratis tanpa login</span>
                  {x.downloads.map((id) => {
                    const a = assets.find((y) => y.id === id);
                    return a ? (
                      <div key={id}>
                        <p>
                          <strong>{a.title}</strong>
                          {a.optional ? " · Opsional" : ""}
                        </p>
                        {a.usage_notice && <p>{a.usage_notice}</p>}
                        <AssetDownloadLinks asset={a} />
                        {a.id === "sbs-03" && (
                          <Link
                            className={s.textLink}
                            href={`${RATE_PATH}#harga-proyek`}
                          >
                            Hitung langsung di web ↗
                          </Link>
                        )}
                      </div>
                    ) : null;
                  })}
                </aside>
              </section>
            ))}
            <nav className={s.chapterNav} aria-label="Navigasi bab">
              {index > 0 ? (
                <Link href={chapterHref(sbs.chapters[index - 1].slug)}>
                  <small>← Bab sebelumnya</small>
                  {sbs.chapters[index - 1].title}
                </Link>
              ) : (
                <Link href={SBS_PATH}>
                  <small>← Kembali</small>Pengantar sistem
                </Link>
              )}
              {index < 5 ? (
                <Link href={chapterHref(sbs.chapters[index + 1].slug)}>
                  <small>Bab berikutnya →</small>
                  {sbs.chapters[index + 1].title}
                </Link>
              ) : (
                <Link href={`${SBS_PATH}#checklist`}>
                  <small>Langkah berikutnya →</small>Periksa kesiapanmu
                </Link>
              )}
            </nav>
          </article>
        </div>
      </div>
    </HubShell>
  );
}
