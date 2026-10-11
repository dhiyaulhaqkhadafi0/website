"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail } from "lucide-react";
import s from "./field-notes.module.css";
export function FreelanceSubscribe() {
  const [state, setState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage] = useState("");
  const [manageUrl, setManageUrl] = useState("");
  const sending = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const fields = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    sending.current = true; setState("loading"); setMessage("");
    try {
      const response = await fetch("/api/freelance/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fields.get("name"), email: fields.get("email"), consent: fields.get("consent") === "on", website: fields.get("website"), source: "freelance_hub", utm_source: params.get("utm_source"), utm_campaign: params.get("utm_campaign") }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Pendaftaran belum dapat disimpan.");
      setMessage(data.message); setManageUrl(data.manageUrl || ""); setState("success");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Koneksi terputus. Silakan coba lagi."); setState("error"); }
    finally { sending.current = false; }
  }
  return <section id="field-notes" className={s.section} aria-labelledby="field-notes-title"><div className={s.container}>
    <div className={s.copy}><span className={s.eyebrow}><Mail size={15} aria-hidden="true"/>Freelance Field Notes</span><h2 id="field-notes-title">Peluang berikutnya.<br/><span>Langsung ke inboxmu.</span></h2><p>Catatan untuk membangun karier tanpa kantor: lowongan remote pilihan, platform yang layak dikenali, dan sumber daya untuk bekerja lebih baik.</p><div className={s.topics}><span>01 / Peluang</span><span>02 / Platform</span><span>03 / Sumber daya</span></div></div>
    <div className={s.formSurface}>{state === "success" ? <div className={s.success} role="status"><Check size={28} aria-hidden="true"/><h3>Terima kasih sudah bergabung.</h3><p>{message}</p>{manageUrl && <p><Link href={manageUrl}>Simpan tautan kelola langganan ↗</Link><small>Tautan pribadi ini memungkinkan kamu berhenti berlangganan. Simpan sebelum menutup halaman.</small></p>}<Link href="/freelance/jobs">Jelajahi peluang sekarang <ArrowRight size={16} aria-hidden="true"/></Link></div> : <form onSubmit={submit} aria-busy={state === "loading"}>
      <label htmlFor="field-notes-name">Nama kamu<input id="field-notes-name" name="name" autoComplete="given-name" placeholder="Nama panggilanmu" minLength={2} maxLength={100} required disabled={state === "loading"}/></label>
      <label htmlFor="field-notes-email">Alamat email<input id="field-notes-email" name="email" type="email" autoComplete="email" placeholder="kamu@email.com" maxLength={254} required disabled={state === "loading"}/></label>
      <div className={s.trap} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className={s.consent}><input type="checkbox" name="consent" required disabled={state === "loading"}/><span>Saya setuju menerima Freelance Field Notes melalui email dan telah membaca <Link href="/privacy">Kebijakan Privasi</Link>.</span></label>
      {state === "error" && <p role="alert" className={s.error}>{message}</p>}
      <button type="submit" disabled={state === "loading"}>{state === "loading" ? "Menyimpan pendaftaran…" : "Gabung gratis"}<ArrowRight size={17} aria-hidden="true"/></button>
      <p className={s.note}>Gratis. Berhenti kapan saja lewat tautan kelola langganan atau tautan pada email Field Notes.</p>
    </form>}</div>
  </div></section>;
}
