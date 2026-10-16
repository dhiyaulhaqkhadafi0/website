import { ShopShell } from "@/components/shop/ShopShell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ShopShell>{children}</ShopShell>;
}
