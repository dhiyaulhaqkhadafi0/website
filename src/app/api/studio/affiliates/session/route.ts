import { cookies } from "next/headers";
import { requireAffiliateAdmin as requireBlogAdmin } from "@/lib/affiliate-auth";
import { affiliateJson } from "@/lib/affiliate-server";
import { hasSameOrigin } from "@/lib/request-origin";
export async function POST(request: Request) {
  if (!hasSameOrigin(request))
    return affiliateJson({ error: "Origin tidak valid." }, 403);
  const auth = await requireBlogAdmin(request);
  if (!auth.ok) {
    auth.response.headers.set("Cache-Control", "private, no-store");
    return auth.response;
  }
  (await cookies()).set("studio_affiliate_session", auth.accessToken, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "strict",
    maxAge: 900,
    path: "/studio/affiliates",
  });
  return affiliateJson({ ok: true });
}
