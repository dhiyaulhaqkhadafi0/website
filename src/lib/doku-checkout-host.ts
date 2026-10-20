/** Strict DOKU hosted payment URL validation. Never accept arbitrary subdomains. */
export const DOKU_SANDBOX_CHECKOUT_HOSTS = [
  "sandbox.doku.com",
  "staging.doku.com",
] as const;
export const DOKU_PRODUCTION_CHECKOUT_HOST = "jokul.doku.com";

export function isAllowedDokuCheckoutUrl(
  value: string,
  production = false,
): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password ||
      url.port) return false;
    return production
      ? url.hostname === DOKU_PRODUCTION_CHECKOUT_HOST
      : DOKU_SANDBOX_CHECKOUT_HOSTS.some((host) => url.hostname === host);
  } catch {
    return false;
  }
}
