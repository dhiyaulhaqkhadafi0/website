"use client";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Search, X, SlidersHorizontal, ShieldCheck, MoveRight } from "lucide-react";
import { FREELANCE_PLATFORMS } from "@/content/freelance-directory";
import { directoryResults, DIRECTORY_FIELDS } from "@/content/freelance-directory-query";
import { PlatformLogo } from "./PlatformLogo";
import styles from "./directory.module.css";

export function DirectoryExplorer() {
  const params = useSearchParams();
  const dialog = useRef<HTMLDialogElement>(null);
  const resultsHeading = useRef<HTMLDivElement>(null);
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "relevant";
  const { filtered, active, pages, page, rows } = directoryResults(FREELANCE_PLATFORMS, new URLSearchParams(params.toString()));
  const update = (key: string, value: string, replace = false) => {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    const url = `/freelance/direktori${next.size ? `?${next.toString()}` : ""}`;
    if (replace) window.history.replaceState(null, "", url); else window.history.pushState(null, "", url);
    if (key === "page") resultsHeading.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const reset = () => window.history.pushState(null, "", "/freelance/direktori");
  const control = (field: typeof DIRECTORY_FIELDS[number], prefix: string) => {
    const options = [...new Set(FREELANCE_PLATFORMS.flatMap(field.values))].sort();
    return <label key={field.key} htmlFor={`${prefix}-${field.key}`}>{field.label}<select id={`${prefix}-${field.key}`} value={active.find(f => f.key === field.key)?.value ?? ""} onChange={e => update(field.key, e.target.value)}><option value="">{field.short}</option>{options.map(option => <option key={option}>{option}</option>)}</select></label>;
  };
  const sortControl = (prefix: string) => <label htmlFor={`${prefix}-sort`}>Urutkan<select id={`${prefix}-sort`} value={sort} onChange={e => update("sort", e.target.value)}><option value="relevant">Relevan</option><option value="checked">Terakhir diperiksa</option><option value="az">Nama A–Z</option><option value="free">Gratis lebih dulu</option></select></label>;
  const filters = (prefix: string) => <><div className={styles.filterGrid}>{DIRECTORY_FIELDS.slice(0, 4).map(f => control(f, prefix))}</div><details className={styles.advanced}><summary>Filter lanjutan <span aria-hidden="true">+</span></summary><div className={styles.filterGrid}>{DIRECTORY_FIELDS.slice(4).map(f => control(f, prefix))}</div><p>Level mengikuti syarat platform atau listing. Semua entri saat ini belum dicoba langsung.</p></details></>;
  return <div className={styles.explorer}>
    <div className={styles.searchIntro}><div><span className={styles.kicker}>Kenali sebelum memilih</span><h2>Temukan jalur yang cocok.</h2></div><p>Mulai dari bidangmu, lalu cek model kerja dan biaya.</p></div>
    <form role="search" className={styles.searchSurface} onSubmit={e => e.preventDefault()}><Search size={22} strokeWidth={1.6} aria-hidden="true"/><input type="search" aria-label="Cari platform direktori" placeholder="Cari platform, bidang, atau jenis peluang..." value={q} onChange={e => update("q", e.target.value, true)} onKeyDown={e => { if (e.key === "Escape") update("q", ""); }} />{q && <button type="button" aria-label="Bersihkan pencarian platform" onClick={() => update("q", "")}><X size={18} aria-hidden="true"/></button>}</form>
    <div className={styles.suggestions}><span>Coba:</span>{["Remote jobs", "Writing", "Development", "Gratis", "Worldwide"].map(term => <button type="button" key={term} onClick={() => update("q", term)}>{term}<MoveRight size={12} aria-hidden="true"/></button>)}</div>
    <div className={styles.stickyRail}>{filters("desktop")}</div>
    <button className={styles.mobileFilter} type="button" onClick={() => dialog.current?.showModal()}><SlidersHorizontal size={17} aria-hidden="true"/>Filter & urutkan<span>{active.length ? `${active.length} aktif` : "Semua platform"}</span></button>
    <dialog ref={dialog} className={styles.filterDialog} aria-labelledby="directory-filter-title"><div className={styles.dialogHead}><h2 id="directory-filter-title">Filter & urutkan</h2><button type="button" aria-label="Tutup filter" onClick={() => dialog.current?.close()}><X size={20} aria-hidden="true"/></button></div>{filters("mobile")}<div className={styles.mobileSort}>{sortControl("mobile")}</div><div className={styles.dialogActions}><button type="button" onClick={reset}>Reset semua</button><button type="button" onClick={() => dialog.current?.close()}>Lihat {filtered.length} platform <ArrowUpRight size={16} aria-hidden="true"/></button></div></dialog>
    {(active.length > 0 || q) && <div className={styles.chips}>{q && <button type="button" aria-label="Hapus kata pencarian" onClick={() => update("q", "")}>“{q}” <X size={13} aria-hidden="true"/></button>}{active.map(f => <button type="button" key={f.key} aria-label={`Hapus filter ${f.label}: ${f.value}`} onClick={() => update(f.key, "")}>{f.value} <X size={13} aria-hidden="true"/></button>)}<button type="button" onClick={reset}>Reset semua</button></div>}
    <div className={styles.listTop} ref={resultsHeading}><div><span role="status" aria-live="polite"><strong>{filtered.length}</strong> dari {FREELANCE_PLATFORMS.length} platform</span><small>Informasi publik · belum dicoba langsung</small></div><div className={styles.sort}>{sortControl("directory")}</div></div>
    <ul className={styles.rows}>{rows.map(p => <li key={p.slug}><Link href={`/freelance/direktori/${p.slug}`} className={styles.row}><PlatformLogo name={p.name} logo={p.logo}/><div className={styles.rowContent}><span className={styles.rowType}>{p.type}</span><h2>{p.name}</h2><p>{p.description}</p><small>{p.categories.join(" · ")}</small><div className={styles.rowMeta}><span>{p.pricing}</span><span>{p.regions.join(" / ")}</span><span>Belum dicoba langsung</span></div></div><span className={styles.rowAction}>Lihat detail<ArrowUpRight size={18} aria-hidden="true"/></span></Link></li>)}</ul>
    {!rows.length && <div className={styles.empty}><Search size={30} strokeWidth={1.3} aria-hidden="true"/><h3>Belum menemukan kecocokan.</h3><p>Coba bidang lain atau lepaskan satu filter. Kamu bisa mulai lagi dari seluruh direktori.</p><button type="button" onClick={reset}>Reset pencarian & filter <ArrowUpRight size={16} aria-hidden="true"/></button></div>}
    {pages > 1 && <nav aria-label="Halaman direktori" className={styles.pagination}><button type="button" disabled={page === 1} onClick={() => update("page", String(page - 1))} aria-label="Halaman sebelumnya">←</button>{Array.from({ length: pages }, (_, i) => <button key={i} type="button" aria-label={`Halaman ${i + 1}`} aria-current={page === i + 1 ? "page" : undefined} onClick={() => update("page", String(i + 1))}>{i + 1}</button>)}<button type="button" disabled={page === pages} onClick={() => update("page", String(page + 1))} aria-label="Halaman berikutnya">→</button></nav>}
    <div className={styles.safety}><ShieldCheck size={26} strokeWidth={1.4} aria-hidden="true"/><div><strong>Sebelum melamar, cek dulu.</strong><p>Verifikasi domain perusahaan dan identitas perekrut. Pahami scope serta pembayaran sebelum mulai; hindari transfer ke pihak tidak resmi untuk menjamin pekerjaan. Bagikan dokumen sensitif hanya setelah tujuan dan penerimanya jelas.</p><span>Biaya resmi platform berbeda dari permintaan uang oleh pihak yang mengatasnamakan perekrut.</span></div></div>
  </div>;
}
