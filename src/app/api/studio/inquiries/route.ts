import { requireStudio, json } from "@/lib/commerce-server";
import { hasSameOrigin } from "@/lib/request-origin";
import { INQUIRY_STATUSES } from "@/lib/service-inquiry";
import { smallJson } from "@/lib/freelance-leads-server";
export async function GET(request: Request) {
  const auth = await requireStudio(request);
  if (!auth.ok)
    return json({ error: "Akses Studio diperlukan." }, auth.response.status);
  const params = new URL(request.url).searchParams;
  const rawPage = Number(params.get("page") || 1);
  const page =
    Number.isSafeInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 10000) : 1;
  let query = auth.client
    .from("service_inquiries")
    .select(
      "id,name,email,service,description,budget,timeline,status,created_at,consent_version",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * 25, page * 25 - 1);
  const status = params.get("status");
  if (status && (INQUIRY_STATUSES as readonly string[]).includes(status))
    query = query.eq("status", status);
  const { data, count, error } = await query;
  if (error)
    return json(
      {
        error:
          "Brief belum dapat dimuat. Pastikan migrasi formulir sudah diterapkan.",
      },
      503,
    );
  return json({ inquiries: data || [], count: count || 0, page });
}
export async function PATCH(request: Request) {
  if (!hasSameOrigin(request))
    return json({ error: "Origin tidak valid." }, 403);
  const auth = await requireStudio(request);
  if (!auth.ok)
    return json({ error: "Akses Studio diperlukan." }, auth.response.status);
  const input = await smallJson(request);
  if (
    !input ||
    typeof input.id !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(input.id) ||
    !(INQUIRY_STATUSES as readonly unknown[]).includes(input.status)
  )
    return json({ error: "Status tidak valid." }, 400);
  const { data, error } = await auth.client
    .from("service_inquiries")
    .update({ status: input.status })
    .eq("id", input.id)
    .select("id,status")
    .maybeSingle();
  if (error || !data)
    return json({ error: "Status belum dapat disimpan." }, 400);
  return json({ inquiry: data });
}
