import { pageUser } from "@/lib/commerce-server";
import { StudioCommerceShell } from "@/components/commerce/StudioCommerceShell";
import { StudioInquiries } from "@/components/shop/StudioInquiries";
import s from "@/components/shop/shop.module.css";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Brief Proyek — Studio",
  robots: { index: false, follow: false },
};
export default async function InquiriesPage() {
  await pageUser("/studio/inquiries", true);
  return (
    <StudioCommerceShell>
      <div className={`${s.shell} notranslate`} translate="no">
        <StudioInquiries />
      </div>
    </StudioCommerceShell>
  );
}
