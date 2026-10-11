import type { Metadata } from "next";
import { FreelanceLeadsDashboard } from "@/components/freelance/FreelanceLeadsDashboard";
export const metadata: Metadata = {
  title: "Freelance Field Notes / Studio",
  robots: { index: false, follow: false },
};
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawPage = Number(params.page);
  const page = Number.isSafeInteger(rawPage) && rawPage >= 1 && rawPage <= 100000 ? rawPage : 1;
  const status = params.status === "active" || params.status === "unsubscribed" ? params.status : "";
  const source = params.source === "freelance_hub" || params.source === "freelance_jobs" ? params.source : "";
  return <FreelanceLeadsDashboard key={`${page}/${status}/${source}`} page={page} status={status} source={source} />;
}
