import Link from "next/link";
import { pageUser } from "@/lib/commerce-server";
import { CommerceShell } from "@/components/commerce/CommerceShell";
import { PrivateNav } from "@/components/commerce/PrivateNav";
import s from "@/components/commerce/commerce.module.css";
export default async function FounderOverview() {
  const auth = await pageUser("/studio/overview", true);
  const [subscribers, products, orders, articles] = await Promise.all([
    auth.client.rpc("freelance_lead_stats"),
    auth.client
      .from("commerce_products")
      .select("id", { count: "exact", head: true }),
    auth.client
      .from("commerce_orders")
      .select("id", { count: "exact", head: true }),
    auth.client
      .from("blog_articles")
      .select("id", { count: "exact", head: true }),
  ]);
  const metrics = [
    ["Subscriber aktif", subscribers.error ? null : subscribers.data?.active],
    ["Produk", products.error ? null : products.count],
    ["Pesanan", orders.error ? null : orders.count],
    ["Artikel saya", articles.error ? null : articles.count],
  ];
  return (
    <CommerceShell>
      <PrivateNav studio />
      <section className={s.pageTitle}>
        <span className={s.eyebrow}>FOUNDER / PENGELOLA</span>
        <h1>
          Ruang di balik <em>ekosistem.</em>
        </h1>
        <p>
          Ringkasan data dan akses ke modul pengelolaan yang sudah tersedia.
        </p>
      </section>
      <div className={s.stats}>
        {metrics.map(([label, count]) => (
          <div key={label}>
            <strong>{count ?? "—"}</strong>
            <span>{label}</span>
            {count == null && <small>Data belum dapat dimuat</small>}
          </div>
        ))}
      </div>
      <div
        className={s.empty}
        style={{ display: "grid", gap: 24, marginBottom: 64 }}
      >
        {[
          ["Subscriber & newsletter", "/studio/freelance"],
          ["Affiliate Manager", "/studio/affiliates"],
          ["Produk digital", "/studio/products"],
          ["Pesanan", "/studio/orders"],
          ["Pelanggan", "/studio/customers"],
          ["Artikel · Blog Studio", "/studio"],
        ].map(([label, href]) => (
          <Link key={href} href={href} className={s.secondary}>
            {label} ↗
          </Link>
        ))}
      </div>
    </CommerceShell>
  );
}
