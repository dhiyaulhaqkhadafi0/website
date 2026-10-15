import { notFound } from "next/navigation";
import { pageUser } from "@/lib/commerce-server";
import { ProductEditor } from "@/components/commerce/ProductEditor";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auth = await pageUser("/studio/products/" + id, true);
  const { data } = await auth.client
    .from("commerce_products")
    .select("*,commerce_product_files(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const { commerce_product_files, ...product } = data;
  return (
    <ProductEditor initial={product} initialFiles={commerce_product_files} />
  );
}
