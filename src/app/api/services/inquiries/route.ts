import { createServiceRoleClient } from "@/lib/supabase";
import { hasSameOrigin } from "@/lib/request-origin";
import { clientHash, sha256 } from "@/lib/freelance-leads-server";
import { validateInquiry } from "@/lib/service-inquiry";
import { json } from "@/lib/commerce-server";
export async function POST(request: Request) {
  if (!hasSameOrigin(request))
    return json({ error: "Kirim brief melalui website ini." }, 403);
  const input = await readBody(request);
  if (!input)
    return json(
      { error: "Format data tidak valid atau brief terlalu panjang." },
      400,
    );
  if (input.website)
    return json({ error: "Permintaan tidak dapat diproses." }, 400);
  if (
    typeof input.request_id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      input.request_id,
    )
  )
    return json({ error: "Permintaan tidak valid. Muat ulang formulir." }, 400);
  let payload;
  try {
    payload = validateInquiry(input);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Data tidak valid." },
      400,
    );
  }
  const secret =
    process.env.SERVICE_INQUIRY_HASH_SECRET ||
    process.env.FREELANCE_SIGNUP_SECRET ||
    process.env.ENGAGEMENT_SIGNING_SECRET;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !secret || secret.length < 16)
    return json(
      {
        error:
          "Formulir belum tersedia. Brief belum tersimpan; silakan hubungi melalui email di bawah.",
      },
      503,
    );
  try {
    const [fingerprint, payloadHash] = await Promise.all([
      clientHash(request, secret),
      sha256(JSON.stringify(payload)),
    ]);
    const { data, error } = await createServiceRoleClient()
      .rpc("submit_service_inquiry", {
        p_request_id: input.request_id,
        p_payload: payload,
        p_client_hash: fingerprint,
        p_payload_hash: payloadHash,
      })
      .abortSignal(AbortSignal.timeout(8000));
    if (error || !data)
      return json(
        {
          error:
            "Brief belum dapat dikonfirmasi tersimpan. Coba lagi dengan formulir ini; pengiriman ulang tidak membuat duplikat.",
        },
        503,
      );
    if (data.status === "limited")
      return Response.json(
        {
          error:
            "Batas pengiriman sementara tercapai. Coba lagi dalam satu jam atau hubungi melalui email.",
        },
        {
          status: 429,
          headers: {
            "Cache-Control": "private, no-store",
            "Retry-After": "3600",
          },
        },
      );
    if (data.status === "conflict")
      return json(
        {
          error:
            "Permintaan sebelumnya berbeda. Mulai brief baru dengan memuat ulang halaman.",
        },
        409,
      );
    if (data.status !== "accepted")
      return json(
        { error: "Brief belum tersimpan. Periksa data dan coba lagi." },
        503,
      );
    return json(
      {
        ok: true,
        message: "Brief tersimpan. Khadafi dapat meninjaunya melalui Studio.",
      },
      201,
    );
  } catch {
    return json(
      {
        error:
          "Brief belum dapat dikonfirmasi tersimpan. Silakan coba lagi; data di formulir tetap tersedia.",
      },
      503,
    );
  }
}

async function readBody(
  request: Request,
): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const parts: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16384) {
        await reader.cancel();
        return null;
      }
      parts.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const part of parts) {
      bytes.set(part, offset);
      offset += part.byteLength;
    }
    const data = JSON.parse(new TextDecoder().decode(bytes));
    return data && typeof data === "object" && !Array.isArray(data)
      ? data
      : null;
  } catch {
    return null;
  }
}
