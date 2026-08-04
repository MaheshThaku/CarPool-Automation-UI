import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { decodeJwtExp } from "@/lib/authCookies.server";

/**
 * Server-side route guard for the dashboard. Reading the httpOnly cookies
 * here avoids the client-side render flash of the old useEffect guard.
 *
 * A user is allowed through when they have a usable session:
 *  - a valid (unexpired) access token, OR
 *  - an expired access token but a refresh token present (the axios
 *    interceptor silently refreshes on the first 401), OR
 *  - no access token but a refresh token present (fresh page load after a
 *    browser restart — the first API call refreshes it).
 *
 * Anything else (no tokens, or an expired access token with no way to
 * refresh) is redirected to login.
 */
export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const accessTokenValid = accessToken ? !isExpired(accessToken) : false;

  if (!accessTokenValid && !refreshToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

function isExpired(token: string): boolean {
  const exp = decodeJwtExp(token);
  if (exp === null) return false; // cannot decode → let it through; interceptor handles it
  return exp * 1000 <= Date.now();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
