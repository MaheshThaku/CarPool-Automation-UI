import { NextResponse } from "next/server";

import { clearAuthCookies } from "@/lib/authCookies.server";

/**
 * POST /api/auth/logout
 * Clears the auth cookies (maxAge=0).
 */
export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
