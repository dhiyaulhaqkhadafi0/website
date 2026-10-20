import { notFound } from "next/navigation";
import { pageUser } from "@/lib/commerce-server";
import { dokuPolicy } from "@/lib/doku-config";
import { PaymentQa } from "@/components/commerce/PaymentQa";
import { StudioCommerceShell } from "@/components/commerce/StudioCommerceShell";
export const metadata = { title: "Payment QA privat", robots: { index: false, follow: false } };
export default async function Page() {
  if (process.env.DOKU_QA_ENABLED !== "true") notFound();
  const auth = await pageUser("/studio/payments/qa", true);
  if (!(process.env.DOKU_QA_USER_IDS || "").split(",").map(x => x.trim()).includes(auth.user.id)) notFound();
  const policy = dokuPolicy(process.env);
  return <StudioCommerceShell><PaymentQa qrisReady={policy.qaCheckout} freeReady={process.env.DOKU_QA_FREE_ENABLED === "true"} environment={policy.environment} /></StudioCommerceShell>;
}
