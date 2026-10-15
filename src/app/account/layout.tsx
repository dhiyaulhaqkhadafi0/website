import type { Metadata } from "next";
import { CommerceShell } from "@/components/commerce/CommerceShell";
import { PrivateNav } from "@/components/commerce/PrivateNav";
import { pageUser } from "@/lib/commerce-server";
export const metadata: Metadata = {
  title: "Akun saya",
  robots: { index: false, follow: false },
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await pageUser("/account");
  return (
    <CommerceShell>
      <PrivateNav />
      {children}
    </CommerceShell>
  );
}
