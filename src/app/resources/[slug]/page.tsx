import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { HomeExperience } from "@/components/home/HomeExperience";
import {
  LEARNING_RESOURCES,
  LEARNING_TOPICS,
  FORMAT_LABELS,
  LEVEL_LABELS,
} from "@/content/learning-resources";
import { LEARNING_GUIDES, guideMarkdown } from "@/content/learning-content";
import {
  ResourceTools,
  CopyPrompt,
} from "@/components/resources/ResourceTools";
import s from "@/components/resources/resource-reading.module.css";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return LEARNING_RESOURCES.filter(
    (r) => r.internalPath && r.status === "published",
  ).map((r) => ({ slug: r.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = LEARNING_RESOURCES.find((r) => r.slug === slug && r.internalPath);
  if (!r) return { title: "Materi tidak ditemukan" };
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: "https://khadafidaffa.com/resources/" + r.slug },
    openGraph: {
      title: r.title,
      description: r.description,
      type: "article",
      url: "https://khadafidaffa.com/resources/" + r.slug,
      images: ["/assets/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: r.title,
      description: r.description,
      images: ["/assets/og-image.png"],
    },
  };
}
export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const r = LEARNING_RESOURCES.find(
    (r) => r.slug === slug && r.internalPath && r.status === "published",
  );
  const guide = LEARNING_GUIDES[slug];
  if (!r || !guide) notFound();
  const markdown = guideMarkdown(r.title, guide);
  const minutes = Math.max(1, Math.ceil(markdown.split(/\s+/).length / 180));
  const related = LEARNING_RESOURCES.filter(
    (x) => x.category === r.category && x.slug !== slug,
  ).slice(0, 3);
  const sections = guide.sections.map((section, i) => ({
    ...section,
    id: "section-" + (i + 1),
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: r.title,
    description: r.description,
    inLanguage: "id-ID",
    dateModified: r.verifiedAt,
    author: {
      "@type": "Person",
      name: "Khadafi",
      url: "https://khadafidaffa.com",
    },
    mainEntityOfPage: "https://khadafidaffa.com/resources/" + slug,
  };
  return (
    <>
      <Navbar />
      <HomeExperience>
        <article className={s.readingPage}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <div className={s.container}>
            <Link href="/resources" className={s.back}>
              ← Kembali ke library
            </Link>
            <div className={s.articleHeader}>
              <p className={s.kicker}>
                {LEARNING_TOPICS.find((t) => t.id === r.category)?.label} /
                Original Khadafi
              </p>
              <h1>{r.title}</h1>
              <p className={s.dek}>{r.description}</p>
              <div className={s.metadata}>
                <span>{FORMAT_LABELS[r.format]}</span>
                <span>{LEVEL_LABELS[r.level]}</span>
                <span>{minutes} menit baca</span>
                <span>Diperbarui 16 Oktober 2026</span>
              </div>
              <a href="#workspace" className={s.jump}>
                Gunakan {guide.checklist ? "checklist" : "template dan materi"}{" "}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className={s.readingLayout}>
              <aside className={s.toc}>
                <p className={s.kicker}>Di halaman ini</p>
                <nav aria-label="Daftar isi materi">
                  <ol>
                    {sections.map((section, i) => (
                      <li key={section.id}>
                        <a href={"#" + section.id}>
                          <span>{String(i + 1).padStart(2, "0")}</span>
                          {section.title}
                        </a>
                      </li>
                    ))}
                    {guide.prompts && (
                      <li>
                        <a href="#prompts">24 prompt siap salin</a>
                      </li>
                    )}
                    <li>
                      <a href="#workspace">Ruang kerjamu</a>
                    </li>
                    {guide.example && (
                      <li>
                        <a href="#example">Contoh fiktif terisi</a>
                      </li>
                    )}
                  </ol>
                </nav>
              </aside>
              <div className={s.readingBody}>
                <p className={s.intro}>{guide.intro}</p>
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className={s.proseSection}
                  >
                    <h2>{section.title}</h2>
                    {section.paragraphs.map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}
                    {section.bullets && (
                      <ul>
                        {section.bullets.map((text) => (
                          <li key={text}>{text}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
                {guide.prompts && (
                  <section id="prompts" className={s.proseSection}>
                    <p className={s.kicker}>Pilih, lengkapi, lalu periksa</p>
                    <h2>24 prompt siap salin.</h2>
                    <div className={s.promptList}>
                      {guide.prompts.map((p, i) => (
                        <details key={p.title}>
                          <summary>
                            <span>{String(i + 1).padStart(2, "0")}</span>
                            <div>
                              <small>{p.group}</small>
                              <strong>{p.title}</strong>
                            </div>
                            <span aria-hidden="true">+</span>
                          </summary>
                          <pre>{p.text}</pre>
                          <CopyPrompt text={p.text} />
                        </details>
                      ))}
                    </div>
                  </section>
                )}
                <ResourceTools
                  slug={slug}
                  title={r.title}
                  template={guide.template}
                  checklist={guide.checklist}
                  markdown={markdown}
                />
                {guide.example && (
                  <section id="example" className={s.example}>
                    <p className={s.kicker}>Cara mengisinya</p>
                    <h2>
                      Satu contoh. <em>Banyak kemungkinan.</em>
                    </h2>
                    <p>
                      Seluruh skenario berikut fiktif, disusun untuk menunjukkan
                      cara menggunakan brief.
                    </p>
                    <pre>{guide.example}</pre>
                  </section>
                )}
                <div className={s.readingClosing}>
                  <p>
                    Belajar sedikit demi sedikit.
                    <br />
                    <em>Bangun sesuatu dari sana.</em>
                  </p>
                  <span>— Khadafi</span>
                </div>
              </div>
            </div>
            <section className={s.related} aria-labelledby="related-title">
              <p className={s.kicker}>Lanjutkan rasa ingin tahumu</p>
              <h2 id="related-title">
                Bacaan <em>berikutnya.</em>
              </h2>
              <div>
                {related.map((x) => (
                  <Link
                    key={x.id}
                    href={x.externalUrl || x.internalPath!}
                    {...(x.externalUrl
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <small>
                      {x.provider} · {FORMAT_LABELS[x.format]}
                    </small>
                    <h3>{x.title}</h3>
                    <span>
                      {x.externalUrl ? "Sumber resmi" : "Buka materi"} ↗
                      {x.externalUrl && (
                        <span className={s.srOnly}> (tab baru)</span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </article>
      </HomeExperience>
    </>
  );
}
