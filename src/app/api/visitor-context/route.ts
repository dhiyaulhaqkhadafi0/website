// Coarse, request-local edge hint; no IP address, GPS, or tracking service.
export function GET(request: Request) {
  const value=request.headers.get("cf-ipcountry");
  const country=value && /^[A-Z]{2}$/.test(value) && value!=="XX" ? value : null;
  return Response.json({country},{headers:{"Cache-Control":"private, no-store","Vary":"CF-IPCountry"}});
}
