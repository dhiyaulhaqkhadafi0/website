// REAL DOKU Sandbox webhook smoke test without Docker, Next.js or Supabase.
// The only publicly routed path must be POST /api/commerce/doku/webhook
// on a dedicated HTTPS subdomain -> local 127.0.0.1:8788 Cloudflare Tunnel.
// Test orders and their paid status exist ONLY in memory, not in the website DB.
// Node >= 24. Reads sandbox keys from process environment, never prints them.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import {
  dokuInvoice, orderIdFromDokuInvoice, signature, sameSignature,
  verifyDokuHmacSignature,
} from "../src/lib/doku-security.ts";
import { isAllowedDokuCheckoutUrl } from "../src/lib/doku-checkout-host.ts";
import { handleDokuWebhookHttp } from "../src/lib/doku-webhook-handler.ts";

const WEBHOOK_PATH = "/api/commerce/doku/webhook";
const HOST = "127.0.0.1";
const WEBHOOK_PORT = 8788;
const DASHBOARD_PORT = 8789;
const API_PATH = "/checkout/v1/payment";
const clientId = process.env.DOKU_CLIENT_ID || "";
const secretKey = process.env.DOKU_SECRET_KEY || "";
const orders = new Map();
let working = false;

if (process.env.DOKU_IS_PRODUCTION === "true" ||
    !clientId || !secretKey || secretKey.length < 12 ||
    !/^[A-Za-z0-9-]{5,100}$/.test(clientId)) {
  console.error("STOP: Supply valid DOKU SANDBOX credentials; production mode is prohibited.");
  process.exit(1);
}

function audit(text) {
  // Intentionally exclude full invoices, VA, customer data, access URLs and secrets.
  console.log(new Date().toISOString() + " " + text);
}
function createView() {
  return Array.from(orders.values()).map(row => ({
    id: row.id.slice(0, 8),
    amount: row.amount,
    paid: row.paid,
    signed_success_received: row.signedSuccessReceived,
  }));
}
function html() {
  const views = createView();
  const rows = views.length
    ? views.map(o => "<tr><td>" + o.id + "</td><td>Rp" + o.amount.toLocaleString("id-ID") +
      "</td><td>" + (o.paid ? "PAID (test memory)" : "PENDING") +
      "</td><td>" + (o.signed_success_received ? "YES" : "NO") + "</td></tr>").join("")
    : "<tr><td colspan='4'>No test order created yet</td></tr>";
  return "<!doctype html><html lang='id'><meta charset='utf-8'>" +
    "<meta http-equiv='refresh' content='10'><title>Khadafi DOKU Sandbox Test</title>" +
    "<style>body{font:16px system-ui;margin:3em auto;max-width:750px;line-height:1.6}" +
    "table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:12px}" +
    "button{padding:14px 22px;cursor:pointer}</style><h1>DOKU Sandbox Webhook Test</h1>" +
    "<p>Only in-memory test orders. No real database, customer, or ebook access.</p>" +
    "<p>First configure a trusted public HTTPS notification URL to the webhook-only tunnel.</p>" +
    "<form method='POST' action='/checkout'><button>Create Rp59.000 Sandbox checkout</button></form>" +
    "<h2>Webhook outcomes (auto refreshes)</h2><table><tr><th>Order prefix</th>" +
    "<th>Amount</th><th>Status</th><th>Verified DOKU SUCCESS?</th></tr>" +
    rows + "</table><p>Only local dashboard: http://127.0.0.1:8789</p></html>";
}
async function createCheckout() {
  const id = randomUUID();
  const invoice = dokuInvoice(id);
  const amount = 59000;
  const body = JSON.stringify({
    order: { amount, invoice_number: invoice, currency: "IDR", auto_redirect: false },
    payment: { payment_due_date: 60 },
  });
  const requestId = randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const response = await fetch("https://api-sandbox.doku.com" + API_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": clientId,
      "Request-Id": requestId,
      "Request-Timestamp": timestamp,
      Signature: signature(clientId, requestId, timestamp, API_PATH, body, secretKey),
    },
    body,
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const raw = await response.text();
  if (raw.length > 65536) throw new Error("Oversized DOKU response");
  let parsed;
  try { parsed = JSON.parse(raw); } catch { throw new Error("DOKU response was not JSON"); }
  if (!response.ok) throw new Error("DOKU Sandbox HTTP " + response.status);
  const responseSignature = response.headers.get("signature");
  if (responseSignature) {
    const time = response.headers.get("response-timestamp");
    const idHeader = response.headers.get("request-id") || requestId;
    const receivedClient = response.headers.get("client-id") || clientId;
    if (!time || idHeader !== requestId || receivedClient !== clientId ||
        !sameSignature(
          signature(clientId, requestId, time, API_PATH, raw, secretKey, true),
          responseSignature,
        )) throw new Error("DOKU response signature mismatch");
  }
  const resultOrder = parsed?.response?.order;
  const url = parsed?.response?.payment?.url;
  if (resultOrder?.invoice_number !== invoice || Number(resultOrder.amount) !== amount ||
      (resultOrder.currency && resultOrder.currency !== "IDR") ||
      typeof url !== "string" || !isAllowedDokuCheckoutUrl(url, false)) {
    throw new Error("DOKU response invoice, amount, or URL failed validation");
  }
  orders.set(id, { id, amount, paid: false, signedSuccessReceived: false });
  audit("PASS: new Rp59000 DOKU Sandbox Checkout created; full payment URL was not logged");
  return url;
}
const deps = {
  verify: (headers, body) =>
    verifyDokuHmacSignature(headers, body, clientId, secretKey, WEBHOOK_PATH),
  decodeInvoice: orderIdFromDokuInvoice,
  invoiceForOrder: dokuInvoice,
  canSettle: () => true,
  settle: async (id, amount, reference) => {
    const row = orders.get(id);
    if (!row || row.amount !== amount || dokuInvoice(id) !== reference) {
      audit("REJECTED: signed notification did not match test order/amount");
      throw new Error("Unknown test order or incorrect amount");
    }
    if (!row.paid) {
      row.paid = true;
      row.signedSuccessReceived = true;
      audit("SUCCESS: valid signed DOKU SUCCESS notification settled in-memory test order");
    } else audit("INFO: duplicate valid signed SUCCESS, already marked paid");
  },
};

