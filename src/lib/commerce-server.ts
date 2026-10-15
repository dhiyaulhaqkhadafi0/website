import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAuthenticatedSupabaseClient,
  supabaseUrl,
  supabasePublishableKey,
} from "./supabase";
import { createClient } from "@supabase/supabase-js";
import { requireBlogAdmin } from "./blog-auth";
import { safeReturnTo, type Product } from "./commerce-types";
import { hasSameOrigin } from "./request-origin";
export const SESSION_COOKIE = "khadafi-access";
export const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
export const publicClient = () =>
  createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
export async function requireUser(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (.+)$/i)?.[1];
  if (!token)
    return {
      ok: false as const,
      response: json({ error: "Silakan masuk untuk melanjutkan." }, 401),
    };
  const client = createAuthenticatedSupabaseClient(token);
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user || data.user.is_anonymous)
    return {
      ok: false as const,
      response: json({ error: "Sesi berakhir. Silakan masuk kembali." }, 401),
    };
  return { ok: true as const, user: data.user, client, token };
}
export const requireStudio = requireBlogAdmin;
export async function pageUser(returnTo: string, studio = false) {
  const requested = (await headers()).get("x-khadafi-return-to");
  if (requested) returnTo = safeReturnTo(requested);
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login?returnTo=" + encodeURIComponent(returnTo));
  const request = new Request("https://khadafidaffa.com", {
    headers: { authorization: "Bearer " + token },
  });
  const auth = studio
    ? await requireStudio(request)
    : await requireUser(request);
  if (!auth.ok) {
    if (auth.response.status === 403) redirect("/account?access=denied");
    if (auth.response.status === 503) throw new Error("Konfigurasi akses belum tersedia.");
    redirect("/login?returnTo=" + encodeURIComponent(returnTo));
  }
  return auth;
}
export async function publishedProducts() {
  const { data, error } = await publicClient()
    .from("commerce_products")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error("Katalog belum dapat dimuat.");
  return (data || []) as Product[];
}
export async function publishedProduct(slug: string) {
  const { data, error } = await publicClient()
    .from("commerce_products")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Produk belum dapat dimuat.");
  return data as Product | null;
}
export function sameOrigin(request: Request) {
  return hasSameOrigin(request);
}
export function commerceConfigured(paid = false) {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
      (!paid ||
        (process.env.MIDTRANS_SERVER_KEY &&
          process.env.MIDTRANS_ENABLED === "true" &&
          (process.env.NODE_ENV !== "production" ||
            process.env.MIDTRANS_IS_PRODUCTION === "true"))),
  );
}
