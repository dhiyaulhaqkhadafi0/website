import { notFound } from "next/navigation";
import Link from "next/link";
import {
  requireUser,
  SESSION_COOKIE,
  publishedProduct,
  commerceConfigured,
} from "@/lib/commerce-server";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";
import s from "@/components/commerce/commerce.module.css";
import { cookies } from "next/headers";
import { dokuPolicy } from "@/lib/doku-config";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await publishedProduct(slug);
  if (!p) notFound();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const auth = token ? await requireUser(new Request("https://khadafidaffa.com", { headers: { authorization: "Bearer " + token } })) : null;
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
        email={auth?.ok ? auth.user.email || "" : ""}
        name={auth?.ok ? auth.user.user_metadata?.display_name || "" : ""}
        available={commerceConfigured(p.price > 0)}
        guestEnabled={process.env.COMMERCE_GUEST_CHECKOUT_ENABLED === "true"}
        qrisAvailable={dokuPolicy(process.env).qris}
      />
    </>
  );
}
