import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { serverApi } from "@/lib/axios";
import { extractTokens, setAuthCookies } from "@/lib/authCookies.server";

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
  // afterwards via GET /api/proxy/v1/users/me. If an object was returned,
  // pass any embedded user straight through.
  const user =
    raw && typeof raw === "object"
      ? (raw as { user?: unknown }).user ?? null
      : null;

  const res = NextResponse.json({ user });
  setAuthCookies(res, tokens);
  return res;
}
