import { validateAffiliate } from "./affiliate-validation";
export const COMMISSION_COLUMNS = [
  "program_id",
  "campaign_id",
  "external_reference",
  "referral_status",
  "amount",
  "currency",
  "payout_status",
  "confirmed_at",
  "paid_at",
  "evidence_reference",
  "notes",
] as const;
export function parseCommissionCsv(input: string) {
  if (new TextEncoder().encode(input).length > 256000)
    throw new Error("File maksimal 256 KB.");
  const records: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false;
  const text = input.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (quoted || !cell) quoted = !quoted;
      else throw new Error("Tanda kutip CSV tidak valid.");
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((v) => v.trim())) records.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("Tanda kutip CSV belum ditutup.");
  row.push(cell);
  if (row.some((v) => v.trim())) records.push(row);
  const headers = records.shift();
  if (
    !headers ||
    headers.length !== COMMISSION_COLUMNS.length ||
    headers.some((v, i) => v.trim() !== COMMISSION_COLUMNS[i])
  )
    throw new Error(
      `Header harus sesuai urutan: ${COMMISSION_COLUMNS.join(",")}`,
    );
  if (records.length < 1 || records.length > 200)
    throw new Error("Impor 1–200 baris per file.");
  const seen = new Set<string>();
  return records.map((values, index) => {
    if (values.length !== headers.length)
      throw new Error(`Baris ${index + 2}: jumlah kolom tidak sesuai.`);
    const body = Object.fromEntries(
      COMMISSION_COLUMNS.map((key, i) => [key, values[i].trim()]),
    );
    try {
      const validated = validateAffiliate("commissions", body);
      if (!validated.external_reference)
        throw new Error("Referensi provider wajib untuk deduplikasi impor.");
      const key = validated.program_id + ":" + validated.external_reference;
      if (seen.has(key))
        throw new Error("Referensi provider berulang dalam file.");
      seen.add(key);
      return validated;
    } catch (e) {
      throw new Error(
        `Baris ${index + 2}: ${e instanceof Error ? e.message : "isian tidak valid."}`,
      );
    }
  });
}
