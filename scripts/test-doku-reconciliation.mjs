// No internet, no Supabase, no paid Sandbox transactions, no real credentials.
// Run: node scripts/test-doku-reconciliation.mjs (Node 24+).
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { checkDokuSandboxStatus } from "../src/lib/doku-status-check.ts";
import { reconcilePendingDokuOrders } from "../src/lib/doku-reconciliation.ts";
import { dokuInvoice } from "../src/lib/doku-security.ts";
import { isAllowedDokuCheckoutUrl } from "../src/lib/doku-checkout-host.ts";

const clientId = "BRN-FAKE-TEST";
const secretKey = "TEST-ONLY-NEVER-REAL-SECRET";
const uuid = randomUUID();
const invoice = dokuInvoice(uuid);
const makeRow = (id = uuid, patch = {}) => ({
  id, provider: "doku", status: "pending", total: 59000,
  created_at: "2026-10-19T00:00:00Z",
  payment_url: "https://staging.doku.com/checkout/TEST", ...patch,
});
const now = Date.parse("2026-10-19T00:30:00Z");
function fakeFetchFactory(opts = {}) {
  return async (url, request) => {
    assert.equal(new URL(url).origin, "https://api-sandbox.doku.com");
    assert.equal(request.method, "GET");
    assert.ok(!request.headers.Digest);
    assert.equal(request.headers["Client-Id"], clientId);
    const target = new URL(url).pathname;
    const responseTime = "2026-10-19T00:30:02Z";
    const headers = new Headers({
      "Client-Id": clientId,
      "Request-Id": request.headers["Request-Id"],
      "Response-Timestamp": responseTime,
    });
    const body = JSON.stringify({
      order: { invoice_number: opts.invoice || invoice,
        amount: opts.amount ?? 59000, currency: opts.currency || "IDR" },
      transaction: { status: opts.status || "SUCCESS" },
      channel: { id: opts.channel || "VIRTUAL_ACCOUNT_BANK_MANDIRI" },
    });
    const signed = [
      "Client-Id:" + clientId,
      "Request-Id:" + request.headers["Request-Id"],
      "Response-Timestamp:" + responseTime,
      "Request-Target:" + target,
    ].join("\n");
    const signature = "HMACSHA256=" +
      createHmac("sha256", secretKey).update(signed).digest("base64");
    if (!opts.unsigned) headers.set("Signature", opts.tamper ? "HMACSHA256=wrong" : signature);
    return new Response(body, {
      status: opts.httpStatus || 200,
      headers,
    });
  };
}
const creds = { clientId, secretKey };
const check = (opts = {}) => checkDokuSandboxStatus(
  invoice, creds, fakeFetchFactory(opts),
);
const valid = await check();
assert.deepEqual(valid, {
  invoice, amount: 59000, status: "SUCCESS", channel: "VIRTUAL_ACCOUNT_BANK_MANDIRI",
});
console.log("PASS: signed DOKU Sandbox Check Status SUCCESS verified");

for (const [label, bad] of [
  ["unsigned", { unsigned: true }],
  ["tampered signature", { tamper: true }],
  ["HTTP error", { httpStatus: 401 }],
  ["wrong invoice", { invoice: dokuInvoice(randomUUID()) }],
  ["unknown status", { status: "NOT_A_DOKU_STATUS" }],
  ["wrong currency", { currency: "USD" }],
]) {
  await assert.rejects(() => check(bad), undefined, label);
}
// The status client authenticates the provider response and validates amount
// shape; it cannot know the database order total. A different positive amount
// must be rejected by reconciliation BEFORE calling privileged settlement.
const unexpectedAmount = await check({ amount: 59001 });
assert.equal(unexpectedAmount.amount, 59001);
console.log("PASS: signed status client rejects bad signature/HTTP/invoice/status/currency");
console.log("PASS: signed mismatching amount remains visible to reconciliation");

