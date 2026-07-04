import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { serverApi } from "@/lib/axios";
import { extractTokens, setAuthCookies, decodeJwt } from "@/lib/authCookies.server";

interface LoginBody {
  email?: string;
  password?: string;
}

/**
 * POST /api/auth/login
 * Calls the Spring Boot backend, extracts the JWT (plain string OR object),
 * and stores it in an httpOnly, SameSite=Strict, Secure cookie. Returns { user }.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const { email, password }: LoginBody = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  let raw: unknown;
  try {
    const upstream = await serverApi.post("/v1/public/login", { email, password });
    raw = upstream.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      const message =
        (error.response.data as { message?: string } | undefined)?.message ??
        "Invalid email or password.";
      return NextResponse.json({ message }, { status: error.response.status });
    }
    return NextResponse.json(
      { message: "Could not reach the authentication server." },
      { status: 502 }
    );
  }

  const tokens = extractTokens(raw);
  if (!tokens.token) {
    return NextResponse.json(
      { message: "Login succeeded but no token was returned." },
      { status: 502 }
    );
  }

  // The backend usually returns a plain token, so user info is fetched
  // afterwards via GET /api/proxy/v1/[passenger|rider]/profile.
  // Extract user role from token to help the frontend decide which endpoint to call.
  const claims = decodeJwt(tokens.token);
  const roles: string[] = Array.isArray(claims?.roles)
    ? claims.roles
    : typeof claims?.role === "string"
      ? [claims.role]
      : [];

  const user =
    raw && typeof raw === "object"
      ? (raw as { user?: any }).user ?? {}
      : {};

  // Ensure role is present in the response user object
  if (!user.role && roles.length > 0) {
    user.role = roles[0];
  }

  const res = NextResponse.json({ user });
  setAuthCookies(res, tokens);
  return res;
}
