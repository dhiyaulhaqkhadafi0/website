import { requireStudio, json } from "@/lib/commerce-server";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudio(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const p = await request.json().catch(() => null);
  if (
    !p ||
    typeof p.storage_path !== "string" ||
    !p.storage_path.startsWith(id + "/") ||
    typeof p.name !== "string" ||
    p.name.length > 200 ||
    p.storage_path.includes("..")
  )
    return json({ error: "File tidak valid." }, 400);
  const { data: objects, error: storageError } = await auth.client.storage
    .from("commerce-files")
    .list(id);
  const file = p.storage_path.slice(id.length + 1);
  if (storageError || !objects?.some((o) => o.name === file))
    return json({ error: "File belum berhasil diunggah." }, 400);
  const { data, error } = await auth.client
    .from("commerce_product_files")
    .insert({ product_id: id, storage_path: p.storage_path, name: p.name })
    .select()
    .single();
  return error
    ? json({ error: "File gagal disimpan." }, 400)
    : json({ file: data }, 201);
}
