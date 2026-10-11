import { clientHash, freelanceClient, leadJson, sameLeadOrigin, sha256, signupSecret, smallJson } from "@/lib/freelance-leads-server";
export async function POST(request: Request) {
  if (!sameLeadOrigin(request)) return leadJson({ error: "Kirim formulir melalui website ini." },403);
  const payload = await smallJson(request);
  if (!payload) return leadJson({ error: "Format formulir tidak valid." },400);
  if (payload.website) return leadJson({ error: "Formulir tidak dapat diproses." },400);
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (name.length < 2 || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || payload.consent !== true) return leadJson({ error: "Isi nama, email yang valid, dan persetujuan berlangganan." },400);
  const secret = signupSecret();
  if (!secret) return leadJson({ error: "Pendaftaran belum tersedia. Silakan coba lagi nanti." },503);
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2,"0")).join("");
  const attribution = (key: string) => typeof payload[key] === "string" ? payload[key].trim().slice(0,120) : "";
  try {
    const { data, error } = await freelanceClient().rpc("subscribe_freelance", {
      p_secret: secret,
      p_payload: { name, email, consent: true, source: payload.source === "freelance_jobs" ? "freelance_jobs" : "freelance_hub", utm_source: attribution("utm_source"), utm_campaign: attribution("utm_campaign") },
      p_client_hash: await clientHash(request, secret), p_token_hash: await sha256(token),
    });
    if (error || !["inserted","existing","limited"].includes(data)) return leadJson({ error: "Pendaftaran belum dapat disimpan. Coba lagi nanti." },503);
    if (data === "limited") return leadJson({ error: "Terlalu banyak percobaan. Coba kembali dalam satu jam." },429,{ "Retry-After": "3600" });
    return leadJson({ ok: true, message: "Terima kasih! Permintaanmu sudah diproses. Email yang sudah terdaftar tidak ditambahkan dua kali; langganan yang dihentikan tetap nonaktif.", ...(data === "inserted" ? { manageUrl: `/freelance/berhenti#${token}` } : {}) });
  } catch { return leadJson({ error: "Pendaftaran belum dapat disimpan. Coba lagi nanti." },503); }
}
