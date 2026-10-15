import { cookies } from "next/headers";
import {
  requireUser,
  json,
  sameOrigin,
  SESSION_COOKIE,
  requireStudio,
} from "@/lib/commerce-server";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origin tidak valid." }, 403);
  const auth = await requireUser(request);
  if (!auth.ok) return auth.response;
  // Token is validated remotely; cookies only bridge the existing Supabase browser session.
  const token = auth.token;
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64url").toString(),
  ) as { exp: number };
  const maxAge = Math.max(
    0,
    Math.min(3600, payload.exp - Math.floor(Date.now() / 1000)),
  );
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  const studio = await requireStudio(request);
  return json({
    ok: true,
    destination: studio.ok ? "/studio/overview" : "/account",
  });
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Origin tidak valid." }, 403);
  (await cookies()).delete(SESSION_COOKIE);
  return json({ ok: true });
}
