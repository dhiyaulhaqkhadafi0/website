import "server-only";
import { createServiceRoleClient } from "./supabase";
import { createDokuCheckout, dokuInvoice } from "./doku";
import { dokuPolicy } from "./doku-config";
import { isAllowedDokuCheckoutUrl } from "./doku-checkout-host";

export async function checkoutForDokuOrder(order: { id: string; total: number }, email: string, name: string, privateQa = false) {
  const policy = dokuPolicy(process.env);
  if (!(privateQa ? policy.qaCheckout : policy.checkout)) throw new Error("Checkout disabled");
  const db = createServiceRoleClient();
  const { data: claim, error } = await db.rpc("commerce_claim_doku_checkout", {
    p_order: order.id, p_environment: policy.environment, p_invoice: dokuInvoice(order.id),
  });
  if (error || !claim) throw new Error("DOKU_CHECKOUT_STORAGE_FAILURE");
  if (claim.busy) throw new Error("DOKU_CHECKOUT_PENDING");
  if (claim.url) {
    if (!isAllowedDokuCheckoutUrl(claim.url, policy.production)) throw new Error("Invalid checkout URL");
    return claim.url as string;
  }
  try {
    const url = await createDokuCheckout({ orderId: order.id, amount: order.total, email, name, requestId: claim.request_id, privateQa });
    const result = await db.rpc("commerce_finish_doku_checkout", { p_order: order.id, p_token: claim.token, p_url: url });
    if (result.error) throw new Error("DOKU_CHECKOUT_STORAGE_FAILURE");
    return url;
  } catch (error) {
    const code = error instanceof Error && /^DOKU_[A-Z_]+$/.test(error.message) ? error.message : "DOKU_CHECKOUT_UNKNOWN";
    console.error("commerce.doku.checkout_failure", { code });
    // Includes ambiguous network outcomes: no blind provider session retry.
    await db.rpc("commerce_finish_doku_checkout", { p_order: order.id, p_token: claim.token, p_url: null });
    throw new Error(code);
  }
}
