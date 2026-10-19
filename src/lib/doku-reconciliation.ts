import type { VerifiedDokuStatus } from "./doku-status-check";

// Pure reconciliation decision engine. The caller performs all external I/O.
// A signed Checkout response alone never grants access: confirm the order
// exists, was pending, has a valid provider checkout URL, and exact amount.
export type PendingDokuOrder = {
  id: string;
  provider: string;
  status: string;
  total: number;
  created_at: string;
  payment_url: string | null;
};
type Dependencies = {
  invoiceForOrder: (id: string) => string;
  isValidSandboxCheckoutUrl: (url: string) => boolean;
  checkStatus: (invoice: string) => Promise<VerifiedDokuStatus>;
  settle: (id: string, amount: number, invoice: string) => Promise<void>;
};
export type ReconciliationSummary = {
  checked: number;
  paid: number;
  pending: number;
  skipped: number;
  failed: number;
};
const MIN_ORDER_AGE_MS = 3 * 60 * 1000; // Check Status >=60s after payment; delay polling.
const MAX_ORDER_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_BATCH = 10;

export async function reconcilePendingDokuOrders(
  rows: PendingDokuOrder[],
  deps: Dependencies,
  nowMs = Date.now(),
): Promise<ReconciliationSummary> {
  const totals: ReconciliationSummary = {
    checked: 0, paid: 0, pending: 0, skipped: 0, failed: 0,
  };
  for (const row of rows.slice(0, MAX_BATCH)) {
    const age = nowMs - Date.parse(row.created_at);
    if (row.provider !== "doku" || row.status !== "pending" ||
        !Number.isSafeInteger(row.total) || row.total <= 0 ||
        !row.payment_url || !deps.isValidSandboxCheckoutUrl(row.payment_url) ||
        !Number.isFinite(age) || age < MIN_ORDER_AGE_MS ||
        age > MAX_ORDER_AGE_MS) {
      totals.skipped++;
      continue;
    }
    try {
      const invoice = deps.invoiceForOrder(row.id);
      const result = await deps.checkStatus(invoice);
      totals.checked++;
      // Strict matching must precede the privileged settlement RPC.
      if (result.invoice !== invoice || result.amount !== row.total) {
        totals.failed++;
        continue;
      }
      // First staging milestone: VA Mandiri only. Do not grant for a
      // different or unspecified channel without separately reviewing it.
      if (result.status === "SUCCESS") {
        if (result.channel !== "VIRTUAL_ACCOUNT_BANK_MANDIRI") {
          totals.failed++;
          continue;
        }
        await deps.settle(row.id, row.total, invoice);
        totals.paid++;
      } else {
        // FAILED/EXPIRED/etc also stay locked; no automatic cancellation
        // while the user might retry another payment channel.
        totals.pending++;
      }
    } catch {
      // Network/auth/DB issues never grant access. Next scheduled pass can retry.
      totals.failed++;
    }
  }
  return totals;
}
