import "server-only";
import { dokuInvoice, signature, sameSignature, verifyDokuHmacSignature } from "./doku-security";
export { dokuInvoice, orderIdFromDokuInvoice } from "./doku-security";
import { isAllowedDokuCheckoutUrl } from "./doku-checkout-host";
import { dokuPolicy } from "./doku-config";

const CHECKOUT_PATH = "/checkout/v1/payment";
export const DOKU_WEBHOOK_PATH = "/api/commerce/doku/webhook";
function credentials() {
  const clientId = process.env.DOKU_CLIENT_ID || "";
  const secretKey = process.env.DOKU_SECRET_KEY || "";
  if (!clientId || !secretKey) throw new Error("DOKU credentials are missing");
  return { clientId, secretKey };
}

export function dokuConfigured() {
  return dokuPolicy(process.env).checkout;
}

export function verifyDokuNotification(headers: Headers, body: string): boolean {
  // New-sale kill switches must not disable processing accepted payments.
  if (!dokuPolicy(process.env).configured || body.length > 32768) return false;
  const { clientId, secretKey } = credentials();
  return verifyDokuHmacSignature(headers, body, clientId, secretKey, DOKU_WEBHOOK_PATH);
}

export async function createDokuCheckout(input: {
  orderId: string; amount: number; email: string; name: string; requestId: string; privateQa?: boolean;
}): Promise<string> {
  const policy = dokuPolicy(process.env);
  if (!(input.privateQa ? policy.qaCheckout : policy.checkout)) throw new Error("DOKU is not enabled");
  if (!Number.isSafeInteger(input.amount) || input.amount <= 0 ||
      !/^[a-f0-9-]{36}$/i.test(input.requestId)) throw new Error("Invalid checkout input");
  const { clientId, secretKey } = credentials();
  const production = process.env.DOKU_IS_PRODUCTION === "true";
  const invoice = dokuInvoice(input.orderId);
  // Only on the isolated single-machine staging setup: DOKU's Back to Merchant
  // button returns to localhost, while DOKU webhook traffic uses the public tunnel.
  const callbackOrigin = process.env.DOKU_LOCAL_STAGING_ONLY === "true"
    ? "http://localhost:3000" : process.env.DOKU_SITE_ORIGIN;
  const body = JSON.stringify({
    order: {
      amount: input.amount,
      invoice_number: invoice,
      currency: "IDR",
      callback_url: callbackOrigin + "/checkout/success?order=" + input.orderId,
      callback_url_result: callbackOrigin + "/checkout/success?order=" + input.orderId,
      auto_redirect: false,
    },
    payment: { payment_due_date: 60, payment_method_types: input.privateQa ? ["QRIS"] : policy.methods },
    additional_info: { override_notification_url: process.env.DOKU_SITE_ORIGIN + DOKU_WEBHOOK_PATH },
    customer: { name: input.name, email: input.email },
  });
  const requestId = input.requestId;
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const requestSignature = signature(clientId, requestId, timestamp, CHECKOUT_PATH, body, secretKey);
  const response = await fetch(
    (production ? "https://api.doku.com" : "https://api-sandbox.doku.com") + CHECKOUT_PATH,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        Signature: requestSignature,
      },
      body,
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
      redirect: "error",
    },
  );
  const raw = await response.text();
  if (raw.length > 65536) throw new Error("DOKU_RESPONSE_TOO_LARGE");
  let result;
  try { result = JSON.parse(raw); } catch { throw new Error("DOKU_RESPONSE_INVALID_JSON"); }
  let responseHost: string | null = null;
  try { responseHost = new URL(result?.response?.payment?.url).hostname; } catch { /* No URL in rejected responses. */ }
  console.info("commerce.doku.checkout_response", { status: response.status, host: responseHost, signed: response.headers.has("signature") });
  if (!response.ok) {
    if ([401, 403].includes(response.status)) throw new Error("DOKU_CREDENTIALS_REJECTED");
    if (response.status === 429) throw new Error("DOKU_RATE_LIMITED");
    throw new Error("DOKU_CHECKOUT_REJECTED");
  }

  // Authenticate the response independently; echoed request metadata alone is
  // not a response signature and cannot authenticate the returned checkout URL.
  const responseSignature = response.headers.get("signature");
  if (!responseSignature) throw new Error("DOKU_RESPONSE_SIGNATURE_MISSING");
  {
    const responseTime = response.headers.get("response-timestamp") || "";
    const signedClient = response.headers.get("client-id");
    const signedId = response.headers.get("request-id");
    if (!responseTime || signedClient !== clientId || signedId !== requestId ||
      !sameSignature(signature(clientId, requestId, responseTime, CHECKOUT_PATH, raw, secretKey, true), responseSignature)) {
      throw new Error("DOKU_RESPONSE_SIGNATURE_INVALID");
    }
  }
  if (result?.response?.order?.invoice_number !== invoice ||
    Number(result?.response?.order?.amount) !== input.amount ||
    (result?.response?.order?.currency && result.response.order.currency !== "IDR") ||
    typeof result?.response?.payment?.url !== "string") {
    throw new Error("DOKU_RESPONSE_ORDER_MISMATCH");
  }
  if (!isAllowedDokuCheckoutUrl(result.response.payment.url, production)) {
    throw new Error("DOKU_RESPONSE_HOST_REJECTED");
  }
  return new URL(result.response.payment.url).toString();
}
