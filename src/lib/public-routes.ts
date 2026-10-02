// Deliberate public route families. Adding an app route never exposes it here.
export const PUBLIC_PATHS = [
  "/",
  "/about",
  "/freelance",
  "/freelance/cari",
  "/freelance/direktori",
  "/freelance/belajar/mulai-freelance",
  "/resources",
  "/blog",
  "/lab",
  "/komunitas",
  "/community",
  "/privacy",
  "/terms",
  "/changelog",
] as const;
const PUBLIC_ANCHORS = [
  "inquiry",
  "intent",
  "produk",
  "work",
  "selected-work",
  "featured-work",
  "capabilities",
  "knowledge",
  "certifications",
  "about",
  "newsletter",
];
export function isPublicDestination(href: string) {
  if (href.startsWith("#")) return PUBLIC_ANCHORS.includes(href.slice(1));
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  const path = href.split(/[?#]/)[0];
  return (
    (PUBLIC_PATHS as readonly string[]).includes(path) ||
    /^\/(blog|resources|freelance\/direktori)\/[a-z0-9-]+$/.test(path)
  );
}
