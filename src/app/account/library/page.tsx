import Link from "next/link";
import { pageUser } from "@/lib/commerce-server";
import type { Product } from "@/lib/commerce-types";
import { BookCover } from "@/components/commerce/BookCover";
import { DownloadButton } from "@/components/commerce/DownloadButton";
import s from "@/components/commerce/commerce.module.css";
export default async function Page() {
  const auth = await pageUser("/account/library");
  const { data, error } = await auth.client
    .from("commerce_entitlements")
    .select("resource_id,granted_at,commerce_products(*)")
    .eq("user_id", auth.user.id)
    .eq("status", "active")
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
    .order("granted_at", { ascending: false });
  const rows = (data || []) as unknown as {
    resource_id: string;
    granted_at: string;
    commerce_products: Product;
  }[];
  const unique = rows.filter(
    (r, i) =>
      r.commerce_products &&
      rows.findIndex((x) => x.resource_id === r.resource_id) === i,
  );
  return (
    <>
      <div className={s.pageTitle}>
        <span className={s.eyebrow}>MY LIBRARY</span>
        <h1>
          Bekal yang <em>kamu miliki.</em>
        </h1>
        <p>Unduh dan gunakan produk yang sudah terhubung ke akunmu.</p>
      </div>
      {error ? (
        <div className={s.notice} role="alert">
          Library belum dapat dimuat. Silakan coba kembali.
        </div>
      ) : unique.length ? (
        <div className={s.productGrid} style={{ paddingBottom: 80 }}>
          {unique.map((r) => (
            <article className={s.productCard} key={r.resource_id}>
              <BookCover
                name={r.commerce_products.name}
                cover={r.commerce_products.cover_url}
              />
              <span className={s.eyebrow}>{r.commerce_products.category}</span>
              <h3>{r.commerce_products.name}</h3>
              <p className={s.note}>
                Ditambahkan{" "}
                {new Date(r.granted_at).toLocaleDateString("id-ID", {
                  timeZone: "Asia/Jakarta",
                })}
              </p>
              <div className={s.actions}>
                <DownloadButton id={r.resource_id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={s.empty} style={{ marginBottom: 80 }}>
          <div>
            <h3>Library-mu masih kosong.</h3>
            <p>
              Produk yang kamu dapatkan akan muncul di sini setelah pesanan
              dikonfirmasi.
            </p>
            <div className={s.actions}>
              <Link href="/products" className={s.button}>
                Jelajahi produk ↗
              </Link>
              <Link href="/account/orders" className={s.secondary}>
                Lihat pesanan
              </Link>
            </div>
          </div>
          <div className={s.emptyVisual} aria-hidden="true">
            <div className={s.sheet}>
              <small>THE NEXT CHAPTER</small>Start
              <br />
              here.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
