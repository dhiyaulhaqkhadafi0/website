import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabasePublishableKey } from "./supabase";
import { classifyAffiliateSource, slugPattern, validDestination } from "./affiliate-validation";

export const affiliateEnvironment = () => process.env.AFFILIATE_ENVIRONMENT === "production" ? "production" as const : "preview" as const;
export const allowedAffiliateHosts = () => ["refer.micro1.ai", ...(process.env.AFFILIATE_ALLOWED_HOSTS || "").split(",").map(h=>h.trim().toLowerCase()).filter(h=>/^[a-z0-9.-]+$/.test(h))];
export const affiliateJson = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } });
export function trackingSecret() { const secret = process.env.AFFILIATE_TRACKING_SECRET; return secret && secret.length >= 32 ? secret : null; }
export function trackerQuery(url: URL) {
  if ([...url.searchParams.keys()].some(k=>k !== "campaign") || url.searchParams.getAll("campaign").length > 1) throw new Error("Parameter tautan tidak valid.");
  const campaign = url.searchParams.get("campaign") || "";
  if (campaign && (campaign.length>80 || !slugPattern.test(campaign))) throw new Error("Campaign tidak valid.");
  return campaign;
}
export function isTrackingAutomation(request: Request) {
  return /bot|crawler|spider|slurp|facebookexternalhit|headless|preview|whatsapp|telegram|curl|wget/i.test(request.headers.get("user-agent") || "") || /prefetch|prerender/i.test([request.headers.get("purpose"),request.headers.get("sec-purpose"),request.headers.get("next-router-prefetch")].join(" "));
}
type NavigationToken = { id: string; slug: string; campaign: string; source: string; expires: number };
async function signature(payload: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name:"HMAC",hash:"SHA-256" },false,["sign"]);
  return Buffer.from(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(payload))).toString("base64url");
}
export async function issueNavigationToken(slug: string, campaign: string, request: Request) {
  const secret = trackingSecret(); if (!secret) throw new Error("Tracking belum dikonfigurasi.");
  const payload = Buffer.from(JSON.stringify({ id:crypto.randomUUID(),slug,campaign,source:classifyAffiliateSource(request.headers.get("referer")),expires:Date.now()+120000 } satisfies NavigationToken)).toString("base64url");
  return `${payload}.${await signature(payload,secret)}`;
}
export async function readNavigationToken(value: string): Promise<NavigationToken | null> {
  const secret = trackingSecret(); if (!secret || value.length>1500) return null;
  try {
    const [payload,received,...extra] = value.split("."); if (!payload || !received || extra.length) return null;
    const expected = await signature(payload,secret);
    if (received.length!==expected.length) return null;
    let mismatch=0; for(let i=0;i<expected.length;i++) mismatch |= received.charCodeAt(i)^expected.charCodeAt(i); if(mismatch) return null;
    const token=JSON.parse(Buffer.from(payload,"base64url").toString()) as NavigationToken;
    return token.expires>Date.now() && token.expires<=Date.now()+125000 ? token : null;
  } catch { return null; }
}
export async function resolveAffiliate(slug: string, campaign: string, event: NavigationToken | null = null) {
  const secret = trackingSecret(); if (!secret) throw new Error("Tracking belum dikonfigurasi.");
  const client = createClient(supabaseUrl,supabasePublishableKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const result = await client.rpc("affiliate_track", { p_secret:secret,p_slug:slug,p_campaign:campaign,p_event_id:event?.id ?? null,p_source:event?.source ?? "direct",p_record:Boolean(event) }).abortSignal(AbortSignal.timeout(3500));
  if (result.error || !result.data) throw new Error("Tautan belum dapat diperiksa. Silakan coba lagi.");
  const data = result.data as { status:string; destination?:string; name?:string; recorded?:boolean; limited?:boolean; environment?:string };
  if(data.status === "ok" && data.environment !== affiliateEnvironment()) throw new Error("Scope tracking belum sesuai konfigurasi.");
  if (data.status === "ok" && (!data.destination || !validDestination(data.destination,allowedAffiliateHosts()))) throw new Error("Tujuan tautan belum disetujui.");
  return data;
}
export async function boundedText(request: Request, limit = 4096) {
  const reader = request.body?.getReader(); if (!reader) return "";
  const parts: Uint8Array[]=[]; let size=0;
  while(true){ const {done,value}=await reader.read(); if(done) break; size+=value.byteLength; if(size>limit){await reader.cancel();throw new Error("Permintaan terlalu besar.");} parts.push(value); }
  return new TextDecoder().decode(Buffer.concat(parts));
}
