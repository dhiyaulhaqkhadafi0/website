import { timingSafeEqual } from "node:crypto";
import { createServiceRoleClient } from "@/lib/supabase";
import { dokuConfigured } from "@/lib/doku";
import { dokuInvoice } from "@/lib/doku-security";
import { isAllowedDokuCheckoutUrl } from "@/lib/doku-checkout-host";
import { checkDokuSandboxStatus } from "@/lib/doku-status-check";
import { reconcilePendingDokuOrders } from "@/lib/doku-reconciliation";

// PREPARED, DISABLED-BY-DEFAULT reconciliation entry point.
// Only a PRIVATE server-side scheduler or operator should POST here.
// DO NOT point the public DOKU webhook tunnel to this route.
// Staging-bound even if code is present in a Cloudflare branch build.
export const dynamic = "force-dynamic";

function reply(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function authorized(provided: string, expected: string): boolean {
  if (!expected || expected.length < 32 || !provided.startsWith("Bearer ")) return false;
  const supplied = Buffer.from(provided.slice("Bearer ".length), "utf8");
  const secret = Buffer.from(expected, "utf8");
  return supplied.length === secret.length && timingSafeEqual(supplied, secret);
}

function isolatedSandboxReady(): boolean {
  return process.env.DOKU_RECONCILE_ENABLED === "true" &&
    process.env.DOKU_LOCAL_STAGING_ONLY === "true" &&
    process.env.DOKU_IS_PRODUCTION !== "true" &&
    process.env.DOKU_PRODUCTION_APPROVED !== "true" &&
    process.env.DOKU_SITE_ORIGIN === "https://doku-staging.khadafidaffa.com" &&
    ["http://127.0.0.1:54321", "http://localhost:54321"].includes(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    ) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    dokuConfigured();
}

export async function POST(request: Request) {
  // Disabled by default in all deployed environments, including production.
  if (!isolatedSandboxReady()) return reply({ error: "Not found" }, 404);
  // Only reachable on same computer as staging Next, never over a public tunnel.
  const host = request.headers.get("host") || new URL(request.url).host;
  if (!["localhost:3000", "127.0.0.1:3000"].includes(host)) {
    return reply({ error: "Not found" }, 404);
  }
  if (!authorized(
    request.headers.get("authorization") || "",
    process.env.DOKU_RECONCILE_TOKEN || "",
  )) return reply({ error: "Unauthorized" }, 401);

  try {
    const db = createServiceRoleClient();
    const now = Date.now();
    const { data, error } = await db.from("commerce_orders")
      .select("id,provider,status,total,created_at,payment_url")
      .eq("provider", "doku")
      .eq("status", "pending")
      .not("payment_url", "is", null)
      .lte("created_at", new Date(now - 3 * 60 * 1000).toISOString())
      .gte("created_at", new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true })
      .limit(10);
    if (error || !data) return reply({ error: "Staging database unavailable" }, 503);
    const { clientId, secretKey } = {
      clientId: process.env.DOKU_CLIENT_ID || "",
      secretKey: process.env.DOKU_SECRET_KEY || "",
    };
    const summary = await reconcilePendingDokuOrders(data, {
      invoiceForOrder: dokuInvoice,
      isValidSandboxCheckoutUrl: (url) => isAllowedDokuCheckoutUrl(url, false),
      checkStatus: (invoice) => checkDokuSandboxStatus(
        invoice, { clientId, secretKey },
      ),
      settle: async (orderId, amount, reference) => {
        // Same atomic, service-role-only RPC used by the signed webhook.
        // Duplicate successful reconciliation/webhook calls are idempotent.
        const { error: updateError } = await db.rpc("commerce_set_payment_doku", {
          p_order: orderId, p_total: amount, p_reference: reference,
        });
        if (updateError) throw new Error("Payment persistence failed");
      },
    }, now);
    return reply({ ok: true, ...summary });
  } catch {
    return reply({ error: "Reconciliation unavailable" }, 503);
  }
}
