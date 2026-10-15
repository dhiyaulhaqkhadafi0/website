import { requireStudio, json } from "@/lib/commerce-server";
export async function GET(request: Request) {
  const auth = await requireStudio(request);
  if (!auth.ok) return auth.response;
  const { data, error } = await auth.client
    .from("commerce_orders")
    .select("*,commerce_order_items(*)")
    .order("created_at", { ascending: false })
    .limit(250);
  return error
    ? json({ error: "Pesanan belum dapat dimuat." }, 500)
    : json({ orders: data });
}
