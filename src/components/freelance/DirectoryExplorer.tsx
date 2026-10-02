"use client";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Search, X, SlidersHorizontal } from "lucide-react";
import { FREELANCE_PLATFORMS } from "@/content/freelance-directory";
import styles from "./discovery.module.css";
const unique = (values: string[]) => [...new Set(values)].sort();
const fields = [
  { key: "type", label: "Jenis platform", options: unique(FREELANCE_PLATFORMS.map(p => p.type)) },
  { key: "field", label: "Bidang", options: unique(FREELANCE_PLATFORMS.flatMap(p => p.categories)) },
  { key: "region", label: "Cakupan", options: unique(FREELANCE_PLATFORMS.flatMap(p => p.regions)) },
  { key: "pricing", label: "Biaya", options: ["Gratis", "Freemium", "Berbayar"] },
  { key: "opportunity", label: "Tipe peluang", options: unique(FREELANCE_PLATFORMS.flatMap(p => p.opportunityTypes)) },
  { key: "level", label: "Level", options: unique(FREELANCE_PLATFORMS.flatMap(p => p.experienceLevels)) },
];
export function DirectoryExplorer() {
  const params = useSearchParams();
  const dialog = useRef<HTMLDialogElement>(null);
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "relevant";
  const filtered = FREELANCE_PLATFORMS.filter(p => {
    const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const text = `${p.name} ${p.description} ${p.categories.join(" ")} ${p.type} ${p.opportunityTypes.join(" ")}`.toLowerCase();
    return tokens.every(t => text.includes(t === "menulis" || t === "writer" ? "writing" : t === "desain" ? "design" : t)) &&
      (!params.get("type") || p.type === params.get("type")) &&
      (!params.get("field") || p.categories.includes(params.get("field")!)) &&
      (!params.get("region") || p.regions.includes(params.get("region")!)) &&
      (!params.get("pricing") || p.pricing === params.get("pricing")) &&
      (!params.get("opportunity") || p.opportunityTypes.includes(params.get("opportunity")!)) &&
      (!params.get("level") || p.experienceLevels.includes(params.get("level")!));
  }).sort((a, b) => sort === "az" ? a.name.localeCompare(b.name) : sort === "checked" ? b.lastCheckedAt.localeCompare(a.lastCheckedAt) : sort === "free" ? ["Gratis", "Freemium", "Berbayar"].indexOf(a.pricing) - ["Gratis", "Freemium", "Berbayar"].indexOf(b.pricing) : 0);
  const pages = Math.max(1, Math.ceil(filtered.length / 6));
  const page = Math.min(pages, Math.max(1, Number(params.get("page")) || 1));
  const rows = filtered.slice((page - 1) * 6, page * 6);
  const update = (key: string, value: string, replace = false) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    const url = `/freelance/direktori${next.size ? `?${next.toString()}` : ""}`;
    if (replace) window.history.replaceState(null, "", url); else window.history.pushState(null, "", url);
  };
  const reset = () => window.history.pushState(null, "", "/freelance/direktori");
  const control = (field: typeof fields[number], prefix: string) => <label key={field.key} htmlFor={`${prefix}-${field.key}`}>{field.label}<select id={`${prefix}-${field.key}`} value={params.get(field.key) ?? ""} onChange={e => update(field.key, e.target.value)}><option value="">Semua</option>{field.options.map(option => <option key={option}>{option}</option>)}</select></label>;
  const filters = (prefix: string) => <div className={styles.filterPanel}><div className={styles.filterGrid}>{fields.slice(0, 4).map(f => control(f, prefix))}</div><details><summary>Filter lanjutan · tipe peluang & level</summary><div className={styles.filterGrid}>{fields.slice(4).map(f => control(f, prefix))}</div><p className="text-xs leading-6 mt-4 text-[#697556]">Level beragam: persyaratan pengalaman mengikuti setiap listing. Cakupan internasional tidak menjamin akses dari semua negara.</p></details></div>;
  const active = fields.filter(f => params.get(f.key));
  return <div>
    <form role="search" className={styles.searchForm} onSubmit={e => e.preventDefault()}><div className={styles.searchField}><Search size={19} aria-hidden="true"/><input type="search" aria-label="Cari platform direktori" placeholder="Nama platform, bidang, atau jenis peluang…" value={q} onChange={e => update("q", e.target.value, true)} />{q && <button type="button" aria-label="Bersihkan pencarian platform" onClick={() => update("q", "")}><X size={18}/></button>}</div></form>
    <button className={styles.mobileFilter} type="button" onClick={() => dialog.current?.showModal()}><SlidersHorizontal size={16} className="inline mr-3"/>Filter & urutkan{active.length > 0 && ` · ${active.length}`}</button>
    <div>{filters("desktop")}</div>
    <dialog ref={dialog} className={styles.filterDialog} aria-labelledby="directory-filter-title"><div className={styles.dialogHead}><h2 id="directory-filter-title">Filter & urutkan</h2><button type="button" aria-label="Tutup filter" onClick={() => dialog.current?.close()}><X size={20}/></button></div>{filters("mobile")}<div className={styles.sort}><label htmlFor="mobile-sort">Urutkan<select id="mobile-sort" value={sort} onChange={e => update("sort", e.target.value)}><option value="relevant">Relevan</option><option value="checked">Terakhir diperiksa</option><option value="az">Nama A–Z</option><option value="free">Gratis lebih dulu</option></select></label></div><button type="button" className={styles.applyFilters} onClick={() => dialog.current?.close()}>Lihat {filtered.length} platform</button></dialog>
    {(active.length > 0 || q) && <div className={styles.chips}>{q && <button type="button" onClick={() => update("q", "")}>“{q}” <X size={13}/></button>}{active.map(f => <button type="button" key={f.key} aria-label={`Hapus filter ${f.label}: ${params.get(f.key)}`} onClick={() => update(f.key, "")}>{params.get(f.key)} <X size={13}/></button>)}<button type="button" onClick={reset}>Reset semua</button></div>}
    <div className={styles.listTop}><span role="status" aria-live="polite">{filtered.length} dari {FREELANCE_PLATFORMS.length} platform</span><div className={styles.sort}><label htmlFor="directory-sort">Urutkan<select id="directory-sort" value={sort} onChange={e => update("sort", e.target.value)}><option value="relevant">Relevan</option><option value="checked">Terakhir diperiksa</option><option value="az">Nama A–Z</option><option value="free">Gratis lebih dulu</option></select></label></div></div>
    <ul className={styles.rows}>{rows.map(p => <li key={p.slug}><Link href={`/freelance/direktori/${p.slug}`} className={styles.row}><span className={styles.monogram} aria-hidden="true">{p.name.split(" ").map(w => w[0]).join("").slice(0, 3)}</span><div><h2>{p.name}</h2><p>{p.description}</p><small>{p.type} · {p.categories.slice(0, 3).join(" / ")}</small></div><div className={styles.rowMeta}>{p.pricing}<br />Internasional<br />Belum dicoba langsung</div><ArrowUpRight size={20} aria-hidden="true" /></Link></li>)}</ul>
    {!rows.length && <div className={styles.empty}><p>Belum ada platform yang cocok dengan kombinasi ini.</p><button className={styles.textLink} type="button" onClick={reset}>Reset filter dan lihat semua platform ↗</button></div>}
    {pages > 1 && <nav aria-label="Halaman direktori" className={styles.pagination}><button type="button" disabled={page === 1} onClick={() => update("page", String(page - 1))} aria-label="Halaman sebelumnya">←</button>{Array.from({ length: pages }, (_, i) => <button key={i} type="button" aria-label={`Halaman ${i + 1}`} aria-current={page === i + 1 ? "page" : undefined} onClick={() => update("page", String(i + 1))}>{i + 1}</button>)}<button type="button" disabled={page === pages} onClick={() => update("page", String(page + 1))} aria-label="Halaman berikutnya">→</button></nav>}
    <div className={styles.safety}><strong>Sebelum melamar, cek dulu.</strong>Verifikasi domain perusahaan, identitas pengiklan, lingkup kerja, dan ketentuan pembayaran. Hindari permintaan transfer ke perekrut untuk menjamin pekerjaan. Biaya layanan resmi platform berbeda dari permintaan uang oleh pihak yang mengatasnamakan perekrut.</div>
  </div>;
}