function localConnection(request) {
  return request.socket.remoteAddress === HOST;
}

const publicWebhook = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== WEBHOOK_PATH) {
    response.writeHead(404, { "Cache-Control": "no-store" });
    response.end("Not found");
    return;
  }
  const data = [];
  let count = 0;
  for await (const chunk of request) {
    count += chunk.length;
    if (count > 32768) {
      response.writeHead(413, { "Cache-Control": "no-store" });
      response.end();
      return;
    }
    data.push(chunk);
  }
  try {
    const req = new Request("http://127.0.0.1" + WEBHOOK_PATH, {
      method: "POST",
      headers: request.headers,
      body: Buffer.concat(data),
    });
    const result = await handleDokuWebhookHttp(req, deps);
    const text = await result.text();
    response.writeHead(result.status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    response.end(text);
    audit("Webhook HTTP status: " + result.status);
  } catch {
    response.writeHead(500, { "Cache-Control": "no-store" });
    response.end();
    audit("ERROR: webhook processing failed");
  }
});

const dashboard = createServer(async (request, response) => {
  if (!localConnection(request) || request.headers.host !== HOST + ":" + DASHBOARD_PORT) {
    response.writeHead(403); response.end(); return;
  }
  if (request.method === "GET" && request.url === "/") {
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'",
    });
    response.end(html());
    return;
  }
  if (request.method === "POST" && request.url === "/checkout") {
    if (request.headers.origin !== "http://" + HOST + ":" + DASHBOARD_PORT ||
        working || orders.size >= 5) {
      response.writeHead(403); response.end(); return;
    }
    working = true;
    try {
      const url = await createCheckout();
      response.writeHead(303, {
        Location: url, "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      });
      response.end();
    } catch (error) {
      audit("FAILED: checkout creation " + (error instanceof Error ? error.message : "unknown"));
      response.writeHead(502, { "Content-Type": "text/plain", "Cache-Control": "no-store" });
      response.end("DOKU Sandbox checkout creation failed; inspect local terminal without sharing secrets.");
    } finally { working = false; }
    return;
  }
  response.writeHead(404, { "Cache-Control": "no-store" });
  response.end("Not found");
});
publicWebhook.on("error", () => {
  console.error("STOP: Cannot bind webhook port 8788. No public tunnel was opened.");
  process.exitCode = 1;
});
dashboard.on("error", () => {
  console.error("STOP: Cannot bind local dashboard port 8789.");
  process.exitCode = 1;
});
publicWebhook.listen(WEBHOOK_PORT, HOST, () => {
  audit("Listening only at 127.0.0.1:8788 (webhook POST path only)");
  dashboard.listen(DASHBOARD_PORT, HOST, () => {
    audit("Local dashboard: http://127.0.0.1:8789");
    audit("Remember: configure DOKU Sandbox notification URL BEFORE creating checkout.");
    audit("No Supabase database or real ebook is connected in this smoke test.");
  });
});
