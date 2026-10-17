import "server-only";
import { createHmac, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { createServiceRoleClient } from "./supabase";
const cookieName = (order: string) => "khadafi-order-" + order;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function signature(payload: string) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Guest checkout unavailable");
  return createHmac("sha256", key).update("khadafi:guest-order:v1:" + payload).digest("base64url");
}
export async function grantGuestOrder(order: string) {
  const payload = order + "." + (Math.floor(Date.now() / 1000) + 30 * 86400);
  (await cookies()).set(cookieName(order), payload + "." + signature(payload), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30 * 86400 });
}
export async function ownsGuestOrder(order: string) {
  if (!uuid.test(order)) return false;
  const token = (await cookies()).get(cookieName(order))?.value;
  if (!token || token.length > 180 || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
  const [id, expires, signed] = token.split(".");
  if (id !== order || !/^\d{10}$/.test(expires || "") || Number(expires) <= Date.now() / 1000 || !signed) return false;
  const expected = Buffer.from(signature(id + "." + expires));
  const actual = Buffer.from(signed);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
export async function guestOrder(order: string) {
  if (!await ownsGuestOrder(order)) return null;
  const { data, error } = await createServiceRoleClient().from("commerce_orders").select("*,commerce_order_items(*)").eq("id", order).maybeSingle();
  return error ? null : data;
}
export function guestFingerprint(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") || "local";
  return createHash("sha256").update("guest-checkout:" + process.env.SUPABASE_SERVICE_ROLE_KEY + ":" + ip).digest("hex");
}
