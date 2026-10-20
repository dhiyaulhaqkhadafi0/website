/** Arithmetic shared by the web tools; mirrors cells B5:B34 of workbook V2. */
export const PROJECT_DEFAULTS = {
  compensation: 6000000,
  overhead: 1000000,
  reserve: 1000000,
  days: 20,
  hours: 8,
  billable: 62.5,
  projectHours: 30,
  direct: 400000,
  risk: 10,
  margin: 20,
  rounding: 10000,
  deposit: 50,
  second: 30,
};
export type ProjectInputs = typeof PROJECT_DEFAULTS;
export function calculateProject(i: ProjectInputs) {
  if (Object.values(i).some((v) => !Number.isFinite(v) || v < 0))
    throw new Error("Isi semua input dengan angka nol atau lebih.");
  if (i.compensation + i.overhead + i.reserve <= 0)
    throw new Error("Kebutuhan bulanan harus lebih dari nol.");
  if (
    i.days <= 0 ||
    i.days > 31 ||
    i.hours <= 0 ||
    i.hours > 24 ||
    i.billable <= 0 ||
    i.billable > 100
  )
    throw new Error(
      "Periksa kapasitas: 1–31 hari, hingga 24 jam per hari, porsi tertagih lebih dari 0% hingga 100%.",
    );
  if (i.projectHours <= 0 || i.rounding <= 0)
    throw new Error("Jam proyek dan pembulatan harus lebih dari nol.");
  if (i.margin >= 100) throw new Error("Margin harus di bawah 100%.");
  if (i.deposit + i.second > 100)
    throw new Error("Total DP dan termin kedua maksimal 100%.");
  const capacity = (i.days * i.hours * i.billable) / 100,
    rate = (i.compensation + i.overhead + i.reserve) / capacity,
    base = i.projectHours * rate + i.direct,
    withRisk = (base * (100 + i.risk)) / 100;
  const units = (withRisk * 100) / (100 - i.margin) / i.rounding;
  // Avoid rounding an exact multiple up again because of binary floating point noise.
  const nearest = Math.round(units),
    stableUnits =
      Math.abs(units - nearest) <=
      Number.EPSILON * Math.max(1, Math.abs(units)) * 4
        ? nearest
        : units;
  const price = Math.ceil(stableUnits) * i.rounding,
    deposit = Math.round((price * i.deposit) / 100),
    second = Math.round((price * i.second) / 100),
    final = price - deposit - second;
  if (
    ![capacity, rate, base, withRisk, price, deposit, second, final].every(
      Number.isFinite,
    )
  )
    throw new Error("Angka terlalu besar untuk dihitung.");
  return { capacity, rate, base, withRisk, price, deposit, second, final };
}
export function calculateSimulation(
  quantity: string,
  receipt: string,
  divisor: number,
  unit: string,
) {
  if (!quantity.trim() || !receipt.trim())
    throw new Error("Isi jumlah dan penerimaan asumsi per unit.");
  const q = Number(quantity),
    r = Number(receipt);
  if (![q, r, divisor].every(Number.isFinite) || q < 0 || r < 0 || divisor <= 0)
    throw new Error("Gunakan angka nol atau lebih yang valid.");
  if (!unit.toLowerCase().includes("jam") && !Number.isInteger(q))
    throw new Error(`Jumlah ${unit} harus bilangan bulat.`);
  const total = (q * r) / divisor;
  if (!Number.isFinite(total) || total > Number.MAX_SAFE_INTEGER)
    throw new Error("Angka terlalu besar untuk dihitung.");
  return total;
}
