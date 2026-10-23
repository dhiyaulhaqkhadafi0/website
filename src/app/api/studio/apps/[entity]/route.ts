import { requireAffiliateAdmin } from "@/lib/affiliate-auth";
import { affiliateJson, boundedText } from "@/lib/affiliate-server";
import { validateApp, validateAppCategory } from "@/lib/apps-validation";
import { INTERNAL_APP_ROUTES } from "@/lib/apps-server";
import { uuidPattern } from "@/lib/affiliate-validation";
export const dynamic = "force-dynamic";
const tables: Record<string, string> = {
  registry: "apps_registry",
  categories: "app_categories",
  entitlements: "app_entitlements",
};
export async function GET(
  request: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  const auth = await requireAffiliateAdmin(request);
  if (!auth.ok) return auth.response;
  const entity = (await params).entity;
  if (!tables[entity])
    return affiliateJson({ error: "Area tidak ditemukan." }, 404);
  const { data, error, count } = await auth.client
    .from(tables[entity])
    .select("*", { count: "exact" })
    .order(entity === "categories" ? "sort_order" : "created_at", {
      ascending: entity === "categories",
    })
    .limit(1000)
    .abortSignal(AbortSignal.timeout(8000));
  return error
    ? affiliateJson(
        {
          error:
            "Database Apps belum tersedia. Periksa migrasi dan akses Studio.",
        },
        503,
      )
    : affiliateJson({ rows: data, count });
}
async function write(request: Request, entity: string, editing: boolean) {
  const auth = await requireAffiliateAdmin(request);
  if (!auth.ok) return auth.response;
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return affiliateJson({ error: "Origin tidak valid." }, 403);
  if (!["registry", "categories"].includes(entity))
    return affiliateJson({ error: "Area tidak ditemukan." }, 404);
  try {
    if (!request.headers.get("content-type")?.includes("application/json"))
      throw new Error("Gunakan JSON.");
    const body = JSON.parse(await boundedText(request, 60000));
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("Data tidak valid.");
    const data: Record<string, unknown> =
      entity === "registry" ? validateApp(body) : validateAppCategory(body);
    if (
      "deployment" in data &&
      data.deployment === "internal" &&
      !["draft", "archived"].includes(String(data.status)) &&
      !INTERNAL_APP_ROUTES.includes(String(data.destination))
    )
      throw new Error(
        "Route internal belum diintegrasikan dan diuji. Simpan sebagai draft dahulu.",
      );
    const query = editing
      ? auth.client
          .from(tables[entity])
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq("id", body.id)
          .eq("updated_at", body.updated_at)
          .select()
          .abortSignal(AbortSignal.timeout(8000))
          .maybeSingle()
      : auth.client
          .from(tables[entity])
          .insert(data)
          .select()
          .abortSignal(AbortSignal.timeout(8000))
          .single();
    if (
      editing &&
      (!uuidPattern.test(body.id) ||
        !Number.isFinite(Date.parse(body.updated_at)))
    )
      throw new Error("ID dan versi data wajib valid.");
    const result = await query;
    if (result.error)
      return affiliateJson(
        {
          error:
            result.error.code === "23505"
              ? "Slug sudah digunakan."
              : "Data gagal disimpan. Periksa kategori, isian, dan akses database.",
        },
        result.error.code === "23505" ? 409 : 400,
      );
    if (!result.data)
      return affiliateJson(
        { error: "Data berubah. Muat ulang sebelum mengedit." },
        409,
      );
    return affiliateJson({ row: result.data }, editing ? 200 : 201);
  } catch (error) {
    return affiliateJson(
      { error: error instanceof Error ? error.message : "Isian tidak valid." },
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
