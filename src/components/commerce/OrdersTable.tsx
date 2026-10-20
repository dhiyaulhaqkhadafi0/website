import Link from "next/link";
import { money, statusLabel, type Order } from "@/lib/commerce-types";
import { isAllowedDokuCheckoutUrl } from "@/lib/doku-checkout-host";
import s from "./commerce.module.css";
export function OrdersTable({
  orders,
  studio = false,
}: {
  orders: Order[];
  studio?: boolean;
}) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>Pesanan / Produk</th>
            {studio && <th>Pelanggan</th>}
            <th>Tanggal</th>
            <th>Total</th>
            <th>Status</th>
            <th>{studio ? "Provider" : "Aksi"}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td data-label="Pesanan">
                <div>
                  <strong>{o.id.slice(0, 8).toUpperCase()}</strong>
                  <small>
                    {o.commerce_order_items
                      .map((i) => i.product_name)
                      .join(", ")}
                  </small>
                </div>
              </td>
              {studio && (
                <td data-label="Pelanggan">
                  <div>
                    {o.customer_name}
                    <small>{o.customer_email}</small>
                  </div>
                </td>
              )}
              <td data-label="Tanggal">
                {new Date(o.created_at).toLocaleDateString("id-ID", {
                  timeZone: "Asia/Jakarta",
                })}
              </td>
              <td data-label="Total">{money(o.total)}</td>
              <td data-label="Status">
                <span className={s.status}>{statusLabel[o.status]}</span>
              </td>
              <td data-label={studio ? "Provider" : "Aksi"}>
                {studio ? (
                  o.provider
                ) : (
                  <Link href={"/checkout/success?order=" + o.id}>
                    Detail ↗
                  </Link>
                )}
                {!studio && o.status === "pending" && o.payment_url && (o.provider === "doku" ? isAllowedDokuCheckoutUrl(o.payment_url, process.env.DOKU_IS_PRODUCTION === "true") : /^https:\/\/app(?:\.sandbox)?\.midtrans\.com\//.test(o.payment_url)) && (
                  <>
                    <br />
                    <a href={o.payment_url}>Lanjut bayar ↗</a>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
