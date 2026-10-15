import { requireStudio, json } from "@/lib/commerce-server";
import { validateProduct } from "@/lib/commerce-types";
export async function GET(request: Request) {
  const auth = await requireStudio(request);
  if (!auth.ok) return auth.response;
  const { data, error } = await auth.client
    .from("commerce_products")
    .select("*,commerce_product_files(*)")
    .order("updated_at", { ascending: false });
  return error
    ? json({ error: "Produk belum dapat dimuat." }, 500)
    : json({ products: data });
}
export async function POST(request: Request) {
  const auth = await requireStudio(request);
  if (!auth.ok) return auth.response;
  try {
    const product = validateProduct(await request.json());
    const { data, error } = await auth.client
      .from("commerce_products")
      .insert(product)
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
    return json({ product: data }, 201);
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "Data tidak valid." },
      400,
    );
  }
}
