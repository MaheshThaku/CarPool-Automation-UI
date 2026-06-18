import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/axios";
import { extractTokens, setAuthCookies } from "@/lib/authCookies.server";

// Backend refresh endpoint. The backend cannot be changed; if this path does
// not exist the call simply fails and we report 401 so the client can re-login.
const REFRESH_PATH = "/v1/public/refresh-token";

/**
 * POST /api/auth/refresh
 * If a refreshToken cookie exists, ask the backend for a fresh accessToken
 * and silently update the cookies. Returns 401 if refresh is not possible.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token available." },
      { status: 401 }
    );
  }

  let raw: unknown;
  try {
    const upstream = await serverApi.post(REFRESH_PATH, { refreshToken });
    raw = upstream.data;
  } catch {
    return NextResponse.json({ message: "Refresh failed." }, { status: 401 });
  }

  const tokens = extractTokens(raw);
  // Preserve the existing refresh token if the backend didn't rotate it.
  if (!tokens.refreshToken) {
    tokens.refreshToken = refreshToken;
  }

  if (!tokens.token) {
    return NextResponse.json({ message: "Refresh failed." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setAuthCookies(res, tokens);
  return res;
}
