import { isAxiosError } from "axios";

import { serverApi } from "@/lib/axios";
import { extractTokens, BackendTokens } from "@/lib/authCookies.server";

/**
 * Server-side session revoke helpers. These run ONLY inside Next.js route
 * handlers (they talk directly to the Spring Boot backend with `serverApi`).
 *
 * Both helpers are deliberately non-throwing: logout/logout-all must ALWAYS
 * succeed locally (clear the cookies), even if the backend call fails or the
 * access token is already expired. A revoke that fails silently is safe — the
 * access token is short-lived and the refresh token is cleared anyway.
 */

/** Ask the backend for a fresh token pair using the given refresh token. */
async function refreshPairServer(
  refreshToken: string | undefined
): Promise<BackendTokens | null> {
  if (!refreshToken) return null;
  try {
    const upstream = await serverApi.post("/v1/public/refresh-token", {
      refreshToken,
    });
    const tokens = extractTokens(upstream.data);
    return tokens.token ? tokens : null;
  } catch {
    return null;
  }
}

/**
 * Revoke the current device's refresh token (POST /v1/auth/logout).
 * Requires a valid access token; if it's expired, we refresh first and revoke
 * the freshly-rotated refresh token instead.
 */
export async function revokeCurrentSessionServer(
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<void> {
  if (!refreshToken) return;

  const attempt = async (token: string, refresh: string): Promise<boolean> => {
    try {
      await serverApi.post(
        "/v1/auth/logout",
        { refreshToken: refresh },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch {
      return false;
    }
  };

  // Try with the current access token first.
  if (accessToken && (await attempt(accessToken, refreshToken))) return;

  // Access token missing/expired → refresh to get a fresh pair, then revoke.
  const fresh = await refreshPairServer(refreshToken);
  if (fresh?.token) {
    await attempt(fresh.token, fresh.refreshToken ?? refreshToken);
  }
}

/**
 * Revoke the user's sessions on every device (POST /v1/auth/logout-all).
 * Requires a valid access token (no body). Refreshes first if expired.
 */
export async function revokeAllSessionsServer(
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<void> {
  const attempt = async (token: string): Promise<boolean> => {
    try {
      await serverApi.post(
        "/v1/auth/logout-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch {
      return false;
    }
  };

  // Try with the current access token first.
  if (accessToken && (await attempt(accessToken))) return;

  // Access token missing/expired → refresh, then revoke everything.
  const fresh = await refreshPairServer(refreshToken);
  if (fresh?.token) {
    await attempt(fresh.token);
  }
}

/**
 * Map a backend error status so callers can distinguish "session is dead"
 * (401) from "rate limited" (429) without touching axios internals.
 */
export function errorStatus(error: unknown): number | undefined {
  if (isAxiosError(error)) return error.response?.status;
  return undefined;
}
