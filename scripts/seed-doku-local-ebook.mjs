// DOKU Sandbox only: create one synthetic Rp59,000 product and a PRIVATE test PDF.
// Run from feature worktree: node --env-file=.env.local scripts/seed-doku-local-ebook.mjs
import { createClient } from "@supabase/supabase-js";

const expectedUrl = "http://127.0.0.1:54321";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (process.env.DOKU_LOCAL_STAGING_ONLY !== "true" ||
    process.env.DOKU_IS_PRODUCTION !== "false" ||
    ![expectedUrl, "http://localhost:54321"].includes(url) ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("STOP: Only isolated local Khadafi Supabase on port 54321 is allowed.");
  process.exit(1);
}
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const slug = "ebook-formula-profitable-blueprint-test";
const path = "sandbox-only/formula-profitable-blueprint-TEST.pdf";

function createTestPdf() {
  const commands = "BT /F1 22 Tf 50 760 Td (SANDBOX TEST - NOT REAL EBOOK) Tj ET\n" +
    "BT /F1 12 Tf 50 726 Td (DOKU Rp59000 - fake download verification) Tj ET\n";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    "<< /Length " + Buffer.byteLength(commands) + " >>\nstream\n" + commands + "endstream",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += (i + 1) + " 0 obj\n" + obj + "\nendobj\n";
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) pdf += String(offset).padStart(10, "0") + " 00000 n \n";
  pdf += "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\n" +
    "startxref\n" + xrefOffset + "\n%%EOF\n";
  return Buffer.from(pdf, "ascii");
}

try {
  const { data: existing, error: lookupErr } = await supabase
    .from("commerce_products").select("id,name,price,status").eq("slug", slug).maybeSingle();
  if (lookupErr) throw lookupErr;
  if (existing && (existing.price !== 59000 ||
      existing.name !== "Formula Profitable Blueprint [SANDBOX TEST]")) {
    throw new Error("Existing product does not match synthetic test fixture.");
  }
  let productId = existing?.id;
  if (!productId) {
    const { data, error } = await supabase.from("commerce_products").insert({
      name: "Formula Profitable Blueprint [SANDBOX TEST]",
      slug,
      category: "Ebook",
      price: 59000,
      currency: "IDR",
      status: "draft",
      short_description: "HANYA SIMULASI DOKU. Tidak ada produk atau pembayaran sungguhan.",
      description: "Ini adalah produk dummy dari database lokal untuk menguji pembayaran dan unduhan PDF percobaan.",
      featured: false,
    }).select("id").single();
    if (error) throw error;
    productId = data.id;
  }
  // Never overwrite other data. A previous successful seed may already have its file.
  const { data: current, error: fileCheckError } = await supabase
    .from("commerce_product_files").select("id").eq("product_id", productId)
    .eq("storage_path", path).maybeSingle();
  if (fileCheckError) throw fileCheckError;
  if (!current) {
    const { error: uploadError } = await supabase.storage
      .from("commerce-files")
      .upload(path, createTestPdf(), { contentType: "application/pdf", upsert: false });
    if (uploadError && !/already exists|duplicate/i.test(uploadError.message)) throw uploadError;
    const { error: recordErr } = await supabase.from("commerce_product_files")
      .insert({ product_id: productId, storage_path: path, name: "sandbox-test-only.pdf" });
    if (recordErr) throw recordErr;
  }
  if (existing?.status !== "published") {
    const { error } = await supabase.from("commerce_products")
      .update({ status: "published" }).eq("id", productId);
    if (error) throw error;
  }
  console.log("PASS: Synthetic Rp59000 Ebook + private PDF exist in LOCAL Supabase.");
  console.log("Open local page: http://localhost:3000/checkout/" + slug);
  console.log("No production customers, real files, or payments were used.");
} catch (error) {
  console.error("FAILED: Local seed could not finish. " + (error?.message || "unknown error"));
  process.exitCode = 1;
}
