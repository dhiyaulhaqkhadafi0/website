"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, ShieldCheck } from "lucide-react";
import { filterRemoteJobs, type RemoteJob } from "@/content/freelance-jobs";
import s from "./jobs.module.css";

export function JobsExplorer({ jobs }: { jobs: RemoteJob[] }) {
  const params = useSearchParams();
  const results = filterRemoteJobs(jobs, new URLSearchParams(params.toString()));
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    window.history.replaceState(null, "", `/freelance/jobs${next.size ? `?${next}` : ""}`);
  }
  const controls = [
    { key: "location", label: "Lokasi kandidat", options: ["Indonesia", "Negara tertentu"] },
    { key: "field", label: "Bidang", options: ["Development", "Design", "Data", "Marketing", "Writing", "Customer Support"] },
    { key: "level", label: "Tingkatan", options: ["Pemula", "Intermediate", "Expert"] },
    { key: "employment", label: "Jenis kontrak", options: ["Full-time", "Part-time", "Contract", "Freelance", "Periksa sumber"] },
  ];
  return <section className={s.explorer} id="jobs-list" aria-label="Cari lowongan remote">
    <div className={s.intro}><div><span className={s.eyebrow}>Cari peran, bukan platform</span><h2>Satu langkah lebih dekat.</h2></div><p>Mulai dari keahlianmu.<br/>Cek lokasi sebelum melamar.</p></div>
    <form className={s.search} role="search" onSubmit={e => e.preventDefault()}><Search size={20} aria-hidden="true"/><input type="search" aria-label="Cari posisi, perusahaan, atau skill" placeholder="Cari posisi, perusahaan, atau skill…" value={params.get("q") || ""} onChange={e => update("q", e.target.value)}/></form>
    <div className={s.filters}>{controls.map(f => <label key={f.key}>{f.label}<select value={params.get(f.key) || ""} onChange={e => update(f.key, e.target.value)}><option value="">Semua {f.key === "location" ? "lokasi" : f.key === "employment" ? "kontrak" : f.label.toLowerCase()}</option>{f.options.map(o => <option key={o}>{o}</option>)}</select></label>)}</div>
    <div className={s.resultBar}><p role="status" aria-live="polite"><strong>{results.length}</strong> lowongan dalam kurasi</p><button type="button" onClick={() => window.history.replaceState(null, "", "/freelance/jobs")}>Reset filter</button><label>Urutkan<select value={params.get("sort") || "recent"} onChange={e => update("sort", e.target.value)}><option value="recent">Terakhir diperiksa</option><option value="az">Posisi A–Z</option></select></label></div>
    <div className={s.jobs}>{results.map(job => <article key={job.id} className={s.job}>
      <div className={s.jobTop}><span>{job.company}</span><span className={s.status}><i/>Tercantum saat diperiksa</span></div>
      <h3>{job.title}</h3><p>{job.summary}</p>
      <ul className={s.tags} aria-label="Ringkasan lowongan"><li>Remote</li><li>{job.employment}</li><li>{job.level}</li><li>{job.field}</li><li>Indonesia tercantum</li></ul>
      <details><summary>Lokasi, persyaratan & kompensasi</summary><dl><dt>Lokasi kandidat</dt><dd>{job.locationNote}</dd><dt>Persyaratan</dt><dd>{job.requirements}</dd><dt>Kompensasi</dt><dd>{job.salary}</dd></dl></details>
      <div className={s.jobBottom}><small>Diperiksa <time dateTime={job.verifiedAt}>{new Date(`${job.verifiedAt}T00:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time> · Sumber: perusahaan</small><a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Lihat lowongan ${job.title} di situs resmi (tab baru)`}>Lihat lowongan resmi <ArrowUpRight size={17} aria-hidden="true"/></a></div>
    </article>)}</div>
    {!results.length && <div className={s.empty}><Search size={30} aria-hidden="true"/><h3>Belum ada peran yang cocok.</h3><p>{jobs.length ? "Kurasi saat ini belum mencakup kombinasi ini. Coba lepaskan filter atau daftar Field Notes untuk kurasi berikutnya." : "Belum ada lowongan yang masih dalam masa pemeriksaan. Jelajahi platform sambil menunggu kurasi berikutnya."}</p><Link href="/freelance#field-notes">Ikuti Freelance Field Notes ↗</Link><Link href="/freelance/direktori">Jelajahi direktori platform ↗</Link></div>}
    <aside className={s.safety}><ShieldCheck size={24} aria-hidden="true"/><div><strong>Remote tetap punya batas.</strong><p>Kurasi diperiksa secara manual. Listing disembunyikan saat masa pemeriksaannya berakhir; lowongan bisa ditutup lebih awal. Pastikan status, negara, jam kerja, dan kontrak di situs perusahaan; jangan mengirim uang untuk menjamin diterima bekerja.</p></div></aside>
  </section>;
}
