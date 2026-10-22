"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { commerceApi } from "./client-api";
import s from "./commerce.module.css";
export function PaymentQa({ qrisReady, freeReady, environment }: { qrisReady: boolean; freeReady: boolean; environment: string }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const keys = useRef<Record<string,string>>({});
  const router = useRouter();
  async function start(mode: "free" | "qris") {
    setBusy(true); setError("");
    keys.current[mode] ||= crypto.randomUUID();
    try {
      const result = await commerceApi("/api/studio/commerce/payment-qa", { method: "POST", body: JSON.stringify({ key: keys.current[mode], mode }) });
      if (result.payment_url) window.location.assign(result.payment_url);
      else router.push("/checkout/success?order=" + result.order_id);
    } catch (e) { setError(e instanceof Error ? e.message : "QA unavailable"); setBusy(false); }
  }
  return <section className={s.section}>
    <span className={s.eyebrow}>PRIVATE QA / {environment}</span><h1>DOKU Live Payment QA</h1>
    <p>Uji pembayaran privat Rp1.000. Produk uji tidak tampil di katalog dan tidak mengubah harga produk publik. Setelah pembayaran terverifikasi, periksa akses berkas melalui library akunmu.</p>
    <p>Mulai checkout uang asli hanya setelah persetujuan khusus pemilik. Bayar sendiri melalui aplikasi pembayaran; periksa nominal akhir dan biaya sebelum mengonfirmasi.</p>
    {!qrisReady && <p role="status">QRIS belum siap untuk pengujian. Perlu status ACTIVE, konfigurasi tervalidasi dan izin khusus tes live.</p>}
    <div className={s.actions}><button className={s.button} disabled={busy || !qrisReady} onClick={() => start("qris")}>Checkout QRIS · Rp1.000</button>
    <button className={s.secondary} disabled={busy || !freeReady} onClick={() => start("free")}>Uji akses gratis · Rp0</button></div>
    <p>Uji Rp0 hanya menguji pemberian akses. Uji ini tidak menghubungi DOKU atau membuktikan pembayaran live.</p>
    {error && <p role="alert">{error}</p>}
  </section>;
}
