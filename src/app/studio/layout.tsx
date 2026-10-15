import type { Metadata } from "next";
import { pageUser } from "@/lib/commerce-server";
import { StudioRootNav } from "@/components/commerce/StudioRootNav";
import { SessionBridge } from "@/components/commerce/SessionBridge";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await pageUser("/studio", true);
  return (
    <>
      <SessionBridge />
      <StudioRootNav />
      {children}
    </>
  );
}
