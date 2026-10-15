import { requireStudio, json } from "@/lib/commerce-server";
import { validateProduct } from "@/lib/commerce-types";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStudio(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  try {
    const product = validateProduct(await request.json());
    const { data, error } = await auth.client
      .from("commerce_products")
      .update(product)
      .eq("id", id)
      .select()
      .single();
    if (error)
      return json(
        {
          error:
            error.code === "23505" ? "Slug sudah digunakan." : error.message,
        },
        400,
      );
    return json({ product: data });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "Data tidak valid." },
      400,
    );
  }
}
