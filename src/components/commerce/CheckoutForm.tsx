"use client";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { money, type Product } from "@/lib/commerce-types";
import { commerceApi } from "./client-api";
import s from "./commerce.module.css";
import { supabase } from "@/lib/supabase";
import { ProductImage } from "./ProductImage";
import { CREATOR_NAME } from "@/lib/product-media";
import { CHECKOUT_METHODS, isCheckoutMethod } from "@/lib/checkout-methods";
const subscribeHydration = () => () => {};
export function CheckoutForm({
  product,
  email,
  name,
  available,
  guestEnabled = false,
  qrisAvailable = false,
  providerMethods = false,
}: {
  product: Product;
  email: string;
  name: string;
  available: boolean;
  guestEnabled?: boolean;
  qrisAvailable?: boolean;
  providerMethods?: boolean;
}) {
  const router = useRouter();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const intentStorageKey = "khadafi-checkout-" + product.slug + ":" + (email.trim().toLowerCase() || "guest");
  const [key, setKey] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = sessionStorage.getItem(intentStorageKey);
      if (saved && /^[0-9a-f-]{36}$/i.test(saved)) return saved;
      const next = crypto.randomUUID(); sessionStorage.setItem(intentStorageKey, next); return next;
    } catch { return crypto.randomUUID(); }
  });
  const [choice, setChoice] = useState(() => {
    if (typeof window !== "undefined") {
      try { const saved = sessionStorage.getItem("khadafi-checkout-method-" + key); if (isCheckoutMethod(saved)) return { method: saved, locked: true }; } catch {}
    }
    return { method: "all", locked: false };
  });
  const methods = CHECKOUT_METHODS.filter(m => providerMethods || m.code === "all" || m.code === "VIRTUAL_ACCOUNT_BANK_MANDIRI" || (qrisAvailable && m.code === "QRIS"));
  const groups = [...new Set(methods.map(m => m.group))];
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const method = choice.method;
      setChoice({ method, locked: true });
      try { sessionStorage.setItem("khadafi-checkout-method-" + key, method); } catch {}
      const { data: session } = await supabase.auth.getSession();
      const body = JSON.stringify({ slug: product.slug, name: data.get("name"), email: data.get("email"), consent: data.get("consent") === "on", key, method });
      const result = session.session ? await commerceApi("/api/commerce/orders", {
        method: "POST",
        body,
      }) : await fetch("/api/commerce/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body }).then(async r => { const payload = await r.json(); if (!r.ok) throw new Error(payload.error || "Checkout gagal."); return payload; });
      if (result.payment_url) window.location.assign(result.payment_url);
      else router.push("/checkout/success?order=" + result.order_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout gagal. Coba lagi.");
      setBusy(false);
    }
  }
  return (
    <div className={s.checkout}>
      <div>
        <span className={s.eyebrow}>01 / INFORMASI PEMBELI</span>
        <form className={s.form} method="post" action="/api/commerce/orders" onSubmit={submit} aria-label="Checkout produk">
          <label>
            Nama lengkap
            <input
              name="name"
              autoComplete="name"
              defaultValue={name}
              maxLength={120}
              required
            />
          </label>
          <label>
            Email pembeli
            <input type="email" name="email" autoComplete="email" defaultValue={email} readOnly={Boolean(email)} maxLength={254} required />
            <small>{email ? "Produk terhubung ke library akunmu." : guestEnabled ? "Simpan halaman pesanan untuk mengakses pembelian pada browser ini." : "Masuk untuk menghubungkan pembelian dengan library akunmu."}</small>
          </label>
          <label className={s.check}>
            <input type="checkbox" name="consent" required />
            <span>
              Saya telah membaca <Link href="/terms">Syarat Penggunaan</Link>{" "}
              dan <Link href="/privacy">Kebijakan Privasi</Link>. Email digunakan untuk identitas pembelian dan library digital.
            </span>
          </label>
          {product.price > 0 && <div className={s.paymentMethods}>
            <span className={s.eyebrow}>02 / METODE PEMBAYARAN</span>
            <p>Pilih caramu membayar. QRIS dapat dipindai dengan GoPay atau aplikasi bank. Ketersediaan akhir mengikuti ketentuan dan nominal pada DOKU.</p>
            {groups.map(group => <fieldset className={s.methodGroup} key={group} disabled={busy || (hydrated && choice.locked)}>
              <legend>{group}</legend><div className={s.methodGrid}>{methods.filter(m => m.group === group).map(m => <label key={m.code}>
                <input type="radio" name="paymentMethod" value={m.code} checked={(hydrated ? choice.method : "all") === m.code} onChange={() => setChoice({ method: m.code, locked: false })} />
                <span><strong>{m.label}</strong>{group !== "Bank / Virtual Account" && <small>{m.detail}</small>}</span>
              </label>)}</div>
            </fieldset>)}
            {hydrated && choice.locked && <p>Metode pesanan ini sudah dipilih. Jika pembayaran belum selesai, lanjutkan pesanan yang sama melalui Riwayat Pembelian atau tautan email DOKU.</p>}
          </div>}
          {!available && (
            <div className={s.notice} role="status">
              Checkout produk ini belum dibuka. Silakan kembali beberapa saat
              lagi.
            </div>
          )}
          {error && (
            <div role="alert" className={s.notice + " " + s.error}>
              {error}
              {email && (error.includes("diverifikasi") || error.includes("pesanan")) && <p><Link href="/account/orders">Periksa pesanan saya ↗</Link></p>}
            </div>
          )}
          {error.includes("berakhir") && <button type="button" className={s.secondary} onClick={() => { const next = crypto.randomUUID(); setKey(next); setChoice({ method: "all", locked: false }); try { sessionStorage.setItem(intentStorageKey, next); } catch {} setError(""); }}>Mulai pesanan baru</button>}
          {!email && !guestEnabled && <Link className={s.secondary} href={"/login?returnTo=" + encodeURIComponent("/checkout/" + product.slug)}>Masuk untuk membeli ↗</Link>}
          <button className={s.button} disabled={!hydrated || busy || !available || (!email && !guestEnabled)}>
            {busy ? <LoaderCircle className={s.spin} /> : <ArrowUpRight />}
            {busy
              ? "Menyiapkan pesanan…"
              : product.price > 0
                ? "Lanjut bayar · " + money(product.price)
                : "Dapatkan gratis"}
          </button>
          <noscript><p>Aktifkan JavaScript untuk checkout aman. Informasi pembeli tidak dikirim melalui URL.</p></noscript>
          <small>
            <LockKeyhole
              size={14}
              style={{ display: "inline", marginRight: 8 }}
            />
            {product.price > 0
              ? "Pembayaran diproses secara aman melalui DOKU."
              : "Produk akan ditambahkan ke library akunmu."}
          </small>
        </form>
      </div>
      <aside className={s.summary}>
        <span className={s.eyebrow}>03 / PESANANMU</span>
        <ProductImage src={product.cover_url} alt={product.name} className={s.checkoutCover} eager />
        <h3>{product.name}</h3>
        <p>{product.category} · {product.creator_name || CREATOR_NAME}</p>
        <dl>
          <div>
            <dt>Harga produk</dt>
            <dd>{money(product.price)}</dd>
          </div>
          <div className={s.total}>
            <dt>Total</dt>
            <dd>{money(product.price)}</dd>
          </div>
        </dl>
        <p className={s.note}>
          Akses produk tersedia di library setelah pesanan dikonfirmasi.
        </p>
      </aside>
    </div>
  );
}
