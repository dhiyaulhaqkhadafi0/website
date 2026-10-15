import { pageUser } from "@/lib/commerce-server";
import { StudioCommerceShell } from "@/components/commerce/StudioCommerceShell";
import { StudioOrders } from "@/components/commerce/StudioOrders";
import type { Order } from "@/lib/commerce-types";
import s from "@/components/commerce/commerce.module.css";
export default async function Page() {
  const auth = await pageUser("/studio/orders", true);
  const { data, error } = await auth.client
    .from("commerce_orders")
    .select("*,commerce_order_items(*)")
    .order("created_at", { ascending: false })
    .limit(250);
  return (
    <StudioCommerceShell>
      <div className={s.pageTitle}>
        <span className={s.eyebrow}>STUDIO / ORDERS</span>
        <h1>
          Setiap pesanan, <em>terlihat.</em>
        </h1>
        <p>Catatan transaksi dan status pembayaran yang dikonfirmasi server.</p>
      </div>
      {error ? (
        <div className={s.notice} role="alert">
          Pesanan belum dapat dimuat.
        </div>
      ) : (
        <StudioOrders orders={(data || []) as Order[]} />
      )}
    </StudioCommerceShell>
  );
}
