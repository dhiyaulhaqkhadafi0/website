"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { FreelanceLeadReport } from "@/lib/freelance-leads-types";
import s from "./leads-dashboard.module.css";

export function FreelanceLeadsDashboard({ page, status, source }: { page: number; status: string; source: string }) {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [loaded, setLoaded] = useState<{ token: string; report: FreelanceLeadReport } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (mounted) setToken(data.session?.access_token || null);
    }).catch(() => { if (mounted) setToken(null); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setToken(session?.access_token || null));
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), ...(status ? { status } : {}), ...(source ? { source } : {}) });
    void fetch(`/api/studio/freelance?${params}`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal,
    }).then(async response => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Data subscriber belum dapat dimuat.");
      if (!controller.signal.aborted) { setLoaded({ token, report: body }); setError(""); }
    }).catch(reason => {
      if (!controller.signal.aborted) { setLoaded(null); setError(reason instanceof Error ? reason.message : "Koneksi terputus."); }
    });
    return () => controller.abort();
  }, [token, page, status, source]);
  const pagination = (next: number) => `/studio/freelance?${new URLSearchParams({ page: String(next), ...(status ? { status } : {}), ...(source ? { source } : {}) })}`;
  // The API verifies the user and Studio allowlist; RLS independently applies.
  const report = token && loaded?.token === token ? loaded.report : null;
  const stats = report?.stats;
  return <main className={s.dashboard}>
    <Link href="/studio">← Blog Studio</Link>
    <p className={s.eyebrow}>Studio / Freelance Field Notes</p>
    <h1>Orang di balik perjalanan.</h1>
    <p>Subscriber yang memberi persetujuan melalui form Freelance Hub. Waktu laporan: Asia/Jakarta.</p>
    {token === undefined && <p role="status">Memeriksa sesi Studio…</p>}
    {token === null && <p>Masuk melalui <Link href="/studio">Blog Studio</Link>, lalu kembali ke halaman Field Notes. Hanya admin yang dapat membuka data subscriber.</p>}
    {token && error && <p role="alert">{error} <Link href="/studio">Buka Blog Studio</Link></p>}
    {token && !error && !report && <p role="status">Memuat subscriber…</p>}
    {stats && report && <>
      <div className={s.stats}>{[["Total subscriber", stats.total], ["Aktif", stats.active], ["Bulan ini", stats.this_month], ["Berhenti", stats.unsubscribed]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className={s.breakdown}>
        <section><h2>Pendaftaran bulanan</h2>{stats.months.length ? stats.months.map(m => <p key={m.month}><span>{m.month}</span><strong>{m.subscribers}</strong></p>) : <p>Belum ada pendaftaran.</p>}</section>
        <section><h2>Sumber pendaftaran</h2>{stats.sources.length ? stats.sources.map(m => <p key={m.source}><span>{m.source}</span><strong>{m.subscribers}</strong></p>) : <p>Belum ada sumber.</p>}<small>Pendaftaran tidak otomatis mengirim kampanye. Pengiriman email menggunakan daftar berstatus aktif.</small></section>
      </div>
      <form className={s.filters}>
        <label>Status<select name="status" defaultValue={status}><option value="">Semua status</option><option value="active">Aktif</option><option value="unsubscribed">Berhenti</option></select></label>
        <label>Sumber<select name="source" defaultValue={source}><option value="">Semua sumber</option><option value="freelance_hub">Freelance Hub</option><option value="freelance_jobs">Job Board</option></select></label>
        <button type="submit">Terapkan</button>
      </form>
      <div className={s.tableWrap}><table><caption>{report.count} subscriber · halaman {page}</caption><thead><tr><th>Nama / Email</th><th>Status</th><th>Sumber / Kampanye</th><th>Terdaftar</th></tr></thead><tbody>{report.leads.map(lead => <tr key={lead.id}><td>{lead.name}<small>{lead.email}</small></td><td>{lead.status === "active" ? "Aktif" : "Berhenti"}</td><td>{lead.source}<small>{[lead.utm_source, lead.utm_campaign].filter(Boolean).join(" / ") || "Tanpa UTM"}</small></td><td>{new Date(lead.created_at).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" })}</td></tr>)}</tbody></table></div>
      {!report.leads.length && <p>Belum ada subscriber untuk filter ini.</p>}
      <nav className={s.pagination} aria-label="Halaman subscriber">{page > 1 && <Link href={pagination(page - 1)}>← Sebelumnya</Link>}{page * 50 < report.count && <Link href={pagination(page + 1)}>Berikutnya →</Link>}</nav>
    </>}
  </main>;
}
