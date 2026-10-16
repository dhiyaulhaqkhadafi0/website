import type { Metadata } from "next";
import {
  Storefront,
  type ShopSearchParams,
} from "@/components/shop/Storefront";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Studio & Shop — Produk, Tools & Jasa",
  description:
    "Produk digital original, tools pilihan, dan layanan kreatif Khadafi. Temukan bekal untuk berkarya serta membangun sesuatu.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Khadafi Studio & Shop",
    description: "Discover tools. Build something great.",
    url: "/products",
  },
};
export default function ProductsPage({
  searchParams,
}: {
  searchParams: ShopSearchParams;
}) {
  return <Storefront searchParams={searchParams} />;
}
