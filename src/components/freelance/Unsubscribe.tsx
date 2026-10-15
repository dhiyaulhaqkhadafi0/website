"use client";
import { useState } from "react";
import Link from "next/link";
import s from "./field-notes.module.css";
export function Unsubscribe() {
  const [state,setState] = useState("idle");
  const [error,setError] = useState("");
  async function stop() {
    if (state === "loading") return;
    setState("loading"); setError("");
    try {
      const token = window.location.hash.slice(1);
      const response = await fetch("/api/freelance/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Permintaan belum dapat diproses.");
      setState("success"); window.history.replaceState(null,"","/freelance/berhenti");
    } catch (e) { setState("error"); setError(e instanceof Error ? e.message : "Koneksi terputus. Coba lagi."); }
  }
  return <main className={s.unsubscribe}><span className={s.eyebrow}>Pembaruan Khadafi / Langganan</span><h1>{state === "success" ? "Langganan sudah dihentikan." : "Berhenti menerima pembaruan?"}</h1><p>{state === "success" ? "Preferensimu sudah tersimpan. Alamat emailmu tidak akan menerima newsletter berikutnya." : "Konfirmasikan di bawah. Membuka halaman ini saja tidak mengubah langgananmu."}</p>{error && <p role="alert">{error}</p>}{state === "success" ? <Link href="/">Kembali ke beranda ↗</Link> : <button type="button" disabled={state === "loading"} onClick={stop}>{state === "loading" ? "Menyimpan…" : "Ya, berhenti berlangganan"}</button>}</main>;
}
