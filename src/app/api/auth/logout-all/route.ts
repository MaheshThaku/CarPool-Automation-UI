import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookies } from "@/lib/authCookies.server";
import { revokeAllSessionsServer } from "@/lib/serverAuth";

/**
 * POST /api/auth/logout-all
 * Revokes the user's sessions on EVERY device via the backend, then clears
 * the local auth cookies. Like logout, revocation is best-effort (it refreshes
 * the access token first if needed) but the cookies are always cleared.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  await revokeAllSessionsServer(accessToken, refreshToken);

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
