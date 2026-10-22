import { supabase } from "@/lib/supabase";
export class CommerceRequestError extends Error {
  constructor(message: string, public orderId?: string) { super(message); }
}
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
    throw new CommerceRequestError(payload.error || "Permintaan belum berhasil.", payload.order_id);
  return payload;
}
