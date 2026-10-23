import type { AffiliateEntity } from "./affiliate-types";

export const MICRO1_REFERRAL_URL = "https://refer.micro1.ai/referral/jobs?referralCode=b22f58a9-d462-4389-ab54-34e45d361215&utm_source=referral&utm_medium=share&utm_campaign=job_referral";
export const affiliateEntities: AffiliateEntity[] = ["programs", "links", "campaigns", "commissions"];
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function isAffiliateEntity(value: string): value is AffiliateEntity { return affiliateEntities.includes(value as AffiliateEntity); }
export function validDestination(value: string, allowedHosts: string[] = ["refer.micro1.ai"]): boolean {
  try { const u = new URL(value); return value.length <= 2048 && !/[\s\\\u0000-\u001f]/.test(value) && u.protocol === "https:" && !u.username && !u.password && !u.hash && !u.port && allowedHosts.includes(u.hostname) && value.startsWith(`https://${u.hostname}/`); } catch { return false; }
}
export function validateAffiliate(entity: AffiliateEntity, body: Record<string, unknown>, hosts = ["refer.micro1.ai"]) {
  const data: Record<string, string | number | null> = {};
  const text = (key: string, max = 120, required = false) => {
    if (typeof body[key] !== "string" && body[key] != null) throw new Error(`${key}: teks tidak valid.`);
    const value = String(body[key] ?? "").trim();
    if (value.length > max || (required && !value) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) throw new Error(`${key}: isi wajib diisi dan tidak melebihi ${max} karakter.`);
    data[key] = value; return value;
  };
  const choice = (key: string, choices: string[]) => { const value = text(key, 30, true); if (!choices.includes(value)) throw new Error(`${key}: pilihan tidak valid.`); return value; };
  const reference = (key: string, required = true) => { const value = text(key, 36, required); if (value && !uuidPattern.test(value)) throw new Error(`${key}: ID tidak valid.`); data[key] = value || null; };
  const date = (key: string) => { const value = text(key, 40); if (value && (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value) || !Number.isFinite(Date.parse(value)))) throw new Error(`${key}: tanggal tidak valid.`); data[key] = value ? new Date(value).toISOString() : null; };
  text("notes", 2000);
  if (entity !== "commissions") {
    text("name", 120, true);
    const slug = text("slug", 80, true); if (!slugPattern.test(slug)) throw new Error("Slug hanya huruf kecil, angka, dan tanda hubung.");
    choice("status", entity === "links" ? ["active", "paused", "archived"] : ["draft", "active", "paused", "archived"]);
  }
  if (entity === "programs") {
    if (body.category_id != null) reference("category_id", false);
    for (const key of ['description','commission_terms','payout_terms','geography']) if (body[key] != null) text(key, key === 'geography' ? 120 : 2000);
    if (body.affiliate_portal != null) { const portal=text('affiliate_portal',2048); if(portal) { try { const u=new URL(portal); if(u.protocol!=='https:'||u.username||u.password)throw new Error(); } catch { throw new Error('Portal affiliate harus HTTPS.'); } } }
    text("provider", 120, true); text("type", 80, true); date("last_verified_at");
    const website = text("official_website", 2048, true);
    try { const u = new URL(website); if (u.protocol !== "https:" || u.username || u.password || u.port || /[\s\\]/.test(website)) throw new Error(); } catch { throw new Error("Situs resmi harus URL HTTPS yang valid."); }
  } else if (entity === "links") {
    reference("program_id"); text("type", 80, true); text("owner", 120, true);
    const destination = text("destination_url", 2048, true);
    if (!validDestination(destination, hosts)) throw new Error("Domain tujuan belum disetujui di konfigurasi server, atau URL tidak aman.");
  } else if (entity === "campaigns") {
    reference("program_id"); reference("link_id");
    const source = text("source", 64, true), medium = text("medium", 64, true);
    if (!slugPattern.test(source) || !slugPattern.test(medium)) throw new Error("Source dan medium harus berupa slug.");
    date("starts_at"); date("ends_at");
    if (data.starts_at && data.ends_at && String(data.starts_at) >= String(data.ends_at)) throw new Error("Tanggal akhir harus setelah tanggal mulai.");
  } else {
    reference("program_id"); reference("campaign_id", false);
    text("external_reference", 160); data.external_reference ||= null;
    choice("referral_status", ["reported", "qualified", "earned", "paid", "rejected"]);
    choice("payout_status", ["pending", "confirmed", "paid", "rejected"]);
    const raw = body.amount;
    if (raw !== "" && raw != null && (typeof raw !== "number" && typeof raw !== "string")) throw new Error("Nominal tidak valid.");
    const amount = raw === "" || raw == null ? null : Number(raw);
    if (amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 999999999999 || !/^\d+(\.\d{1,2})?$/.test(String(raw)))) throw new Error("Nominal harus angka positif, maksimal dua desimal.");
    data.amount = amount;
    const currency = text("currency", 3, true);
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Mata uang harus kode ISO 4217 (contoh USD atau IDR).");
    try { if (!Intl.supportedValuesOf("currency").includes(currency)) throw new Error(); } catch { throw new Error("Kode mata uang tidak didukung."); }
    date("confirmed_at"); date("paid_at"); text("evidence_reference", 500); data.evidence_reference ||= null;
    if (["earned", "paid"].includes(String(data.referral_status)) || ["confirmed", "paid"].includes(String(data.payout_status))) {
      if (!data.evidence_reference || !data.external_reference || !data.confirmed_at || amount === null) throw new Error("Komisi terkonfirmasi memerlukan referensi provider, bukti, tanggal konfirmasi, dan nominal.");
    }
    if ((data.referral_status === "paid") !== (data.payout_status === "paid") || (data.payout_status === "paid" && !data.paid_at)) throw new Error("Status paid harus konsisten dan memiliki tanggal pembayaran.");
    if ((data.referral_status === "rejected") !== (data.payout_status === "rejected")) throw new Error("Status rejected harus konsisten.");
    if (data.payout_status === "confirmed" && data.referral_status !== "earned") throw new Error("Payout confirmed hanya untuk komisi earned.");
    if (data.referral_status === "earned" && data.payout_status !== "confirmed") throw new Error("Komisi earned harus memiliki payout confirmed.");
    if (data.paid_at && (!data.confirmed_at || String(data.paid_at) < String(data.confirmed_at))) throw new Error("Tanggal bayar harus sesudah atau sama dengan konfirmasi.");
    if (data.payout_status !== "paid" && data.paid_at) throw new Error("Tanggal bayar hanya untuk status paid.");
    if (!["earned", "paid"].includes(String(data.referral_status)) && data.confirmed_at) throw new Error("Tanggal konfirmasi hanya untuk komisi earned atau paid.");
  }
  return data;
}
export function classifyAffiliateSource(referer: string | null) {
  if (!referer) return "direct";
  try { const host = new URL(referer).hostname.toLowerCase();
    const domains: Record<string,string> = { "khadafidaffa.com":"website", "threads.net":"threads", "threads.com":"threads", "youtube.com":"youtube", "youtu.be":"youtube", "linkedin.com":"linkedin", "instagram.com":"instagram" };
    return Object.entries(domains).find(([domain])=>host === domain || host.endsWith(`.${domain}`))?.[1] ?? "other";
  } catch { return "other"; }
}