const paid = new Set();
const records = new Map([[uuid, makeRow()]]);
let settleCalls = 0;
function deps(status, opts = {}) {
  return {
    invoiceForOrder: dokuInvoice,
    isValidSandboxCheckoutUrl: url => isAllowedDokuCheckoutUrl(url, false),
    checkStatus: async i => ({ invoice: i, amount: 59000,
      status, channel: opts.channel ?? "VIRTUAL_ACCOUNT_BANK_MANDIRI" }),
    settle: async (id, amount, i) => {
      settleCalls++;
      if (opts.dbError) throw new Error("Fake DB down");
      const o = records.get(id);
      if (!o || amount !== o.total || i !== dokuInvoice(id)) throw new Error("Mismatch");
      paid.add(id); // mimics the real RPC's unique-on-conflict behavior
    },
  };
}
let summary = await reconcilePendingDokuOrders([makeRow()], deps("PENDING"), now);
assert.equal(summary.paid, 0);
assert.equal(summary.pending, 1);
assert.equal(paid.size, 0);
for (const status of ["FAILED", "EXPIRED", "REFUNDED", "TIMEOUT", "REDIRECT"]) {
  summary = await reconcilePendingDokuOrders([makeRow()], deps(status), now);
  assert.equal(summary.paid, 0);
  assert.equal(paid.size, 0);
}
console.log("PASS: pending and non-SUCCESS statuses cannot unlock product");

const skippedRows = [
  makeRow(uuid, { provider: "free" }),
  makeRow(uuid, { status: "paid" }),
  makeRow(uuid, { total: -1 }),
  makeRow(uuid, { payment_url: null }),
  makeRow(uuid, { payment_url: "https://evil.example/token" }),
  makeRow(uuid, { created_at: "2026-10-19T00:29:10Z" }),
  makeRow(uuid, { created_at: "2026-09-01T00:00:00Z" }),
  makeRow(uuid, { created_at: "no-date" }),
];
summary = await reconcilePendingDokuOrders(skippedRows, deps("SUCCESS"), now);
assert.equal(summary.skipped, skippedRows.length);
assert.equal(summary.checked, 0);
assert.equal(paid.size, 0);
console.log("PASS: non-DOKU/unpaid/not-ready/unsafe URL and old orders skipped");

summary = await reconcilePendingDokuOrders([makeRow()], deps("SUCCESS", {
  channel: "VIRTUAL_ACCOUNT_BANK_BCA",
}), now);
assert.equal(summary.paid, 0);
assert.equal(summary.failed, 1);
assert.equal(paid.size, 0);
console.log("PASS: unexpected DOKU channel cannot unlock product");

// Exercise a properly HMAC-signed (but wrong-amount) provider response
// through the real status parser AND the reconciliation decision engine.
summary = await reconcilePendingDokuOrders([makeRow()], {
  ...deps("SUCCESS"),
  checkStatus: () => check({ amount: 59001 }),
}, now);
assert.equal(summary.checked, 1);
assert.equal(summary.paid, 0);
assert.equal(summary.failed, 1);
assert.equal(paid.size, 0);
console.log("PASS: signed mismatch amount prevents settlement");

summary = await reconcilePendingDokuOrders([makeRow()], deps("SUCCESS", { dbError: true }), now);
assert.equal(summary.paid, 0);
assert.equal(summary.failed, 1);
assert.equal(paid.size, 0);
console.log("PASS: failed persistence does not grant entitlement");

summary = await reconcilePendingDokuOrders([makeRow()], deps("SUCCESS"), now);
assert.equal(summary.paid, 1);
assert.equal(paid.size, 1);
summary = await reconcilePendingDokuOrders([makeRow()], deps("SUCCESS"), now);
assert.equal(summary.paid, 1);
assert.equal(paid.size, 1);
assert.ok(settleCalls >= 2);
console.log("PASS: valid SUCCESS grants exactly one entitlement, repeat stays idempotent");

const multiple = Array.from({ length: 16 }, (_, i) => makeRow(uuid, { total: 59000 }));
summary = await reconcilePendingDokuOrders(multiple, deps("PENDING"), now);
assert.equal(summary.checked, 10);
console.log("PASS: batch bounded to 10 orders");

console.log("SUCCESS: DOKU reconciliation offline tests passed; no live gateway or DB touched");
