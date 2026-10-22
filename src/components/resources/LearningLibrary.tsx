"use client";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore, useEffect } from "react";
import {
  LEARNING_RESOURCES,
  LEARNING_TOPICS,
  LEARNING_PATHS,
  FORMAT_LABELS,
  LEVEL_LABELS,
  LANGUAGE_LABELS,
  learningHref,
  type LearningResource,
} from "@/content/learning-resources";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import s from "./learning-library.module.css";
import { LearningThumbnail } from "./LearningThumbnail";

const subscribe = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  window.addEventListener("learning-query-change", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("learning-query-change", callback);
  };
};
const snapshot = () => window.location.search;
function ResourceLink({
  resource,
  className,
  children,
}: {
  resource: LearningResource;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={learningHref(resource)}
      className={className}
      {...(resource.externalUrl
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </Link>
  );
}
function Folio({ kind }: { kind: "brief" | "ai" | "freelance" }) {
  return (
    <div className={s.folio} data-kind={kind} aria-hidden="true">
      <div className={s.folioBack} />
      <div className={s.folioFront}>
        <span>KHADAFI / LEARNING NOTES</span>
        <strong>
          {kind === "brief" ? (
            <>
              A small idea.
              <br />
              <em>A real beginning.</em>
            </>
          ) : kind === "ai" ? (
            "✳"
          ) : (
            "0 → 1"
          )}
        </strong>
        <i />
        <i />
        <i />
        <small>
          {kind === "brief"
            ? "Problem → Possibility → Product"
            : kind === "ai"
              ? "Context. Curiosity. Clarity."
              : "Your independent chapter."}
        </small>
      </div>
    </div>
  );
}
export function LearningLibrary() {
  const query = new URLSearchParams(
    useSyncExternalStore(subscribe, snapshot, () => ""),
  );
  const q = query.get("q") || "";
  const category = LEARNING_TOPICS.some((t) => t.id === query.get("category"))
    ? query.get("category")!
    : "all";
  const format = Object.hasOwn(FORMAT_LABELS, query.get("format") || "")
    ? query.get("format")!
    : "all";
  const level = Object.hasOwn(LEVEL_LABELS, query.get("level") || "")
    ? query.get("level")!
    : "all";
  const [draft, setDraft] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    const resetDraft = () => {
      if (timer.current) clearTimeout(timer.current);
      setDraft(null);
    };
    window.addEventListener("popstate", resetDraft);
    return () => window.removeEventListener("popstate", resetDraft);
  }, []);
  function update(values: Record<string, string>) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(values)) {
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
    }
    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        (params.size ? "?" + params.toString() : "") +
        window.location.hash,
    );
    window.dispatchEvent(new Event("learning-query-change"));
  }
  function search(value: string) {
    setDraft(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      update({ q: value.trim() });
      setDraft(null);
    }, 160);
  }
  function clear(all = false) {
    if (timer.current) clearTimeout(timer.current);
    setDraft(null);
    update(
      all ? { q: "", category: "all", format: "all", level: "all" } : { q: "" },
    );
  }
  const results = LEARNING_RESOURCES.filter(
    (r) =>
      r.status === "published" &&
      (category === "all" || r.category === category) &&
      (format === "all" || r.format === format) &&
      (level === "all" || r.level === level) &&
      [
        r.title,
        r.description,
        r.provider,
        LEARNING_TOPICS.find((t) => t.id === r.category)?.label,
      ]
        .join(" ")
        .toLocaleLowerCase("id")
        .includes(q.toLocaleLowerCase("id")),
  );
  const featured = [
    "product-idea-brief",
    "prompting-fundamentals",
    "checklist-persiapan-freelance",
  ].map((slug) => LEARNING_RESOURCES.find((r) => r.slug === slug)!);
  return (
    <div className={s.library}>
      <div className={s.coverWrap}>
        <a href="#collection" className={s.cover} aria-label="Jelajahi koleksi sumber daya gratis">
          <picture>
            <source media="(max-width: 760px)" srcSet="/images/experience/resources-cover-v1-768.webp" />
            {/* Pre-sized responsive cover avoids a transformation request and layout shifts. */}
            <img src="/images/experience/resources-cover-v1-1440.webp" width="1440" height="540" fetchPriority="high" alt="HCFTL dan semesta sumber daya: alat digital, template, ebook, dan panduan belajar" />
          </picture>
          <span className={s.coverLabel}>HCFTL / A little curiosity. A bigger tomorrow. <b aria-hidden="true">↗</b></span>
        </a>
      </div>
      <header className={s.hero}>
        <div className={s.container}>
          <div className={s.heroMeta}>
            <span>The learning library</span>
            <span>Vol. 01 / Terus bertumbuh</span>
          </div>
          <div className={s.heroGrid}>
            <div>
              <h1>
                <span>
                  Hal baru untuk
                  <br />
                  dipelajari.
                </span>{" "}
                <em>
                  Ide baru untuk
                  <br />
                  diwujudkan.
                </em>
              </h1>
              <p>
                Materi belajar gratis dan alat bantu yang kupilih untuk menemani
                perjalananmu di dunia digital.
              </p>
            </div>
            <div className={s.libraryArt} aria-hidden="true">
              <div className={s.learningOrbit}><i /><i /><i /></div>
              <span className={s.artIndex}>COLLECTED WITH CURIOSITY</span>
              <div className={s.learningDesk}>
                <div className={s.deskChrome}><span><i /><i /><i /></span>khadafi / learning desk <b>↗</b></div>
                <div className={s.deskBody}>
                  <small>A PLACE FOR YOUR NEXT IDEA</small>
                  <strong>Small beginnings.<br /><em>Real possibilities.</em></strong>
                  <div className={s.deskTiles}><span>✳<small>AI & IDEAS</small></span><span>⌘<small>BUILD & CREATE</small></span><span>↗<small>INDEPENDENT WORK</small></span></div>
                  <div className={s.deskLine}><i /><i /><i /></div>
                </div>
              </div>
              <div className={`${s.bookOne} ${s.resourceNote}`}>
                <small>01 / YOUR FIRST NOTE</small>
                <b>A little<br /><em>curiosity.</em></b>
                <i>IDE → PROTOTYPE → POSSIBILITY</i>
              </div>
              <span className={s.resourceSeal}><b>20</b>OPEN RESOURCES</span>
              <span className={s.artCaption}>
                Sedikit belajar. Banyak kemungkinan.
              </span>
            </div>
          </div>
          <form
            data-premium-search
            className={s.search}
            onSubmit={(e) => {
              e.preventDefault();
              if (timer.current) clearTimeout(timer.current);
              update({ q: (draft ?? q).trim() });
              setDraft(null);
              document
                .getElementById("collection")
                ?.scrollIntoView({ behavior: "instant" });
            }}
            role="search"
          >
            <span aria-hidden="true">⌕</span>
            <label className={s.srOnly} htmlFor="learning-search">
              Cari materi belajar
            </label>
            <input
              id="learning-search"
              type="search"
              autoComplete="off"
              placeholder="Apa yang ingin kamu pelajari?"
              value={draft ?? q}
              onChange={(e) => search(e.target.value)}
            />
            {(draft ?? q) && (
              <button
                type="button"
                onClick={() => clear()}
                aria-label="Hapus pencarian"
              >
                ×
              </button>
            )}
            <button
              type="submit"
              className={s.searchGo}
              aria-label="Lihat hasil pencarian"
            >
              ↗
            </button>
          </form>
          <div className={s.heroBottom}>
            <span>20 materi pilihan · 4 bidang · Gratis untuk dipelajari</span>
            <a href="#collection">
              Jelajahi koleksi <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </header>
      <section
        className={s.section}
        aria-labelledby="picks-title"
        data-reveal="soft"
      >
        <div className={s.container}>
          <div className={s.sectionHeading}>
            <div>
              <p className={s.kicker}>01 / Dari meja kurasi</p>
              <h2 id="picks-title">
                Pilihan <em>Khadafi.</em>
              </h2>
            </div>
            <p>
              Tiga titik awal.
              <br />
              Banyak arah untuk bertumbuh.
            </p>
          </div>
          <div className={s.picks}>
            {featured.map((r, i) => (
              <ResourceLink key={r.id} resource={r} className={s.pick}>
                <div className={s.pickMeta}>
                  <span>
                    {i === 0
                      ? "Mulai dari sebuah ide"
                      : i === 1
                        ? "Kenali kemungkinan AI"
                        : "Babak independenmu"}
                  </span>
                  <span aria-hidden="true">↗</span>
                </div>
                <Folio
                  kind={i === 0 ? "brief" : i === 1 ? "ai" : "freelance"}
                />
                <div className={s.pickCopy}>
                  <span className={s.kicker}>
                    {r.provider} · {FORMAT_LABELS[r.format]}
                  </span>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                  <span className={s.pickAction}>
                    {r.externalUrl ? "Buka sumber resmi" : "Buka materi"}{" "}
                    <span aria-hidden="true">↗</span>
                    {r.externalUrl && (
                      <span className={s.srOnly}> (tab baru)</span>
                    )}
                  </span>
                </div>
              </ResourceLink>
            ))}
          </div>
        </div>
      </section>
      <section
        className={s.topicsSection}
        aria-labelledby="topics-title"
        data-reveal="line"
      >
        <div className={s.container}>
          <p className={s.kicker}>02 / Ikuti rasa ingin tahu</p>
          <h2 id="topics-title">
            Jelajahi <em>empat bidang.</em>
          </h2>
          <div className={s.topics}>
            {LEARNING_TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={s.topic}
                data-category={t.id}
                aria-pressed={category === t.id}
                onClick={() => {
                  update({ category: t.id });
                  document
                    .getElementById("collection")
                    ?.scrollIntoView({
                      behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)",
                      ).matches
                        ? "instant"
                        : "smooth",
                    });
                }}
              >
                <span className={s.topicMark} aria-hidden="true">
                  {t.mark}
                </span>
                <span>
                  {t.short}
                  <i aria-hidden="true">↗</i>
                </span>
                <small>{t.description}</small>
                <small>{t.count} materi</small>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section
        id="collection"
        className={s.section}
        aria-labelledby="collection-title"
      >
        <div className={s.container}>
          <div className={s.sectionHeading}>
            <div>
              <p className={s.kicker}>03 / Temukan yang kamu butuhkan</p>
              <h2 id="collection-title">
                Koleksi <em>pembelajaran.</em>
              </h2>
            </div>
            <p className={s.resultCount} role="status" aria-live="polite">
              {results.length} dari 20 materi
            </p>
          </div>
          <div className={s.filters}>
            <div className={s.categoryFilters} aria-label="Filter topik">
              {[{ id: "all", short: "Semua" }, ...LEARNING_TOPICS].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={category === t.id}
                  onClick={() => update({ category: t.id })}
                >
                  {t.short}
                </button>
              ))}
            </div>
            <div className={s.selects}>
              <label>
                <span className={s.srOnly}>Format materi</span>
                <select
                  value={format}
                  onChange={(e) => update({ format: e.target.value })}
                >
                  <option value="all">Semua format</option>
                  {Object.entries(FORMAT_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className={s.srOnly}>Tingkat kesulitan</span>
                <select
                  value={level}
                  onChange={(e) => update({ level: e.target.value })}
                >
                  <option value="all">Semua tingkat</option>
                  {Object.entries(LEVEL_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          {(q || category !== "all" || format !== "all" || level !== "all") && (
            <div className={s.activeFilters}>
              <span>
                {q ? "Hasil untuk “" + q + "”" : "Koleksi sesuai pilihanmu"}
              </span>
              <button type="button" onClick={() => clear(true)}>
                Hapus semua filter ×
              </button>
            </div>
          )}
          <div className={s.catalog}>
            {results.map((r) => (
              <article
                key={r.id}
                className={s.resourceCard}
                data-category={r.category}
                data-resource={r.slug}
              >
                <ResourceLink resource={r} className={s.thumbnailLink}>
                  <LearningThumbnail resource={r} />
                  <span className={s.srOnly}>Buka {r.title}</span>
                </ResourceLink>
                <div className={s.cardTop}>
                  <span>
                    {LEARNING_TOPICS.find((t) => t.id === r.category)?.short}
                  </span>
                  <span>{FORMAT_LABELS[r.format]}</span>
                </div>
                <ResourceLink resource={r} className={s.cardTitle}>
                  <h3>{r.title}</h3>
                  <span aria-hidden="true">↗</span>
                  {r.externalUrl && (
                    <span className={s.srOnly}> (sumber resmi, tab baru)</span>
                  )}
                </ResourceLink>
                <details className={s.cardDetails}>
                  <summary>Tentang materi ini <span aria-hidden="true">+</span></summary>
                  <p>{r.description}</p>
                  <p className={s.access}>{r.accessNote}</p>
                </details>
                <div className={s.cardMeta}>
                  <strong>{r.provider}</strong>
                  <span>
                    {LEVEL_LABELS[r.level]} · {LANGUAGE_LABELS[r.language]}
                  </span>
                </div>
                <span className={s.sourceType}>
                  {r.sourceType === "original"
                    ? "Original Khadafi"
                    : "Kurasi · Sumber resmi"}
                </span>
              </article>
            ))}
          </div>
          {results.length === 0 && (
            <div className={s.empty}>
              <span aria-hidden="true">⌕</span>
              <h3>Belum menemukan yang cocok?</h3>
              <p>Coba kata yang lebih singkat atau jelajahi seluruh koleksi.</p>
              <button type="button" onClick={() => clear(true)}>
                Lihat semua materi →
              </button>
            </div>
          )}
        </div>
      </section>
      <section
        className={s.pathsSection}
        aria-labelledby="paths-title"
        data-reveal="heading"
      >
        <div className={s.container}>
          <div className={s.sectionHeading}>
            <div>
              <p className={s.kicker}>04 / Satu langkah, lalu berikutnya</p>
              <h2 id="paths-title">
                Mulai <em>dari mana?</em>
              </h2>
            </div>
            <p>
              Tidak perlu mempelajari semuanya.
              <br />
              Pilih satu rute yang dekat denganmu.
            </p>
          </div>
          <div className={s.paths}>
            {LEARNING_PATHS.map((p, i) => (
              <div key={p.title} className={s.path}>
                <span className={s.pathNumber}>0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.intro}</p>
                <ol>
                  {p.slugs.map((slug) => {
                    const r = LEARNING_RESOURCES.find((x) => x.slug === slug)!;
                    return (
                      <li key={slug}>
                        <ResourceLink resource={r}>
                          {r.title}
                          <span aria-hidden="true">↗</span>
                        </ResourceLink>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={s.connectSection} aria-labelledby="newsletter-title">
        <div className={s.container}>
          <NewsletterSection />
        </div>
      </section>
    </div>
  );
}
