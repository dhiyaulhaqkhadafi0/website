"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Search, Grid2X2, SlidersHorizontal } from "lucide-react";
import {
  appHref,
  appPrice,
  type AppCategory,
  type AppRecord,
} from "@/lib/apps-types";
import { trackEvent } from "@/lib/analytics";
import s from "./apps.module.css";
export function AppsCatalog({
  apps,
  categories,
  available,
  category,
}: {
  apps: AppRecord[];
  categories: AppCategory[];
  available: boolean;
  category?: AppCategory;
}) {
  const [query, setQuery] = useState(""),
    [pricing, setPricing] = useState(""),
    [tag, setTag] = useState(""),
    [sort, setSort] = useState("featured");
  const tags = [...new Set(apps.flatMap((a) => a.tags))].sort();
  const filtered = apps
    .filter(
      (a) =>
        (!category || a.category_id === category.id) &&
        (!pricing || a.pricing_model === pricing) &&
        (!tag || a.tags.includes(tag)) &&
        `${a.name} ${a.name_en} ${a.short_description} ${a.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "newest"
          ? b.created_at.localeCompare(a.created_at)
          : Number(b.featured) - Number(a.featured),
    );
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(
      () =>
        trackEvent("search", {
          search_term: "apps_catalog",
          result_count: filtered.length,
        }),
      800,
    );
    return () => clearTimeout(timer);
  }, [query, filtered.length]);
  return (
    <div className={s.catalog}>
      <header className={s.hero}>
        <span className={s.eyebrow}>
          KHADAFI APPS / PRACTICAL TOOLS FOR INDEPENDENT WORK
        </span>
        <div className={s.heroGrid}>
          <h1>
            {category ? (
              category.name
            ) : (
              <>
                Masalah spesifik.
                <br />
                <em>Alat yang tepat.</em>
              </>
            )}
          </h1>
          <div>
            <p>
              {category?.description ||
                "Ruang untuk tools ringan yang membantu pekerjaan mandiri. Temukan alat untuk menghitung, membuat, menganalisis, dan menyederhanakan hari Anda."}
            </p>
            <span className={s.caption}>
              Dirancang untuk freelancer, kreator, dan builder.
            </span>
          </div>
        </div>
      </header>
      <nav className={s.categories} aria-label="Kategori Apps">
        <Link href="/apps" aria-current={!category ? "page" : undefined}>
          Semua Apps
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/apps/${c.slug}`}
            aria-current={category?.id === c.id ? "page" : undefined}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      <section className={s.library} aria-label="Katalog aplikasi">
        <div className={s.libraryHeading}>
          <h2>
            {category ? category.name : "Koleksi Apps"}
            <span>{filtered.length} aplikasi</span>
          </h2>
          <SlidersHorizontal size={20} />
        </div>
        <div className={s.filters}>
          <label className={s.search}>
            <Search size={18} />
            <input
              type="search"
              aria-label="Cari aplikasi"
              placeholder="Apa yang ingin Anda selesaikan?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={120}
            />
          </label>
          <label>
            Harga
            <select
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
            >
              <option value="">Semua harga</option>
              <option value="free">Gratis</option>
              <option value="freemium">Freemium</option>
              <option value="one_time">Sekali beli</option>
              <option value="subscription">Langganan</option>
              <option value="credits">Kredit</option>
            </select>
          </label>
          <label>
            Kebutuhan
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">Semua kebutuhan</option>
              {tags.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Urutkan
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Pilihan</option>
              <option value="newest">Terbaru</option>
              <option value="name">Nama A–Z</option>
            </select>
          </label>
        </div>
        {!available ? (
          <div className={s.empty} role="status">
            <Grid2X2 />
            <h3>Koleksi sedang disiapkan.</h3>
            <p>Katalog belum dapat dimuat. Silakan kembali lagi nanti.</p>
          </div>
        ) : filtered.length ? (
          <div className={s.grid}>
            {filtered.map((a) => (
              <Link
                className={s.card}
                key={a.id}
                href={appHref(a, categories)}
                onClick={() =>
                  trackEvent("select_content", {
                    content_type: "app",
                    item_id: a.id,
                  })
                }
              >
                {a.cover_url ? (
                  <Image
                    unoptimized
                    width={640}
                    height={400}
                    src={a.cover_url}
                    alt=""
                    loading="lazy"
                    className={s.cover}
                  />
                ) : (
                  <div className={s.cardArt}>
                    {a.icon_url ? (
                      <Image
                        unoptimized
                        src={a.icon_url}
                        alt=""
                        width={48}
                        height={48}
                      />
                    ) : (
                      <Grid2X2 size={40} />
                    )}
                    <span>KHADAFI APPS</span>
                  </div>
                )}
                <div className={s.cardBody}>
                  <span className={s.eyebrow}>
                    {categories.find((c) => c.id === a.category_id)?.name}
                    {a.featured ? " · PILIHAN" : ""}
                  </span>
                  <h3>
                    {a.name}
                    <ArrowUpRight size={20} />
                  </h3>
                  <p>{a.short_description}</p>
                  <div className={s.cardFoot}>
                    <span>{appPrice(a)}</span>
                    <small>
                      {a.status === "maintenance"
                        ? "Pemeliharaan"
                        : a.deployment === "external"
                          ? "Aplikasi eksternal"
                          : "Aplikasi web"}
                    </small>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={s.empty}>
            <Grid2X2 />
            <span className={s.eyebrow}>
              SEDIKIT DEMI SEDIKIT, LEBIH BERGUNA
            </span>
            <h3>
              {apps.length
                ? "Belum ada yang sesuai."
                : "Koleksi pertama sedang diracik."}
            </h3>
            <p>
              {apps.length
                ? "Coba kata kunci atau filter lain."
                : "Tools akan hadir di sini setelah siap digunakan. Sambil menunggu, jelajahi bekal kerja mandiri yang sudah tersedia."}
            </p>
            {apps.length ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setPricing("");
                  setTag("");
                }}
              >
                Hapus filter
              </button>
            ) : (
              <Link href="/freelance/tools">
                Jelajahi sumber daya <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        )}
      </section>
      <aside className={s.note}>
        <span>01 / FILOSOFI</span>
        <p>
          Satu alat, satu pekerjaan yang lebih ringan.
          <br />
          Setiap aplikasi memiliki fungsi, harga, dan batas penggunaan yang
          jelas.
        </p>
      </aside>
    </div>
  );
}
export function AppLaunch({ app }: { app: AppRecord }) {
  const open = app.status === "published" && app.pricing_model === "free";
  useEffect(() => {
    if (app.pricing_model !== "free")
      trackEvent("app_paywall_viewed", {
        app_id: app.id,
        pricing_model: app.pricing_model,
      });
  }, [app.id, app.pricing_model]);
  return (
    <div className={s.launch}>
      <strong>{appPrice(app)}</strong>
      <p>{app.access_terms || "Gunakan sesuai kebutuhan Anda."}</p>
      {open ? (
        <a
          href={app.destination}
          rel={
            app.deployment === "external" ? "noopener noreferrer" : undefined
          }
          onClick={() =>
            trackEvent("app_open", {
              app_id: app.id,
              deployment: app.deployment,
            })
          }
        >
          Buka aplikasi {app.deployment === "external" ? "eksternal" : ""}
          <ArrowUpRight size={18} />
        </a>
      ) : (
        <p role="status">
          {app.status === "maintenance"
            ? "Aplikasi sedang dalam pemeliharaan."
            : "Akses berbayar belum dibuka. Harga ditampilkan sebagai informasi."}
        </p>
      )}
      {app.deployment === "external" && (
        <small>
          Aplikasi ini dibuka di situs penyedia. Akun dan kebijakan layanannya
          dapat berbeda.
        </small>
      )}
    </div>
  );
}
