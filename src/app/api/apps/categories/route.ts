import { publicApps } from "@/lib/apps-server";
export const dynamic = "force-dynamic";
export async function GET() {
  const { categories, available } = await publicApps();
  return Response.json(
    { categories },
    {
      status: available ? 200 : 503,
      headers: {
        "Cache-Control": available ? "public, max-age=60" : "no-store",
      },
    },
  );
}
