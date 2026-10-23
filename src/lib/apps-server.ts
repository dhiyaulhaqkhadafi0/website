import "server-only";
import { publicClient } from "./commerce-server";
import type { AppRecord, AppCategory } from "./apps-types";
import { requireUser } from "./commerce-server";
// Explicit reviewed internal routes only. Adding a registry row never executes code.
export const INTERNAL_APP_ROUTES: readonly string[] = [];
// Call at every paid server operation after integrating an internal mini-app.
// Never authorize using a client-side button or a claimed checkout status.
export async function requireAppAccess(request: Request, appId: string) {
  const app = await publicClient()
    .from("apps_registry")
    .select("id,status,pricing_model,version")
    .eq("id", appId)
    .eq("status", "published")
    .abortSignal(AbortSignal.timeout(8000))
    .maybeSingle();
  if (app.error || !app.data)
    return {
      ok: false as const,
      response: Response.json(
        { error: "Aplikasi tidak tersedia." },
        { status: 404 },
      ),
    };
  const application = app.data;
  if (application.pricing_model === "free")
    return { ok: true as const, app: application };
  const auth = await requireUser(request);
  if (!auth.ok) return auth;
  const access = await auth.client
    .from("app_entitlements")
    .select("id,version_scope,expires_at")
    .eq("app_id", appId)
    .eq("user_id", auth.user.id)
    .eq("status", "active")
    .abortSignal(AbortSignal.timeout(8000));
  if (access.error)
    return {
      ok: false as const,
      response: Response.json(
        { error: "Akses belum dapat diverifikasi." },
        { status: 503 },
      ),
    };
  const entitled = access.data?.some(
    (e) =>
      (!e.expires_at || Date.parse(e.expires_at) > Date.now()) &&
      (e.version_scope === application.version || e.version_scope === "all"),
  );
  return entitled
    ? { ok: true as const, app: application }
    : {
        ok: false as const,
        response: Response.json(
          { error: "Lisensi aktif untuk versi ini diperlukan." },
          { status: 403 },
        ),
      };
}
export async function publicApps() {
  const client = publicClient();
  const [apps, categories] = await Promise.all([
    client
      .from("apps_registry")
      .select("*")
      .in("status", ["published", "maintenance"])
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1000)
      .abortSignal(AbortSignal.timeout(8000)),
    client
      .from("app_categories")
      .select("*")
      .order("sort_order")
      .limit(100)
      .abortSignal(AbortSignal.timeout(8000)),
  ]);
  // A missing schema is an explicit unavailable state, never sample applications.
  return {
    apps: (apps.data || []) as AppRecord[],
    categories: (categories.data || []) as AppCategory[],
    available: !apps.error && !categories.error,
  };
}
