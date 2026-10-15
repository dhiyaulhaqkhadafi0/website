import { CommerceShell } from "@/components/commerce/CommerceShell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <CommerceShell>{children}</CommerceShell>;
}
