import Link from "next/link";
import { Check, Clock, ArrowUpRight } from "lucide-react";
import { pageUser } from "@/lib/commerce-server";
import { money, statusLabel, type Order } from "@/lib/commerce-types";
import s from "@/components/commerce/commerce.module.css";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const auth = await pageUser(
    "/checkout/success" + (order ? "?order=" + encodeURIComponent(order) : ""),
  );
  const { data } = order
    ? await auth.client
        .from("commerce_orders")
        .select("*,commerce_order_items(*)")
        .eq("user_id", auth.user.id)
        .eq("id", order)
        .maybeSingle()
    : { data: null };
  const o = data as Order | null;
  const paid = o?.status === "paid";
  return (
    <section className={s.success}>
      <div className={s.successIcon}>{paid ? <Check /> : <Clock />}</div>
      <span className={s.eyebrow}>YOUR ORDER</span>
      <h1>
        {paid
          ? "Bekalmu sudah siap."
          : o?.status === "pending"
            ? "Menunggu konfirmasi."
            : "Periksa pesananmu."}
      </h1>
      <p className={s.lead}>
        {paid
          ? "Terima kasih. Produk sudah terhubung ke akunmu dan bisa diakses dari library."
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
        </div>
      )}
      <div className={s.actions}>
        <Link
          href={paid ? "/account/library" : "/account/orders"}
          className={s.button}
        >
          {paid ? "Buka library" : "Lihat pesanan"} <ArrowUpRight />
        </Link>
        {o?.status === "pending" && (
          <a className={s.secondary} href={"/checkout/success?order=" + o.id}>
            Periksa status kembali
          </a>
        )}
      </div>
    </section>
  );
}
