import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/axios";
import {
  extractTokens,
  setAuthCookies,
  clearAuthCookies,
  isJwtExpired,
} from "@/lib/authCookies.server";
import { errorStatus } from "@/lib/serverAuth";

// Backend refresh endpoint. The backend cannot be changed; if this path does
// not exist the call simply fails and we report 401 so the client can re-login.
const REFRESH_PATH = "/v1/public/refresh-token";

/**
 * POST /api/auth/refresh
 * If a refreshToken cookie exists, ask the backend for a fresh accessToken
 * and silently update the cookies. Returns 401 if refresh is not possible
 * (and clears the stale cookies — the session is dead). Returns 429 on
 * backend rate-limit so the client can back off without logging the user out.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    const res = NextResponse.json(
      { message: "No refresh token available." },
      { status: 401 }
    );
    clearAuthCookies(res);
    return res;
  }

  let raw: unknown;
  try {
    const upstream = await serverApi.post(REFRESH_PATH, { refreshToken });
    raw = upstream.data;
  } catch (error) {
    // Rate-limited (10 refreshes/min per AUTH_API.md) — this is a backoff
    // signal, NOT a dead session. Do NOT clear cookies.
    if (errorStatus(error) === 429) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Multi-tab race: the access token is shared across tabs, and the refresh
    // token rotates on every use. If ANOTHER tab refreshed just now, this
    // tab's refresh token is stale → backend 401 — but the access token cookie
    // is still valid (freshly rotated by the other tab). Treat that as a
    // benign success so this tab retries with the current token instead of
    // being logged out.
    const currentAccess = req.cookies.get("accessToken")?.value;
    if (currentAccess && !isJwtExpired(currentAccess)) {
      return NextResponse.json({ ok: true, rotated: false });
    }

    // Otherwise the session cannot be saved (invalid/revoked/expired token,
    // network) — clear the httpOnly cookies so stale credentials don't linger.
    const res = NextResponse.json({ message: "Refresh failed." }, { status: 401 });
    clearAuthCookies(res);
    return res;
  }

  const tokens = extractTokens(raw);
  // Preserve the existing refresh token if the backend didn't rotate it.
  if (!tokens.refreshToken) {
    tokens.refreshToken = refreshToken;
  }

  if (!tokens.token) {
    const res = NextResponse.json({ message: "Refresh failed." }, { status: 401 });
    clearAuthCookies(res);
    return res;
  }

  const res = NextResponse.json({ ok: true });
  setAuthCookies(res, tokens);
  return res;
}
