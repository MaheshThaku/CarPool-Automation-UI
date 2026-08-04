/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from "axios";

import { serverApi } from "@/lib/axios";
import { extractTokens, setAuthCookies, decodeJwt } from "@/lib/authCookies.server";

interface LoginBody {
  email?: string;
  password?: string;
}

// Stable-per-browser device id cookie so logout-all / session management can
// identify this device. It is NOT a credential — a readable cookie is fine.
const DEVICE_ID_COOKIE = "sf_device_id";
const DEVICE_ID_MAX_AGE = 60 * 60 * 24 * 365;

function getOrCreateDeviceId(req: NextRequest): string {
  const existing = req.cookies.get(DEVICE_ID_COOKIE)?.value;
  if (existing) return existing;
  // Node 20+ global crypto; the ID only needs to be unique per browser.
  return crypto.randomUUID();
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse> {
  const { email, password }: LoginBody =
    await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json(
      {
        message:
          'Email and password are required.',
      },
      { status: 400 },
    );
  }

  const deviceId = getOrCreateDeviceId(req);

  let raw: unknown;

  try {
    const upstream =
      await serverApi.post(
        '/v1/public/login',
        {
          email,
          password,
          deviceId,
          deviceName: 'web',
        },
      );

    raw = upstream.data;
  } catch (error: unknown) {
    if (
      isAxiosError(error) &&
      error.response
    ) {
      const message =
        (
          error.response.data as
            | { message?: string }
            | undefined
        )?.message ??
        'Invalid email or password.';

      return NextResponse.json(
        { message },
        {
          status:
            error.response.status,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          'Could not reach the authentication server.',
      },
      { status: 502 },
    );
  }

  const tokens = extractTokens(raw);

  if (!tokens.token) {
    return NextResponse.json(
      {
        message:
          'Login succeeded but no token was returned.',
      },
      { status: 502 },
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

  // Persist the stable device id so it survives browser restarts.
  res.cookies.set(DEVICE_ID_COOKIE, deviceId, {
    httpOnly: false,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEVICE_ID_MAX_AGE,
  });

  return res;
}
