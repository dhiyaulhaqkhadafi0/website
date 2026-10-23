export const ANALYTICS_CONSENT_KEY = "khadafi-analytics-consent";
export function isAnalyticsPath(path) {
  return (
    path === "/" ||
    /^\/(?:about|blog|freelance|resources|products|services|apps|lab|komunitas|community|privacy|terms|cookies|changelog)(?:\/|$)/.test(
      path,
    )
  );
}
export function analyticsConsent() {
  try {
    return localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}
export function safePage(path) {
  const pathname = path.split(/[?#]/)[0];
  return isAnalyticsPath(pathname) && /^\/[a-zA-Z0-9/_-]*$/.test(pathname)
    ? `https://khadafidaffa.com${pathname}`
    : null;
}
