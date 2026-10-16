import { SERVICES } from "@/content/shop";
export const INQUIRY_CONSENT = "studio-shop-inquiry-v1";
export const BUDGETS = [
  "Belum ditentukan",
  "Di bawah Rp5 juta",
  "Rp5–15 juta",
  "Rp15–30 juta",
  "Di atas Rp30 juta",
] as const;
export const TIMELINES = [
  "Fleksibel",
  "Dalam 1 bulan",
  "1–3 bulan",
  "Lebih dari 3 bulan",
] as const;
export const INQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type InquiryPayload = {
  name: string;
  email: string;
  service: string;
  description: string;
  budget: string;
  timeline: string;
  consent: true;
  consent_version: typeof INQUIRY_CONSENT;
};
export type Inquiry = InquiryPayload & {
  id: string;
  status: (typeof INQUIRY_STATUSES)[number];
  created_at: string;
};
export function validateInquiry(
  input: Record<string, unknown>,
): InquiryPayload {
  const string = (key: string) =>
    typeof input[key] === "string" ? (input[key] as string).trim() : "";
  const name = string("name"),
    email = string("email").toLowerCase(),
    service = string("service"),
    description = string("description"),
    budget = string("budget"),
    timeline = string("timeline");
  if (name.length < 2 || name.length > 100)
    throw new Error("Isi nama antara 2–100 karakter.");
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Isi alamat email yang valid.");
  if (!SERVICES.some((item) => item.slug === service))
    throw new Error("Pilih jenis layanan yang tersedia.");
  if (description.length < 20 || description.length > 3000)
    throw new Error("Ceritakan proyekmu dalam 20–3.000 karakter.");
  if (budget && !(BUDGETS as readonly string[]).includes(budget))
    throw new Error("Pilihan anggaran tidak valid.");
  if (timeline && !(TIMELINES as readonly string[]).includes(timeline))
    throw new Error("Pilihan waktu tidak valid.");
  if (input.consent !== true || input.consent_version !== INQUIRY_CONSENT)
    throw new Error("Persetujuan pengolahan brief diperlukan.");
  return {
    name,
    email,
    service,
    description,
    budget,
    timeline,
    consent: true,
    consent_version: INQUIRY_CONSENT,
  };
}
