// Deliberate public route families. Adding an app route never exposes it here.
export const PUBLIC_PATHS = [
  "/",
  "/about",
  "/freelance",
  "/freelance/cari",
  "/freelance/tools",
  "/freelance/jobs",
  "/freelance/direktori",
  "/freelance/belajar/mulai-freelance",
  "/resources",
  "/products",
  "/services",
  "/blog",
  "/lab",
  "/komunitas",
  "/community",
  "/privacy",
  "/terms",
  "/cookies",
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
    /^\/(blog|products|services|resources|freelance\/direktori|freelance\/tools)\/[a-z0-9-]+$/.test(
      path,
    )
  );
}
