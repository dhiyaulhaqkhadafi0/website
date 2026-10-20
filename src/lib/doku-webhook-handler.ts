// Framework-independent HTTP handling, also imported by local Node tests.
// DOKU HMAC verification and order persistence are injected by the server route.
// A successful browser redirect is NEVER evidence of a successful payment.
export type DokuWebhookDependencies = {
  verify: (headers: Headers, body: string) => boolean;
  decodeInvoice: (invoice: string) => string | null;
  invoiceForOrder: (orderId: string) => string;
  canSettle: () => boolean;
  settle: (orderId: string, amount: number, reference: string) => Promise<void>;
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function handleDokuWebhookHttp(
  request: Request,
  deps: DokuWebhookDependencies,
): Promise<Response> {
  const raw = await request.text();
  if (!deps.verify(request.headers, raw)) {
    return json({ error: "Invalid DOKU signature" }, 401);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid notification" }, 400);
  }
  const event = payload as {
    order?: { invoice_number?: unknown; amount?: unknown };
    transaction?: { status?: unknown };
  } | null;
  const invoice = event?.order?.invoice_number;
  const status = event?.transaction?.status;
  if (typeof invoice !== "string" || typeof status !== "string") {
    return json({ error: "Invalid notification" }, 400);
  }

  // DOKU Checkout may retry another method after a failure. Never grant
  // entitlement until a correctly signed SUCCESS event has been persisted.
  if (status !== "SUCCESS") return json({ ok: true, ignored: true });

  const id = deps.decodeInvoice(invoice);
  const amount = Number(event?.order?.amount);
  if (!id || !Number.isSafeInteger(amount) || amount <= 0) {
    return json({ error: "Invalid order or amount" }, 400);
  }
  if (!deps.canSettle()) return json({ error: "Unavailable" }, 503);
  try {
    await deps.settle(id, amount, deps.invoiceForOrder(id));
    return json({ ok: true });
  } catch {
    // Non-2xx response requests DOKU to retry delivery. Never acknowledge
    // an unpersisted payment. Avoid leaking invoice or identity in logs.
    return json({ error: "Retry notification" }, 503);
  }
}
