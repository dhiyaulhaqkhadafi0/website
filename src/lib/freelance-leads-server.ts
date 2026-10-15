import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabasePublishableKey } from "./supabase";
import { hasSameOrigin } from "./request-origin";

export const freelanceClient = () => createClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
export const leadJson = (data: unknown, status = 200, extra: Record<string,string> = {}) => Response.json(data, { status, headers: { "Cache-Control": "no-store", ...extra } });
export const signupSecret = () => process.env.FREELANCE_SIGNUP_SECRET || process.env.ENGAGEMENT_SIGNING_SECRET;
export function sameLeadOrigin(request: Request) {
  return hasSameOrigin(request);
}
export async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2,"0")).join("");
}
export async function clientHash(request: Request, secret: string) {
  // Cloudflare overwrites this header at ingress. No raw IP is persisted.
  const ip = request.headers.get("cf-connecting-ip") || "local-or-unavailable";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip));
  return [...new Uint8Array(signature)].map(b => b.toString(16).padStart(2,"0")).join("");
}
export async function smallJson(request: Request): Promise<Record<string,unknown> | null> {
  if (!request.headers.get("content-type")?.includes("application/json")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  let text = "", size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return null; }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const result = JSON.parse(text);
    return result && typeof result === "object" && !Array.isArray(result) ? result : null;
  } catch { return null; }
}
