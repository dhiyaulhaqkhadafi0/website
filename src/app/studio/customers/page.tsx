import { pageUser } from "@/lib/commerce-server";
import { StudioCommerceShell } from "@/components/commerce/StudioCommerceShell";
import { money, type Order } from "@/lib/commerce-types";
import s from "@/components/commerce/commerce.module.css";
export default async function Page() {
  const auth = await pageUser("/studio/customers", true);
  const { data, error } = await auth.client
    .from("commerce_orders")
    .select("user_id,customer_name,customer_email,total,status,created_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  const customers = new Map<
    string,
    { name: string; email: string; count: number; paid: number }
  >();
  for (const o of (data || []) as Order[]) {
    const c = customers.get(o.user_id) || {
      name: o.customer_name,
      email: o.customer_email,
      count: 0,
      paid: 0,
    };
    c.count++;
    if (o.status === "paid") c.paid += o.total;
    customers.set(o.user_id, c);
  }
  return (
    <StudioCommerceShell>
      <div className={s.pageTitle}>
        <span className={s.eyebrow}>STUDIO / CUSTOMERS</span>
        <h1>
          Orang di balik <em>pesanan.</em>
        </h1>
        <p>
          Identitas pelanggan yang sama untuk setiap pembelian dan akses produk.
        </p>
      </div>
      {error ? (
        <div className={s.notice} role="alert">
          Pelanggan belum dapat dimuat.
        </div>
      ) : customers.size ? (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Email</th>
                <th>Pesanan</th>
                <th>Total lunas</th>
              </tr>
            </thead>
            <tbody>
              {[...customers.entries()].map(([id, c]) => (
                <tr key={id}>
                  <td data-label="Pelanggan">{c.name}</td>
                  <td data-label="Email">{c.email}</td>
                  <td data-label="Pesanan">{c.count}</td>
                  <td data-label="Total lunas">{money(c.paid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={s.note}>
            Ringkasan dari maksimal 1.000 pesanan terbaru; bukan laporan
            keuangan lengkap.
          </p>
        </div>
      ) : (
        <div className={s.notice} style={{ marginBottom: 80 }}>
          Belum ada pelanggan dengan pesanan.
        </div>
      )}
    </StudioCommerceShell>
  );
}
