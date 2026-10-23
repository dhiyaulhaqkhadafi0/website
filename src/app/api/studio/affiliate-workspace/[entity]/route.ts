import { requireAffiliateAdmin } from "@/lib/affiliate-auth";
import { affiliateJson, boundedText } from "@/lib/affiliate-server";
import {
  WORKSPACE_ENTITIES,
  validateWorkspace,
  type WorkspaceEntity,
} from "@/lib/affiliate-workspace";
import { uuidPattern } from "@/lib/affiliate-validation";
import { validateAffiliate } from "@/lib/affiliate-validation";
import { affiliateEnvironment } from "@/lib/affiliate-server";
export const dynamic = "force-dynamic";
const valid = (entity: string): entity is WorkspaceEntity =>
  (WORKSPACE_ENTITIES as readonly string[]).includes(entity);
export async function GET(
  request: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  const auth = await requireAffiliateAdmin(request);
  if (!auth.ok) return auth.response;
  const entity = (await params).entity;
  if (!valid(entity))
    return affiliateJson({ error: "Area tidak ditemukan." }, 404);
  const query = new URL(request.url).searchParams;
  const page = Number(query.get("page") || 1);
  const lookup = query.get("lookup") === "1";
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000)
    return affiliateJson({ error: "Halaman tidak valid." }, 400);
  const { data, error, count } = await auth.client
    .from(`affiliate_${entity}`)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(lookup ? 0 : (page - 1) * 25, lookup ? 999 : page * 25 - 1)
    .abortSignal(AbortSignal.timeout(8000));
  return error
    ? affiliateJson(
        {
          error:
            "Data workspace belum tersedia. Periksa migrasi dan akses Studio.",
        },
        503,
      )
    : affiliateJson({ rows: data, count, page });
}
async function write(request: Request, entity: string, editing: boolean) {
  const auth = await requireAffiliateAdmin(request);
  if (!auth.ok) return auth.response;
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return affiliateJson({ error: "Origin tidak valid." }, 403);
  try {
    if (!request.headers.get("content-type")?.includes("application/json"))
      throw new Error("Gunakan JSON.");
    const body = JSON.parse(
      await boundedText(
        request,
        entity === "import-commissions" ? 256000 : 25000,
      ),
    );
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("Isian tidak valid.");
    if (entity === "import-commissions") {
      if (
        !Array.isArray(body.rows) ||
        !body.rows.length ||
        body.rows.length > 200
      )
        throw new Error("Impor 1–200 baris.");
      const seen = new Set<string>();
      const rows = body.rows.map((row: Record<string, unknown>) => {
        const data = validateAffiliate("commissions", row);
        if (!data.external_reference)
          throw new Error("Referensi provider wajib diisi.");
        const key = data.program_id + ":" + data.external_reference;
        if (seen.has(key)) throw new Error("Referensi berulang dalam file.");
        seen.add(key);
        return data;
      });
      const result = await auth.client
        .rpc("import_affiliate_commissions", {
          p_rows: rows,
          p_environment: affiliateEnvironment(),
        })
        .abortSignal(AbortSignal.timeout(10000));
      return result.error
        ? affiliateJson(
            {
              error:
                result.error.code === "23505"
                  ? "Referensi sudah ada di ledger. Seluruh impor dibatalkan."
                  : "Impor ditolak. Periksa program, campaign, bukti, dan format laporan. Tidak ada baris yang diimpor.",
            },
            409,
          )
        : affiliateJson({ count: result.data });
    }
    if (entity === "promote") {
      if (
        !uuidPattern.test(body.id) ||
        !Number.isFinite(Date.parse(body.updated_at))
      )
        throw new Error("Versi data tidak valid.");
      const result = await auth.client
        .rpc("promote_affiliate_opportunity", {
          p_id: body.id,
          p_updated_at: body.updated_at,
        })
        .abortSignal(AbortSignal.timeout(8000));
      return result.error
        ? affiliateJson(
            {
              error:
                "Hanya riset approved yang dapat dipromosikan. Muat ulang jika data berubah.",
            },
            409,
          )
        : affiliateJson({ program_id: result.data });
    }
    if (!valid(entity))
      return affiliateJson({ error: "Area tidak ditemukan." }, 404);
    const data = validateWorkspace(entity, body);
    if (
      editing &&
      (!uuidPattern.test(body.id) ||
        !Number.isFinite(Date.parse(body.updated_at)))
    )
      throw new Error("Versi data tidak valid.");
    const query = editing
      ? auth.client
          .from(`affiliate_${entity}`)
          .update(data)
          .eq("id", body.id)
          .eq("updated_at", body.updated_at)
          .select()
          .abortSignal(AbortSignal.timeout(8000))
          .maybeSingle()
      : auth.client
          .from(`affiliate_${entity}`)
          .insert(data)
          .select()
          .abortSignal(AbortSignal.timeout(8000))
          .single();
    const result = await query;
    if (result.error)
      return affiliateJson(
        {
          error:
            result.error.code === "23505"
              ? "Slug sudah digunakan."
              : "Data gagal disimpan. Periksa hubungan program, link, campaign, dan isian.",
        },
        400,
      );
    if (!result.data)
      return affiliateJson(
        { error: "Data telah berubah. Muat ulang sebelum mengedit." },
        409,
      );
    return affiliateJson({ row: result.data }, editing ? 200 : 201);
  } catch (e) {
    return affiliateJson(
      { error: e instanceof Error ? e.message : "Isian tidak valid." },
      400,
    );
  }
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  return write(request, (await params).entity, false);
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  return write(request, (await params).entity, true);
}
