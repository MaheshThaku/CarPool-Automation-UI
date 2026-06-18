import type { NextResponse } from "next/server";

/**
 * Server-side cookie helpers for auth.
 * These run only inside Next.js route handlers, so reading the JWT `exp`
 * claim here is server-side decoding (NOT the forbidden client-side decode).
 */

const isProd = process.env.NODE_ENV === "production";

// httpOnly options for the secret cookies (accessToken / refreshToken).
const SECURE_COOKIE = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: isProd,
  path: "/",
};

// Non-httpOnly so the client can read it for the expiry check (Issue 5).
const READABLE_COOKIE = {
  httpOnly: false,
  sameSite: "strict" as const,
  secure: isProd,
  path: "/",
};

export interface BackendTokens {
  token: string;
  refreshToken?: string;
}

/** Decode the `exp` (Unix seconds) claim from a JWT, server-side only. */
export function decodeJwtExp(token: string): number | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf8");
    const claims = JSON.parse(json) as { exp?: unknown };
    return typeof claims.exp === "number" ? claims.exp : null;
  } catch {
    return null;
  }
}

/** Extract the JWT from a backend response that may be a plain string or an object. */
export function extractTokens(raw: unknown): BackendTokens {
  if (typeof raw === "string") {
    return { token: raw.trim() };
  }
  if (raw && typeof raw === "object") {
    const obj = raw as { accessToken?: string; refreshToken?: string };
    return { token: obj.accessToken ?? "", refreshToken: obj.refreshToken };
  }
  return { token: "" };
}

/** Set accessToken (httpOnly), optional refreshToken (httpOnly) and tokenExpiry (readable). */
export function setAuthCookies(res: NextResponse, tokens: BackendTokens): void {
  res.cookies.set("accessToken", tokens.token, SECURE_COOKIE);

  if (tokens.refreshToken) {
    res.cookies.set("refreshToken", tokens.refreshToken, SECURE_COOKIE);
  }

  const exp = decodeJwtExp(tokens.token);
  if (exp !== null) {
    res.cookies.set("tokenExpiry", String(exp), READABLE_COOKIE);
  }
}

/** Clear every auth cookie (used by logout). */
export function clearAuthCookies(res: NextResponse): void {
  res.cookies.set("accessToken", "", { ...SECURE_COOKIE, maxAge: 0 });
  res.cookies.set("refreshToken", "", { ...SECURE_COOKIE, maxAge: 0 });
  res.cookies.set("tokenExpiry", "", { ...READABLE_COOKIE, maxAge: 0 });
}
