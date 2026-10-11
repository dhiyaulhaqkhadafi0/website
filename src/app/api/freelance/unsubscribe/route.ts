import { freelanceClient, leadJson, sameLeadOrigin, sha256, smallJson } from "@/lib/freelance-leads-server";
export async function POST(request: Request) {
  if (!sameLeadOrigin(request)) return leadJson({ error: "Buka tautan pengelolaan melalui website ini." },403);
  const payload = await smallJson(request);
  if (typeof payload?.token !== "string" || !/^[a-f0-9]{64}$/.test(payload.token)) return leadJson({ error: "Tautan berhenti berlangganan tidak valid." },400);
  try {
    const { data, error } = await freelanceClient().rpc("unsubscribe_freelance", { p_token_hash: await sha256(payload.token) });
    if (error) return leadJson({ error: "Permintaan belum tersimpan. Coba lagi nanti." },503);
    if (!data) return leadJson({ error: "Tautan tidak ditemukan. Gunakan tautan yang diterima saat mendaftar atau di email Field Notes." },400);
    return leadJson({ ok: true });
  } catch { return leadJson({ error: "Permintaan belum tersimpan. Coba lagi nanti." },503); }
}
