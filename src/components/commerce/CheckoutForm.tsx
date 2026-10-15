"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { money, type Product } from "@/lib/commerce-types";
import { commerceApi } from "./client-api";
import s from "./commerce.module.css";
export function CheckoutForm({
  product,
  email,
  name,
  available,
}: {
  product: Product;
  email: string;
  name: string;
  available: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [key] = useState(() => crypto.randomUUID());
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const result = await commerceApi("/api/commerce/orders", {
        method: "POST",
        body: JSON.stringify({
          slug: product.slug,
          name: data.get("name"),
          key,
        }),
      });
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
        <form className={s.form} onSubmit={submit} aria-label="Checkout produk">
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
            Email akun
            <input type="email" value={email} readOnly />
            <small>Produk akan terhubung ke akun dengan email ini.</small>
          </label>
          <label className={s.check}>
            <input type="checkbox" required />
            <span>
              Saya telah membaca <Link href="/terms">Syarat Penggunaan</Link>{" "}
              dan <Link href="/privacy">Kebijakan Privasi</Link>.
            </span>
          </label>
          {!available && (
            <div className={s.notice} role="status">
              Checkout produk ini belum dibuka. Silakan kembali beberapa saat
              lagi.
            </div>
          )}
          {error && (
            <div role="alert" className={s.notice + " " + s.error}>
              {error}
            </div>
          )}
          <button className={s.button} disabled={busy || !available}>
            {busy ? <LoaderCircle className={s.spin} /> : <ArrowUpRight />}
            {busy
              ? "Menyiapkan pesanan…"
              : product.price > 0
                ? "Lanjut bayar · " + money(product.price)
                : "Dapatkan gratis"}
          </button>
          <small>
            <LockKeyhole
              size={14}
              style={{ display: "inline", marginRight: 8 }}
            />
            {product.price > 0
              ? "Pembayaran diproses melalui Midtrans."
              : "Produk akan ditambahkan ke library akunmu."}
          </small>
        </form>
      </div>
      <aside className={s.summary}>
        <span className={s.eyebrow}>02 / PESANANMU</span>
        <h3>{product.name}</h3>
        <p>{product.category} · Produk digital</p>
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
