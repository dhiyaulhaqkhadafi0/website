import { NextResponse, type NextRequest } from "next/server";

// Preserve the requested page across the shared login. Authorization remains
// in the server layouts/APIs and in Supabase RLS.
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-khadafi-return-to", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/account/:path*", "/studio/:path*", "/checkout/:path*"],
};
