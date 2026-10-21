import Link from "next/link";
import { Check, Clock, ArrowUpRight } from "lucide-react";
import { pageUser } from "@/lib/commerce-server";
import { money, statusLabel, type Order } from "@/lib/commerce-types";
import s from "@/components/commerce/commerce.module.css";
import { guestOrder } from "@/lib/guest-order";
import { GuestDownloads } from "@/components/commerce/GuestDownloads";
import { isAllowedDokuCheckoutUrl } from "@/lib/doku-checkout-host";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const guest = order ? await guestOrder(order) : null;
  const auth = guest ? null : await pageUser(
    "/checkout/success" + (order ? "?order=" + encodeURIComponent(order) : ""),
  );
  const { data } = guest ? { data: guest } : order && auth
    ? await auth.client
        .from("commerce_orders")
        .select("*,commerce_order_items(*)")
        .eq("user_id", auth.user.id)
        .eq("id", order)
        .maybeSingle()
    : { data: null };
  const o = data as Order | null;
  const paid = o?.status === "paid";
  const awaitingCheckout = o?.status === "pending" && !o.payment_url;
  const endedTitle = o ? { failed: "Pembayaran belum berhasil.", expired: "Waktu pembayaran berakhir.", cancelled: "Pesanan dibatalkan.", refunded: "Pembayaran dikembalikan.", pending: "Menunggu konfirmasi.", paid: "Bekalmu sudah siap." }[o.status] : "Periksa pesananmu.";
  return (
    <section className={s.success}>
      <div className={s.successIcon}>{paid ? <Check /> : <Clock />}</div>
      <span className={s.eyebrow}>YOUR ORDER</span>
      <h1>
        {paid
          ? "Bekalmu sudah siap."
          : awaitingCheckout
            ? "Halaman pembayaran belum siap."
          : o?.status === "pending"
            ? "Menunggu konfirmasi."
            : endedTitle}
      </h1>
      <p className={s.lead}>
        {paid
          ? "Terima kasih. Produk sudah terhubung ke akunmu dan bisa diakses dari library."
          : awaitingCheckout
            ? "Pesanan sudah tercatat, tetapi link pembayaran belum tersedia. Status pending belum berarti pembayaran sudah dilakukan."
          : o?.status === "pending"
            ? "Pembayaran akan dikonfirmasi otomatis. Jika kamu baru membayar, tunggu sebentar lalu periksa status kembali."
            : "Buka daftar pesanan untuk melihat status transaksi yang terhubung ke akunmu."}
      </p>
      {o && (
        <div className={s.summary} style={{ marginTop: 28 }}>
          <p>{o.commerce_order_items.map((i) => i.product_name).join(", ")}</p>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{statusLabel[o.status]}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{money(o.total)}</dd>
            </div>
          </dl>
          <small>Pesanan {o.id.slice(0, 8).toUpperCase()}</small>
          {guest && <p className={s.note}>Akses pesanan tersimpan di browser ini selama 30 hari. Untuk perangkat lain, masuk melalui email pembeli yang sama. Simpan nomor pesanan untuk bantuan.</p>}
          {guest && paid && o.commerce_order_items.map(item => <GuestDownloads key={item.product_id} order={o.id} product={item.product_id} />)}
        </div>
      )}
      <div className={s.actions}>
        <Link
          href={guest ? "/login?returnTo=" + encodeURIComponent(paid ? "/account/library" : "/account/orders") : paid ? "/account/library" : "/account/orders"}
          className={s.button}
        >
          {guest ? "Akses melalui email" : paid ? "Buka library" : "Lihat pesanan"} <ArrowUpRight />
        </Link>
        {o?.status === "pending" && (
          <a className={s.secondary} href={"/checkout/success?order=" + o.id}>
            Periksa status kembali
          </a>
        )}
        {o?.status === "pending" && o.payment_url && ((o.provider === "doku" && isAllowedDokuCheckoutUrl(o.payment_url, process.env.DOKU_IS_PRODUCTION === "true")) || (o.provider === "midtrans" && /^https:\/\/app(?:\.sandbox)?\.midtrans\.com\//.test(o.payment_url))) && <a className={s.secondary} href={o.payment_url}>Lanjutkan pembayaran <ArrowUpRight /></a>}
      </div>
    </section>
  );
}
