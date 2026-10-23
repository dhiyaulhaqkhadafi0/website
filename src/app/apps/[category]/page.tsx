import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { AppsCatalog } from "@/components/apps/AppsCatalog";
import { publicApps } from "@/lib/apps-server";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = await publicApps();
  const c = data.categories.find((c) => c.slug === category);
  return {
    title: c ? `${c.name} / Khadafi Apps` : "Khadafi Apps",
    description: c?.description,
    alternates: { canonical: `https://khadafidaffa.com/apps/${category}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = await publicApps();
  const c = data.categories.find((c) => c.slug === category);
  if (!c) notFound();
  return (
    <>
      <Navbar />
      <AppsCatalog {...data} category={c} />
    </>
  );
}
