import { requireBlogAdmin } from "@/lib/blog-auth";

const respond = (data: unknown, status = 200) => Response.json(data, {
  status, headers: { "Cache-Control": "private, no-store" },
});

export async function GET(request: Request) {
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) {
    auth.response.headers.set("Cache-Control", "private, no-store");
    return auth.response;
  }
  const params = new URL(request.url).searchParams;
  const rawPage = Number(params.get("page") || "1");
  if (!Number.isSafeInteger(rawPage) || rawPage < 1 || rawPage > 100000) return respond({ error: "Halaman tidak valid." }, 400);
  const status = params.get("status");
  const source = params.get("source");
  if ((status && !["active", "unsubscribed"].includes(status)) || (source && !["freelance_hub", "freelance_jobs"].includes(source))) return respond({ error: "Filter tidak valid." }, 400);
  let query = auth.client.from("freelance_leads")
    .select("id,name,email,source,status,created_at,utm_source,utm_campaign", { count: "exact" })
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  const [rows, aggregate] = await Promise.all([
    query.range((rawPage - 1) * 50, rawPage * 50 - 1), auth.client.rpc("freelance_lead_stats"),
  ]);
  if (rows.error || aggregate.error || !aggregate.data) return respond({ error: "Data subscriber belum dapat dimuat. Periksa koneksi dan izin admin." }, 503);
  return respond({ leads: rows.data || [], stats: aggregate.data, count: rows.count || 0 });
}
