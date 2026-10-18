import { createServiceRoleClient } from "@/lib/supabase";
import { dokuInvoice, orderIdFromDokuInvoice, verifyDokuNotification } from "@/lib/doku";
import { handleDokuWebhookHttp } from "@/lib/doku-webhook-handler";

export async function POST(request: Request) {
  return handleDokuWebhookHttp(request, {
    verify: verifyDokuNotification,
    decodeInvoice: orderIdFromDokuInvoice,
    invoiceForOrder: dokuInvoice,
    canSettle: () => Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    settle: async (orderId, amount, reference) => {
      const db = createServiceRoleClient();
      const { error } = await db.rpc("commerce_set_payment_doku", {
        p_order: orderId,
        p_total: amount,
        p_reference: reference,
      });
      if (error) throw new Error("Payment persistence failed");
      console.info("commerce.doku.payment", { order_id: orderId, status: "paid" });
    },
  });
}
