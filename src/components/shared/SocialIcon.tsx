const paths = {
  youtube:
    "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z",
  tiktok:
    "M16.6 0h-4.1v16.4a3.5 3.5 0 1 1-3-3.5V8.7a7.7 7.7 0 1 0 7.1 7.7V8a10 10 0 0 0 5.8 1.9V5.8A5.8 5.8 0 0 1 16.6 0Z",
  facebook:
    "M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23 10.1 24v-8.4H7v-3.5h3.1V9.4c0-3.1 1.8-4.8 4.6-4.8 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.4h3.3l-.5 3.5h-2.8V24C19.6 23 24 18.1 24 12.1Z",
  linkedin:
    "M5.4 24H.4V8h5ZM2.9 5.8A2.9 2.9 0 1 1 2.9 0a2.9 2.9 0 0 1 0 5.8ZM24 24h-5v-7.8c0-1.9 0-4.2-2.6-4.2s-3 2-3 4.1V24h-5V8h4.8v2.2h.1c.7-1.3 2.3-2.6 4.7-2.6 5.1 0 6 3.4 6 7.7Z",
};
export function SocialIcon({
  name,
}: {
  name:
    "youtube" | "tiktok" | "instagram" | "threads" | "facebook" | "linkedin";
}) {
  if (name === "instagram")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none" />
      </svg>
    );
  if (name === "threads")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M19.5 6.5C18.1 3.7 15.6 2.5 12 2.5 6.2 2.5 3 6.2 3 12s3.2 9.5 9 9.5c5.2 0 8.4-2.7 8.4-6.3 0-3.4-2.7-5.4-6.5-5.4-3.3 0-5.2 1.3-5.2 3.4 0 1.8 1.4 2.9 3.5 2.9 3.1 0 4.4-2.2 4.4-5.4 0-3.2-1.6-5-4.4-5-1.6 0-2.8.5-3.7 1.6" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
