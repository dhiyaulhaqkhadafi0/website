import type { User } from "@supabase/supabase-js";
import {
  createAuthenticatedSupabaseClient,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";

type AuthSuccess = {
  ok: true;
  user: User;
  accessToken: string;
  client: ReturnType<typeof createAuthenticatedSupabaseClient>;
};

type AuthFailure = {
  ok: false;
  response: Response;
};

export async function requireBlogAdmin(
  request: Request,
): Promise<AuthSuccess | AuthFailure> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      response: Response.json(
        { error: "Supabase belum dikonfigurasi." },
        { status: 503 },
      ),
    };
  }

  const accessToken = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  if (!accessToken) {
    return {
      ok: false,
      response: Response.json(
        { error: "Silakan login kembali." },
        { status: 401 },
      ),
    };
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user || data.user.is_anonymous) {
    return {
      ok: false,
      response: Response.json(
        { error: "Sesi tidak valid atau sudah berakhir." },
        { status: 401 },
      ),
    };
  }

  if (!data.user.email_confirmed_at) {
    return {
      ok: false,
      response: Response.json(
        { error: "Akun ini tidak memiliki akses ke Blog Studio." },
        { status: 403 },
      ),
    };
  }
  const client = createAuthenticatedSupabaseClient(accessToken);
  const { data: allowed, error: roleError } = await client.rpc("studio_access");
  if (roleError)
    return {
      ok: false,
      response: Response.json(
        { error: "Pemeriksaan akses pengelola belum tersedia." },
        { status: 503 },
      ),
    };
  if (allowed !== true)
    return {
      ok: false,
      response: Response.json(
        { error: "Akun ini tidak memiliki akses ke Blog Studio." },
        { status: 403 },
      ),
    };

  return {
    ok: true,
    user: data.user,
    accessToken,
    client,
  };
}
