"use client";
import { useState } from "react";
import s from "./commerce.module.css";
export function GuestDownloads({ order, product }: { order: string; product: string }) {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  return <div className={s.form}><button className={s.button} disabled={busy} onClick={async () => { setBusy(true); setError(""); setFiles([]); try { const r = await fetch("/api/commerce/guest-download", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order, product }) }); const data = await r.json(); if (!r.ok) throw new Error(data.error); setFiles(data.files); } catch (e) { setError(e instanceof Error ? e.message : "Unduhan belum tersedia."); } finally { setBusy(false); } }}>{busy ? "Menyiapkan unduhan…" : "Unduh produk"}</button>{files.map(file => <a key={file.url} className={s.secondary} href={file.url}>{file.name} ↓</a>)}{files.length > 0 && <small>Link berlaku 15 menit. Buat link baru jika sudah kedaluwarsa.</small>}{error && <p role="alert">{error}</p>}</div>;
}
