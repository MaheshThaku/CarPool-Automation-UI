import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookies } from "@/lib/authCookies.server";
import { revokeCurrentSessionServer } from "@/lib/serverAuth";

/**
 * POST /api/auth/logout
 * Revokes the current device's refresh token on the backend (so the session
 * dies server-side, not just in the browser), then clears every auth cookie.
 *
 * Revocation needs a valid access token. If ours is expired we refresh first
 * and revoke the rotated refresh token — but even if that fails, the cookies
 * are ALWAYS cleared in `finally` so the user is still logged out locally.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  await revokeCurrentSessionServer(accessToken, refreshToken);

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
