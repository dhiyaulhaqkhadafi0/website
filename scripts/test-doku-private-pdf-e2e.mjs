// End-to-end isolated CI test: actual Next.js API routes + actual local
// Supabase Auth/REST/Storage/PG. No DOKU API and NO cloud Supabase.
// This file is ONLY for ephemeral GitHub Actions runner with local API.
// Uses fabricated users, products, payments and a synthetic PDF.
// Private URLs, credentials, emails and cookies are never printed.
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { dokuInvoice, signature as dokuSignature } from "../src/lib/doku-security.ts";

const base = "http://127.0.0.1:3000";
const api = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const fail = reason => { throw new Error(reason); };
if (process.env.GITHUB_ACTIONS !== "true" ||
    process.env.DOKU_LOCAL_STAGING_ONLY !== "true" ||
    process.env.DOKU_IS_PRODUCTION !== "false" ||
    process.env.DOKU_ENABLED !== "true" ||
    process.env.DOKU_CLIENT_ID !== "BRN-CI-FAKE-ONLY" ||
    process.env.DOKU_SECRET_KEY !== "CI-FAKE-HMAC-KEY-NOT-A-DOKU-SECRET" ||
    process.env.DOKU_SITE_ORIGIN !== "https://doku-staging.khadafidaffa.com" ||
    api !== "http://127.0.0.1:54321" ||
    !anonKey || !serviceKey || anonKey.length < 40 || serviceKey.length < 40 ||
    process.env.SUPABASE_ACCESS_TOKEN) {
  fail("STOP: synthetic PDF test is restricted to disposable GitHub runner + local Supabase");
}
const admin = createClient(api, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anonymous = createClient(api, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const must = (result, phase) => {
  if (result.error || result.data == null) {
    // Error values may carry internal data, never print them in CI.
    fail("Isolated Supabase fixture failed at " + phase);
  }
  return result.data;
};
const fresh = randomUUID().replaceAll("-", "");
const accountA = "doku-private-test-a-" + fresh.slice(0, 12) + "@example.invalid";
const accountB = "doku-private-test-b-" + fresh.slice(0, 12) + "@example.invalid";
const passwordA = randomUUID() + "Aa1!";
const passwordB = randomUUID() + "Bb2!";

const a = must(await admin.auth.admin.createUser({
  email: accountA, password: passwordA, email_confirm: true,
}), "create test buyer A").user;
const b = must(await admin.auth.admin.createUser({
  email: accountB, password: passwordB, email_confirm: true,
}), "create test buyer B").user;
assert.ok(a.id && b.id && a.id !== b.id);

async function buyerToken(email, password) {
  const auth = createClient(api, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const result = must(await auth.auth.signInWithPassword({
    email, password,
  }), "login synthetic buyer");
  assert.ok(result.session?.access_token);
  return result.session.access_token;
}
const jwtA = await buyerToken(accountA, passwordA);
const jwtB = await buyerToken(accountB, passwordB);

const storagePath = "ci-disposable/" + fresh + "/sandbox-only.pdf";
const dummy = Buffer.from(
  "%PDF-1.4\n% ISOLATED SANDBOX PRIVATE FILE, NOT A REAL EBOOK\n" +
  "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
  "2 0 obj\n<< /Type /Pages /Kids [] /Count 0 >>\nendobj\n" +
  "trailer\n<< /Root 1 0 R >>\n%%EOF\n",
);
must(await admin.storage.from("commerce-files").upload(
  storagePath, dummy, { contentType: "application/pdf", upsert: false },
), "private fixture upload");

const product = must(await admin.from("commerce_products")
  .insert({
    name: "Temporary DOKU Private PDF CI Fixture",
    slug: "doku-private-" + fresh.slice(0, 20),
    price: 59000, currency: "IDR", status: "draft",
    category: "Ebook", featured: false,
  }).select("id").single(), "create draft fixture product");
must(await admin.from("commerce_product_files")
  .insert({
    product_id: product.id, storage_path: storagePath,
    name: "SANDBOX-TEST-ONLY.pdf",
  }).select("id").single(), "attach private PDF metadata");
must(await admin.from("commerce_products")
  .update({ status: "published" })
  .eq("id", product.id)
  .select("id").single(), "publish synthetic product");

const order = must(await admin.rpc("commerce_create_order_doku", {
  p_user: a.id,
  p_product: product.id,
  p_name: "Isolated CI Buyer",
  p_email: accountA,
  p_key: randomUUID(),
}), "create pending DOKU order");
assert.equal(order.status, "pending");
assert.equal(order.total, 59000);
assert.equal(order.provider, "doku");
console.log("PASS: two isolated Auth users, private PDF and pending Rp59000 DOKU order exist");

function guestCookie(id, tamper = false) {
  const payload = id + "." + (Math.floor(Date.now() / 1000) + 86400);
  const signature = createHmac("sha256", serviceKey)
    .update("khadafi:guest-order:v1:" + payload).digest("base64url");
  return "khadafi-order-" + id + "=" + payload + "." + (tamper ? "incorrect" : signature);
}
async function post(urlPath, data, { token, cookie, origin = base } = {}) {
  const headers = { "Content-Type": "application/json", Origin: origin };
  if (token) headers.Authorization = "Bearer " + token;
  if (cookie) headers.Cookie = cookie;
  const response = await fetch(base + urlPath, {
    method: "POST", headers, body: JSON.stringify(data),
    redirect: "manual", signal: AbortSignal.timeout(45000),
  });
  assert.match(response.headers.get("cache-control") || "", /no-store/i);
  const raw = await response.text();
  let body;
  try { body = JSON.parse(raw); } catch { fail("Download API did not return JSON"); }
  return { status: response.status, body };
}
const own = { product_id: product.id };
const guest = { order: order.id, product: product.id };
const userPath = "/api/commerce/download";
const guestPath = "/api/commerce/guest-download";

assert.equal((await post(userPath, own)).status, 401);
assert.equal((await post(userPath, own, { token: jwtA })).status, 403);
assert.equal((await post(userPath, own, { token: jwtB })).status, 403);
assert.equal((await post(guestPath, guest)).status, 403);
assert.equal((await post(guestPath, guest, { cookie: guestCookie(order.id, true) })).status, 403);
assert.equal((await post(guestPath, guest, { cookie: guestCookie(order.id) })).status, 403);
assert.equal((await post(guestPath, guest, {
  cookie: guestCookie(order.id), origin: "https://evil.example",
})).status, 403);
console.log("PASS: actual Next.js APIs forbid unpaid, unauthenticated and forged guest download");

const denied = await anonymous.storage.from("commerce-files").createSignedUrl(storagePath, 900);
assert.ok(denied.error || !denied.data?.signedUrl);
const direct = await fetch(api + "/storage/v1/object/public/commerce-files/" + storagePath);
assert.notEqual(direct.status, 200);
console.log("PASS: actual private Storage bucket denies anonymous public access and URL creation");

// This is an INERT synthetic notification delivered to the REAL Next.js
// POST /api/commerce/doku/webhook route, using CI-only fake HMAC credentials.
// NO request is sent to DOKU and no real payment/transaction is simulated there.
const reference = dokuInvoice(order.id);
const webhookPath = "/api/commerce/doku/webhook";
function signedWebhookPayload(amount = 59000, status = "SUCCESS", invoice = reference) {
  return JSON.stringify({
    service: { id: "VIRTUAL_ACCOUNT" },
    channel: { id: "VIRTUAL_ACCOUNT_BANK_MANDIRI" },
    order: { invoice_number: invoice, amount },
    transaction: { status, date: new Date().toISOString() },
  });
}
async function notify(payload, { tamper = false, wrongPath = false, unsigned = false } = {}) {
  const requestId = randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const headers = {
    "Content-Type": "application/json",
    "Client-Id": process.env.DOKU_CLIENT_ID,
    "Request-Id": requestId,
    "Request-Timestamp": timestamp,
  };
  if (!unsigned) headers.Signature = tamper ? "HMACSHA256=forged" : dokuSignature(
    process.env.DOKU_CLIENT_ID, requestId, timestamp,
    wrongPath ? "/api/incorrect" : webhookPath,
    payload, process.env.DOKU_SECRET_KEY,
  );
  const response = await fetch(base + webhookPath, {
    method: "POST",
    headers, body: payload,
    redirect: "manual", signal: AbortSignal.timeout(15000),
  });
  assert.match(response.headers.get("cache-control") || "", /no-store/i);
  return response.status;
}
const successPayload = signedWebhookPayload();
assert.equal(await notify(successPayload, { unsigned: true }), 401);
assert.equal(await notify(successPayload, { tamper: true }), 401);
assert.equal(await notify(successPayload, { wrongPath: true }), 401);
assert.equal(await notify(signedWebhookPayload(59000, "FAILED")), 200);
assert.equal(await notify(signedWebhookPayload(58000, "SUCCESS")), 503);
assert.equal(await notify(signedWebhookPayload(59000, "SUCCESS", dokuInvoice(randomUUID()))), 503);

let access = await post(userPath, own, { token: jwtA });
assert.equal(access.status, 403);
const eBefore = must(await admin.from("commerce_entitlements")
  .select("id").eq("order_id", order.id), "query pre-payment entitlements");
assert.equal(eBefore.length, 0);
console.log("PASS: real webhook rejects unsigned/forged/wrong-target, ignores FAILED and denies bad invoice/amount");

// Only a valid HMAC-signed SUCCESS may settle the order by calling the
// actual Next.js route -> service role DOKU RPC -> entitlement creation.
assert.equal(await notify(successPayload), 200);
assert.equal(await notify(successPayload), 200);
const paidOrder = must(await admin.from("commerce_orders")
  .select("status,payment_reference").eq("id", order.id).single(), "read paid order");
assert.equal(paidOrder.status, "paid");
assert.equal(paidOrder.payment_reference, reference);
const eAfter = must(await admin.from("commerce_entitlements")
  .select("id,user_id,resource_id,status")
  .eq("order_id", order.id), "query post-payment entitlements");
assert.equal(eAfter.length, 1);
assert.equal(eAfter[0].user_id, a.id);
assert.equal(eAfter[0].resource_id, product.id);
assert.equal(eAfter[0].status, "active");
console.log("PASS: REAL HTTP signed webhook SUCCESS updates order and repeated delivery grants ONE entitlement");

access = await post(userPath, own, { token: jwtA });
assert.equal(access.status, 200);
assert.equal(access.body?.files?.length, 1);
const signedUrl = access.body.files[0].url;
assert.ok(typeof signedUrl === "string");
const link = new URL(signedUrl);
assert.equal(link.origin, api);
assert.ok(link.pathname.startsWith("/storage/v1/object/sign/commerce-files/"));
const downloaded = await fetch(signedUrl, { signal: AbortSignal.timeout(10000) });
assert.equal(downloaded.status, 200);
assert.deepEqual(Buffer.from(await downloaded.arrayBuffer()), dummy);
assert.equal((await post(userPath, own, { token: jwtB })).status, 403);
assert.equal((await post(guestPath, guest)).status, 403);
assert.equal((await post(guestPath, guest, { cookie: guestCookie(order.id, true) })).status, 403);
const guestAccess = await post(guestPath, guest, { cookie: guestCookie(order.id) });
assert.equal(guestAccess.status, 200);
assert.equal(guestAccess.body.files.length, 1);
const guestFile = await fetch(guestAccess.body.files[0].url);
assert.equal(guestFile.status, 200);
assert.deepEqual(Buffer.from(await guestFile.arrayBuffer()), dummy);
console.log("PASS: only authorized buyer or signed guest-order cookie can REQUEST the temporary private PDF URL");

// A signed URL is a bearer capability: anyone possessing the URL can use it
// until expiry. Test its expiry claim when present, but never claim URL is
// recipient-bound or use an actual sensitive file in this disposable fixture.
const token = link.searchParams.get("token");
assert.ok(token, "Storage signed URL token missing");
const encoded = token.split(".")[1];
if (encoded) {
  const claims = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (typeof claims.exp === "number" && typeof claims.iat === "number") {
    const ttl = claims.exp - claims.iat;
    assert.ok(ttl > 0 && ttl <= 900, "Storage temporary signed URL longer than 15 minutes");
  }
}
console.log("PASS: private download requires a signed temporary Storage token");

// Revocation must block issuing NEW links, although previously issued
// bearer URLs may remain usable until expiration.
const revoked = await admin.from("commerce_entitlements")
  .update({ status: "revoked" }).eq("order_id", order.id);
if (revoked.error) fail("Could not revoke test entitlement");
assert.equal((await post(userPath, own, { token: jwtA })).status, 403);
assert.equal((await post(guestPath, guest, { cookie: guestCookie(order.id) })).status, 403);
console.log("PASS: revoked entitlement prevents new signed download URLs");

console.log("SUCCESS: real Next.js signed synthetic webhook -> Supabase PG entitlement -> private PDF E2E PASSED");
console.log("No DOKU payment was created; data exists only in disposable CI runner.");
