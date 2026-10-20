import "server-only";
import { dokuInvoice, signature, sameSignature, verifyDokuHmacSignature } from "./doku-security";
export { dokuInvoice, orderIdFromDokuInvoice } from "./doku-security";
import { isAllowedDokuCheckoutUrl } from "./doku-checkout-host";

const CHECKOUT_PATH = "/checkout/v1/payment";
export const DOKU_WEBHOOK_PATH = "/api/commerce/doku/webhook";
function credentials() {
  const clientId = process.env.DOKU_CLIENT_ID || "";
  const secretKey = process.env.DOKU_SECRET_KEY || "";
  if (!clientId || !secretKey) throw new Error("DOKU credentials are missing");
  return { clientId, secretKey };
}

export function dokuConfigured() {
  const production = process.env.DOKU_IS_PRODUCTION === "true";
  const origin = process.env.DOKU_SITE_ORIGIN || "";
  if (process.env.DOKU_LOCAL_STAGING_ONLY === "true" &&
      (production || !["http://127.0.0.1:54321", "http://localhost:54321"]
        .includes(process.env.NEXT_PUBLIC_SUPABASE_URL || ""))) return false;
  // Sandbox must always use an explicitly configured non-production Supabase.
  // src/lib/supabase.ts has a legacy production URL fallback; do not use it here.
  const dbOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (!production && (!dbOrigin || /mykgtajanxczdnzekycl\.supabase\.co/i.test(dbOrigin))) return false;
  try {
    const url = new URL(origin);
    const validOrigin = url.protocol === "https:" && url.origin === origin && !url.username && !url.password;
    const approved = !production || (
      process.env.DOKU_PRODUCTION_APPROVED === "true" &&
      origin === "https://khadafidaffa.com"
    );
    // Prevent inadvertently redirecting live customers to sandbox checkout.
    return process.env.DOKU_ENABLED === "true" &&
      Boolean(process.env.DOKU_CLIENT_ID && process.env.DOKU_SECRET_KEY) &&
      validOrigin && approved && (production || origin !== "https://khadafidaffa.com");
  } catch { return false; }
}

export function verifyDokuNotification(headers: Headers, body: string): boolean {
  if (!dokuConfigured() || body.length > 32768) return false;
  const { clientId, secretKey } = credentials();
  return verifyDokuHmacSignature(headers, body, clientId, secretKey, DOKU_WEBHOOK_PATH);
}

export async function createDokuCheckout(input: {
  orderId: string; amount: number; email: string; name: string;
}): Promise<string> {
  if (!dokuConfigured()) throw new Error("DOKU is not enabled");
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
    payment: { payment_due_date: 60 },
    customer: { name: input.name, email: input.email },
  });
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const response = await fetch(
    (production ? "https://api.doku.com" : "https://api-sandbox.doku.com") + CHECKOUT_PATH,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": timestamp,
        Signature: signature(clientId, requestId, timestamp, CHECKOUT_PATH, body, secretKey),
      },
      body,
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    },
  );
  const raw = await response.text();
  if (raw.length > 65536) throw new Error("Unexpected DOKU response");
  const result = JSON.parse(raw);
  if (!response.ok) throw new Error("DOKU checkout creation failed");

  // If the server includes a response signature, authenticate the body as well.
  const responseSignature = response.headers.get("signature");
  if (responseSignature) {
    const responseTime = response.headers.get("response-timestamp") || "";
    const signedClient = response.headers.get("client-id") || clientId;
    const signedId = response.headers.get("request-id") || requestId;
    if (!responseTime || signedClient !== clientId || signedId !== requestId ||
      !sameSignature(signature(clientId, requestId, responseTime, CHECKOUT_PATH, raw, secretKey, true), responseSignature)) {
      throw new Error("Invalid DOKU response signature");
    }
  }
  if (result?.response?.order?.invoice_number !== invoice ||
    Number(result?.response?.order?.amount) !== input.amount ||
    (result?.response?.order?.currency && result.response.order.currency !== "IDR") ||
    typeof result?.response?.payment?.url !== "string") {
    throw new Error("DOKU response does not match the order");
  }
  if (!isAllowedDokuCheckoutUrl(result.response.payment.url, production)) {
    throw new Error("Unexpected DOKU checkout URL");
  }
  return new URL(result.response.payment.url).toString();
}