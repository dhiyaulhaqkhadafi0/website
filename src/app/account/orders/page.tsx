import { pageUser } from "@/lib/commerce-server";
import type { Order } from "@/lib/commerce-types";
import { OrdersTable } from "@/components/commerce/OrdersTable";
import s from "@/components/commerce/commerce.module.css";
export default async function Page() {
  const auth = await pageUser("/account/orders");
  const { data, error } = await auth.client
    .from("commerce_orders")
    .select("*,commerce_order_items(*)")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false })
    .limit(100);
  return (
    <>
      <div className={s.pageTitle}>
        <span className={s.eyebrow}>MY ORDERS</span>
        <h1>
          Catatan <em>pesananmu.</em>
        </h1>
        <p>Status pembayaran dan produk, tanpa perlu mencari di tempat lain.</p>
      </div>
      {error ? (
        <div className={s.notice} role="alert">
          Pesanan belum dapat dimuat.
        </div>
      ) : data?.length ? (
        <OrdersTable orders={data as Order[]} />
      ) : (
        <div className={s.notice} style={{ marginBottom: 80 }}>
          Belum ada pesanan. Pesanan pertamamu akan muncul di sini.
        </div>
      )}
    </>
  );
}
