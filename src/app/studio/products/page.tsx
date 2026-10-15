import { pageUser } from "@/lib/commerce-server";
import { StudioProducts } from "@/components/commerce/StudioProducts";
import type { Product } from "@/lib/commerce-types";
import s from "@/components/commerce/commerce.module.css";
export default async function Page() {
  const auth = await pageUser("/studio/products", true);
  const { data, error } = await auth.client
    .from("commerce_products")
    .select("*")
    .order("updated_at", { ascending: false });
  return (
    <>
      <div className={s.pageTitle}>
        <span className={s.eyebrow}>KHADAFI STUDIO / PRODUCTS</span>
        <h1>
          Dari ide <em>menjadi produk.</em>
        </h1>
        <p>
          Kelola katalog, susun halaman penjualan, dan publikasikan saat
          semuanya siap.
        </p>
      </div>
      {error ? (
        <div className={s.notice} role="alert">
          Produk belum dapat dimuat. Periksa konfigurasi database.
        </div>
      ) : (
        <StudioProducts products={(data || []) as Product[]} />
      )}
    </>
  );
}
