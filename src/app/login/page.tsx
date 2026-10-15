import type { Metadata } from "next";
import { CommerceShell } from "@/components/commerce/CommerceShell";
import { AuthForm } from "@/components/commerce/AuthForm";
import { safeReturnTo } from "@/lib/commerce-types";
export const metadata: Metadata = {
  title: "Masuk akun",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const p = await searchParams;
  return (
    <CommerceShell>
      <AuthForm returnTo={safeReturnTo(p.returnTo)} />
    </CommerceShell>
  );
}
