/** Next/OpenNext can use an internal request URL. Compare the browser Origin
 * with the actual Host header, never with client-supplied forwarding headers. */
export function hasSameOrigin(request: Request) {
  try {
    const value = request.headers.get("origin") || "";
    const origin = new URL(value);
    const host = request.headers.get("host") || new URL(request.url).host;
    const local =
      origin.hostname === "localhost" || origin.hostname === "127.0.0.1";
    return (
      origin.origin === value &&
      origin.host === host &&
      (origin.protocol === "https:" || (local && origin.protocol === "http:"))
    );
  } catch {
    return false;
  }
}
