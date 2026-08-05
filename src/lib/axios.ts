import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { getCookie } from "@/lib/cookies";
import { clearSession } from "@/lib/auth.client";

/**
 * Client-side instance. All frontend service calls (/v1/...) route through the
 * Next.js proxy (/api/proxy/v1/...) so the httpOnly accessToken cookie is read
 * server-side and attached as a Bearer token. Cookies travel automatically.
 */
export const api = axios.create({
  baseURL: "/api/proxy",
  // headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/**
 * Server-side instance for Next.js API routes only. Talks directly to the
 * Spring Boot backend. Never import this into client components.
 */
export const serverApi = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" },
  // Bound so a revoke/refresh never hangs a logout or redirect path.
  timeout: 8000,
});

const REFRESH_URL = "/api/auth/refresh";

// Endpoints that must never trigger an auth refresh. Either they ARE the auth
// flow (login/refresh/logout/logout-all) or they are public and work fine
// without a token (register, OTP, forgot/reset password).
const NO_REFRESH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/auth/logout-all",
  "/v1/public/",
  "/v1/otp/",
];

// Refresh proactively when the access token has fewer than this many ms left,
// so protected requests don't 401 in the first place. Tuned well inside the
// 10-refreshes/min rate limit (access token lifetime is 100 s).
const PROACTIVE_REFRESH_MS = 30_000;

// Refresh endpoint rate limit (AUTH_API.md): 10/min → back off before retry.
const RATE_LIMIT_BACKOFF_MS = 6500;

function isNoRefreshPath(url: string | undefined): boolean {
  return !!url && NO_REFRESH_PATHS.some((path) => url.includes(path));
}

type RefreshResult = "ok" | "rate-limited" | "failed";

/**
 * Single-flight refresh. Every caller (proactive request interceptor + every
 * 401 response) shares ONE in-flight promise, so the backend's token rotation
 * can never race itself — two concurrent 401s fire a single /refresh-token
 * call and both retry with the same fresh token.
 *
 * The httpOnly cookies are updated by the route handler itself; here we only
 * need to know the outcome.
 */
let refreshPromise: Promise<RefreshResult> | null = null;

export function refreshSession(): Promise<RefreshResult> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(REFRESH_URL, {
          method: "POST",
          credentials: "same-origin",
        });
        if (res.ok) return "ok";
        return res.status === 429 ? "rate-limited" : "failed";
      } catch {
        return "failed";
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Proactive refresh: refresh just before expiry so requests don't 401.
api.interceptors.request.use(async (config) => {
  if (typeof document !== "undefined" && !isNoRefreshPath(config.url)) {
    const expiry = getCookie("tokenExpiry");
    if (expiry) {
      const expiresAtMs = Number(expiry) * 1000;
      if (!Number.isNaN(expiresAtMs) && expiresAtMs - Date.now() < PROACTIVE_REFRESH_MS) {
        await refreshSession();
      }
    }
  }
  return config;
});

interface RetriableConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retry429?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // 401 → refresh once → retry. Only for protected endpoints; a 401 on a
    // public/auth endpoint is a real error (e.g. bad login credentials).
    if (status === 401 && original && !original._retry && !isNoRefreshPath(original.url)) {
      original._retry = true;

      const result = await refreshSession();

      if (result === "ok") {
        // The route handler wrote the new httpOnly cookies; the proxy will
        // attach the fresh token automatically. Just retry the request.
        return api(original);
      }

      if (result === "rate-limited") {
        // Not a dead session — just back off and retry the original request.
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_BACKOFF_MS));
        return api(original);
      }

      // Refresh failed → session is dead. Clear every auth state and send the
      // user to the home page. This is the ONLY place we redirect on failure.
      clearSession(true);
      return Promise.reject(error);
    }

    // 429 on any other endpoint: back off and retry once, never log out.
    if (status === 429 && original && !original._retry429) {
      original._retry429 = true;
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_BACKOFF_MS));
      return api(original);
    }

    return Promise.reject(error);
  }
);
