import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { getCookie, deleteCookie } from "@/lib/cookies";

/**
 * Client-side instance. All frontend service calls (/v1/...) route through the
 * Next.js proxy (/api/proxy/v1/...) so the httpOnly accessToken cookie is read
 * server-side and attached as a Bearer token. Cookies travel automatically.
 */
export const api = axios.create({
  baseURL: "/api/proxy",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/**
 * Server-side instance for Next.js API routes only. Talks directly to the
 * Spring Boot backend. Never import this into client components.
 */
export const serverApi = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" },
});

const REFRESH_URL = "/api/auth/refresh";

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(REFRESH_URL, { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}

// Issue 5: proactively refresh when the token is within 60s of expiry.
api.interceptors.request.use(async (config) => {
  if (typeof document !== "undefined") {
    const expiry = getCookie("tokenExpiry");
    if (expiry) {
      const expiresAtMs = Number(expiry) * 1000;
      if (!Number.isNaN(expiresAtMs) && expiresAtMs - Date.now() < 60_000) {
        await tryRefresh();
      }
    }
  }
  return config;
});

// Issue 6: silent refresh on 401, retry once, otherwise clear cookies + redirect.
interface RetriableConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      const refreshed = await tryRefresh();
      if (refreshed) {
        return api(original);
      }

      if (typeof window !== "undefined") {
        deleteCookie("user");
        deleteCookie("tokenExpiry");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);
