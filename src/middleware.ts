import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Server-side route guard for the dashboard. Reading the httpOnly accessToken
 * cookie here avoids the client-side render flash of the old useEffect guard.
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
