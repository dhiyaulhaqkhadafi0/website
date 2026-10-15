import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pageUser } from "@/lib/commerce-server";
import s from "@/components/commerce/commerce.module.css";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const auth = await pageUser("/account");
  const params = await searchParams;
  const [library, orders] = await Promise.all([
    auth.client
      .from("commerce_entitlements")
      .select("resource_id")
      .eq("user_id", auth.user.id)
      .eq("status", "active")
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString()),
    auth.client
      .from("commerce_orders")
      .select("status")
      .eq("user_id", auth.user.id),
  ]);
  const error = library.error || orders.error;
  return (
    <>
      <section className={s.pageTitle}>
        <span className={s.eyebrow}>YOUR PERSONAL LIBRARY</span>
        <h1>
          Ruang untuk <em>bertumbuh.</em>
        </h1>
        <p>
          Selamat datang
          {auth.user.user_metadata?.display_name
            ? ", " + String(auth.user.user_metadata.display_name)
            : ""}
          . Produk dan pesananmu tersimpan di satu tempat.
        </p>
      </section>
      {params.access === "denied" && (
        <div role="alert" className={s.notice}>
          Studio hanya tersedia untuk pengelola website.
        </div>
      )}
      {error ? (
        <div className={s.notice} role="alert">
          Data akun belum dapat dimuat. Silakan muat ulang halaman.
        </div>
      ) : (
        <div className={s.stats}>
          <div>
            <strong>
              {new Set(library.data?.map((e) => e.resource_id)).size}
            </strong>
            <span>Produk di library</span>
          </div>
          <div>
            <strong>{orders.data?.length || 0}</strong>
            <span>Pesanan</span>
          </div>
          <div>
            <strong>
              {orders.data?.filter((o) => o.status === "pending").length || 0}
            </strong>
            <span>Menunggu pembayaran</span>
          </div>
        </div>
      )}
      <div className={s.empty} style={{ marginBottom: 70 }}>
        <div>
          <span className={s.eyebrow}>PICK UP WHERE YOU LEFT OFF</span>
          <h3>Bekalmu, selalu dekat.</h3>
          <p>
            Buka produk yang kamu miliki, atau temukan bekal baru untuk langkah
            berikutnya.
          </p>
          <div className={s.actions}>
            <Link href="/account/library" className={s.button}>
              Buka library <ArrowUpRight />
            </Link>
            <Link href="/products" className={s.secondary}>
              Jelajahi produk
            </Link>
          </div>
        </div>
        <div className={s.emptyVisual} aria-hidden="true">
          <div className={s.sheet}>
            <small>YOUR COLLECTION</small>Read.
            <br />
            Practice.
          </div>
          <div className={s.sheet}>
            <small>YOUR NEXT STEP</small>Build.
            <br />
            Repeat.
          </div>
        </div>
      </div>
    </>
  );
}
