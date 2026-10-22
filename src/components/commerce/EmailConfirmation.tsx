"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ArrowUpRight, Check, MailCheck, RefreshCw } from "lucide-react";
import { readConfirmationInput, verifyEmailConfirmation, type ConfirmationInput } from "@/lib/email-confirmation";
import s from "./email-confirmation.module.css";

export function EmailConfirmation({ url, publicKey }: { url: string; publicKey: string }) {
  const [status, setStatus] = useState<"checking" | "ready" | "success" | "invalid" | "missing">("checking");
  const captured = useRef<ConfirmationInput | null>(null);
  const client = useRef<SupabaseClient | null>(null);
  const operation = useRef<Promise<boolean> | null>(null);
  function authClient() {
    return client.current ??= createClient(url, publicKey, { global: { fetch: async (input, init) => {
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 20000);
      try { return await fetch(input, { ...init, signal: controller.signal }); } finally { clearTimeout(timeout); }
    } }, auth: {
      persistSession: false, autoRefreshToken: false, detectSessionInUrl: false,
      storageKey: "khadafi-email-confirmation",
    } });
  }
  useEffect(() => {
    let active = true;
    captured.current ??= readConfirmationInput(location.hash, location.search);
    // Credentials are kept only in memory, never forwarded to navigation/logs.
    history.replaceState(history.state, "", location.pathname);
    const input = captured.current;
    if (input.kind === "session") operation.current ??= verifyEmailConfirmation(input, authClient().auth).catch(() => false);
    void (operation.current || Promise.resolve(null)).then(result => {
      if (active) setStatus(result === null ? input.kind === "token" ? "ready" : input.kind === "missing" ? "missing" : "invalid" : result ? "success" : "invalid");
    });
    return () => { active = false; };
    // The callback reads its initial URL once, including under Strict Mode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function confirm() {
    if (status !== "ready" || !captured.current) return;
    setStatus("checking");
    try { setStatus(await verifyEmailConfirmation(captured.current, authClient().auth) ? "success" : "invalid"); }
    catch { setStatus("invalid"); }
    captured.current = null;
  }
  const title = status === "success" ? "Emailmu sudah terkonfirmasi."
    : status === "ready" ? "Satu langkah untuk mulai."
    : status === "checking" ? "Memeriksa konfirmasi email…"
    : status === "missing" ? "Buka tautan dari emailmu."
    : "Tautan belum dapat digunakan.";
  return <div className={`${s.page} notranslate`} translate="no">
    <header><Link href="/" aria-label="Khadafi — beranda">khadafi<span>.</span></Link><span>SATU AKUN KHADAFI</span></header>
    <section className={s.card} aria-live="polite" aria-busy={status === "checking"}>
      <div className={s.seal} aria-hidden="true">{status === "success" ? <Check /> : status === "checking" ? <RefreshCw className={s.spin} /> : <MailCheck />}</div>
      <p className={s.kicker}>SELAMAT DATANG DI PERJALANANMU</p>
      <h1>{title}</h1>
      <p>{status === "success" ? "Terima kasih sudah bergabung dengan Khadafi. Akunmu siap digunakan. Silakan masuk untuk menjelajahi produk dan library digitalmu."
        : status === "ready" ? "Terima kasih sudah mendaftar. Tekan tombol di bawah untuk memastikan alamat email ini milikmu."
        : status === "checking" ? "Sebentar, kami sedang memeriksa tautanmu dengan aman."
        : status === "missing" ? "Gunakan tombol Konfirmasi email saya pada email pendaftaran Khadafi. Halaman ini tidak mengonfirmasi akun tanpa tautan yang valid."
        : "Tautan mungkin sudah dipakai atau kedaluwarsa. Jika sebelumnya sudah dikonfirmasi, silakan masuk. Jika belum, daftar kembali dengan email yang sama untuk meminta konfirmasi baru."}</p>
      {status === "ready" && <button className={s.primary} type="button" onClick={confirm}>Konfirmasi email saya <ArrowUpRight size={17} /></button>}
      {status !== "checking" && <Link className={status === "success" ? s.primary : s.secondary} href="/login">{status === "success" ? "Lanjut ke halaman masuk" : "Kembali ke halaman masuk"} <ArrowUpRight size={17} /></Link>}
      {(status === "invalid" || status === "missing") && <Link className={s.secondary} href="/register">Buka halaman pendaftaran</Link>}
      <small>Konfirmasi ini tidak menjalankan pembelian atau pembayaran.</small>
    </section>
    <p className={s.footnote}>Ide kecil. Karya berarti. Perjalananmu dimulai di sini.</p>
  </div>;
}
