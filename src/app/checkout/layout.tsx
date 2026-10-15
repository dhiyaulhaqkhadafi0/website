import type { Metadata } from "next";
import { CommerceShell } from "@/components/commerce/CommerceShell";
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <CommerceShell>{children}</CommerceShell>;
}
