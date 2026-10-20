import { createServiceRoleClient } from "@/lib/supabase";
import { dokuInvoice, orderIdFromDokuInvoice, verifyDokuNotification } from "@/lib/doku";
import { handleDokuWebhookHttp } from "@/lib/doku-webhook-handler";
import { dokuPolicy } from "@/lib/doku-config";

export async function POST(request: Request) {
  return handleDokuWebhookHttp(request, {
    verify: verifyDokuNotification,
    decodeInvoice: orderIdFromDokuInvoice,
    invoiceForOrder: dokuInvoice,
    canSettle: () => Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    persist: async (event) => {
      const db = createServiceRoleClient();
      const { error } = await db.rpc("commerce_record_doku_event", {
        p_order: event.orderId, p_total: event.amount, p_reference: event.reference,
        p_environment: dokuPolicy(process.env).environment,
        p_event: event.eventId, p_hash: event.bodyHash,
        p_status: event.status, p_channel: event.channel,
      });
      if (error) throw new Error("Payment persistence failed");
      console.info("commerce.doku.notification", { status: event.status, channel: event.channel });
    },
  });
}
