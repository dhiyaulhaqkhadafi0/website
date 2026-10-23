import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { AppsCatalog } from "@/components/apps/AppsCatalog";
import { publicApps } from "@/lib/apps-server";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Khadafi Apps — Tools untuk Kerja Mandiri",
  description:
    "Temukan kalkulator, generator, analyzer, dan tools ringan untuk menyelesaikan pekerjaan spesifik.",
  alternates: { canonical: "https://khadafidaffa.com/apps" },
};
export default async function Page() {
  const data = await publicApps();
  return (
    <>
      <Navbar />
      <AppsCatalog {...data} />
    </>
  );
}
