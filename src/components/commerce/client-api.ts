import { supabase } from "@/lib/supabase";
export async function commerceApi(path: string, init: RequestInit = {}) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session)
    throw new Error("Sesi berakhir. Silakan masuk kembali.");
  const response = await fetch(path, {
    ...init,
    headers: {
      ...init.headers,
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.session.access_token,
    },
  });
  const payload = await response.json();
  if (!response.ok)
    throw new Error(payload.error || "Permintaan belum berhasil.");
  return payload;
}
