import type { Metadata } from "next";
import {
  Storefront,
  type ShopSearchParams,
} from "@/components/shop/Storefront";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Produk Digital Original — Made by Khadafi",
  description:
    "Ebook dan bekal digital original dari Khadafi. Dibuat dengan perhatian dan tersedia saat isi serta aksesnya siap.",
  alternates: { canonical: "/products/original" },
};
export default function Originals({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  return <Storefront searchParams={searchParams} mode="original" />;
}
