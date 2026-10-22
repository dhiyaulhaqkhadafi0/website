import "server-only";
import { createServiceRoleClient } from "./supabase";
import { createDokuCheckout, dokuInvoice } from "./doku";
import { dokuPolicy } from "./doku-config";
import { isAllowedDokuCheckoutUrl } from "./doku-checkout-host";
import { checkoutMethodAllowed } from "./checkout-methods";

export async function checkoutForDokuOrder(order: { id: string; total: number }, email: string, name: string, privateQa = false, method = "all") {
  const policy = dokuPolicy(process.env);
  if (!(privateQa ? policy.qaCheckout : policy.checkout)) throw new Error("Checkout disabled");
  if (!privateQa && !checkoutMethodAllowed(method, policy)) throw new Error("DOKU_METHOD_UNAVAILABLE");
  const db = createServiceRoleClient();
  const { data: claim, error } = await db.rpc(privateQa ? "commerce_claim_doku_checkout" : "commerce_claim_doku_checkout_method", {
    p_order: order.id, p_environment: policy.environment, p_invoice: dokuInvoice(order.id),
    ...(!privateQa ? { p_method: method } : {}),
  });
  if (error || !claim) throw new Error("DOKU_CHECKOUT_STORAGE_FAILURE");
  if (claim.method_locked) throw new Error("DOKU_METHOD_LOCKED");
  if (claim.busy) throw new Error("DOKU_CHECKOUT_PENDING");
  if (claim.url) {
    if (!isAllowedDokuCheckoutUrl(claim.url, policy.production)) throw new Error("Invalid checkout URL");
    return claim.url as string;
  }
  try {
    const url = await createDokuCheckout({ orderId: order.id, amount: order.total, email, name, requestId: claim.request_id, privateQa, method });
    const result = await db.rpc("commerce_finish_doku_checkout", { p_order: order.id, p_token: claim.token, p_url: url });
    if (result.error) throw new Error("DOKU_CHECKOUT_STORAGE_FAILURE");
    return url;
  } catch (error) {
    const code = error instanceof Error && /^DOKU_[A-Z_]+$/.test(error.message) ? error.message : "DOKU_CHECKOUT_UNKNOWN";
    console.error("commerce.doku.checkout_failure", { code });
    // Includes ambiguous network outcomes: no blind provider session retry.
    await db.rpc("commerce_finish_doku_checkout", { p_order: order.id, p_token: claim.token, p_url: null });
    // Sanitized failure class only; no credentials, buyer data or checkout tokens.
    try { await db.from("commerce_doku_state").update({ error_class: code }).eq("order_id", order.id).eq("checkout_state", "unknown"); } catch { /* Preserve original failure. */ }
    throw new Error(code);
  }
}
