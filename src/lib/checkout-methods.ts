// Active merchant services shown by the owner, restricted to documented Checkout IDs.
// Wallet/paylater eligibility remains on the hosted page (additional buyer data may be required).
export const CHECKOUT_METHODS = [
  { code: "QRIS", label: "QRIS", group: "QRIS", detail: "GoPay, DANA, OVO, ShopeePay, dan aplikasi bank yang mendukung QRIS" },
  ...[
    ["VIRTUAL_ACCOUNT_BANK_MANDIRI", "Mandiri"],
    ["VIRTUAL_ACCOUNT_BNI", "BNI"], ["VIRTUAL_ACCOUNT_BRI", "BRI"],
    ["VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI", "BSI"], ["VIRTUAL_ACCOUNT_BANK_PERMATA", "Permata"],
    ["VIRTUAL_ACCOUNT_BANK_CIMB", "CIMB Niaga"], ["VIRTUAL_ACCOUNT_BANK_DANAMON", "Danamon"],
    ["VIRTUAL_ACCOUNT_BTN", "BTN"], ["VIRTUAL_ACCOUNT_BNC", "BNC"],
    ["VIRTUAL_ACCOUNT_BJB", "BJB"], ["VIRTUAL_ACCOUNT_BSS", "Bank Sampoerna"],
    ["VIRTUAL_ACCOUNT_Sinarmas", "Sinarmas"], ["VIRTUAL_ACCOUNT_DOKU", "DOKU VA / bank lainnya"],
  ].map(([code, label]) => ({ code, label, group: "Bank / Virtual Account", detail: "Transfer melalui virtual account" })),
  { code: "ONLINE_TO_OFFLINE_ALFA", label: "Alfa Group", group: "Minimarket", detail: "Alfamart, Alfamidi, dan jaringan Alfa" },
  { code: "ONLINE_TO_OFFLINE_INDOMARET", label: "Indomaret", group: "Minimarket", detail: "Bayar melalui kasir Indomaret" },
  { code: "all", label: "Semua pilihan di DOKU", group: "Pilihan lainnya", detail: "Lihat seluruh pilihan yang tersedia, termasuk DOKU e-Wallet atau Akulaku jika memenuhi syarat" },
];
const allowed = new Set(CHECKOUT_METHODS.map(method => method.code));
export function isCheckoutMethod(value: unknown): value is string { return typeof value === "string" && allowed.has(value); }
export function checkoutMethodAllowed(method: string, policy: { methods: string[] | null }) {
  return isCheckoutMethod(method) && (method === "all" || policy.methods === null || policy.methods.includes(method));
}
