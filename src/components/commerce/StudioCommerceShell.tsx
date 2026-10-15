import { CommerceShell } from "./CommerceShell";
import { PrivateNav } from "./PrivateNav";
export function StudioCommerceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommerceShell>
      <PrivateNav studio />
      {children}
    </CommerceShell>
  );
}
