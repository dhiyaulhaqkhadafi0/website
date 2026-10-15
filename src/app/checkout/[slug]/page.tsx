import { notFound } from "next/navigation";
import Link from "next/link";
import {
  pageUser,
  publishedProduct,
  commerceConfigured,
} from "@/lib/commerce-server";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";
import s from "@/components/commerce/commerce.module.css";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await publishedProduct(slug);
  if (!p) notFound();
  const auth = await pageUser("/checkout/" + slug);
  return (
    <>
      <div className={s.breadcrumb}>
        <Link href={"/products/" + slug}>← Kembali ke produk</Link>
      </div>
      <div className={s.pageTitle}>
        <span className={s.eyebrow}>ONE MORE STEP</span>
        <h1>Bekal baru untukmu.</h1>
        <p>Periksa pesanan dan lengkapi informasi pembeli.</p>
      </div>
      <CheckoutForm
        product={p}
        email={auth.user.email || ""}
        name={auth.user.user_metadata?.display_name || ""}
        available={commerceConfigured(p.price > 0)}
      />
    </>
  );
}
