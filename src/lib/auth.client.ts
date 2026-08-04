import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { useUserStore } from "@/store/user.store";
import type { SessionUser } from "@/types/auth.types";

/**
 * Client-side auth state helpers. Tokens NEVER live here — they are httpOnly
 * cookies handled by the server. This module only manages:
 *   - the readable `user` cookie (non-sensitive profile for the navbar),
 *   - a localStorage marker used to synchronize auth state across tabs,
 *   - clearing all local auth state on logout / refresh failure.
 *
 * Every read/write is guarded for SSR: this module is safe to import from
 * both client components and (via the axios client) server route handlers.
 */

export const SESSION_USER_COOKIE = "user";
export const DEVICE_ID_COOKIE = "sf_device_id";

// Marker key for cross-tab sync. The `storage` event only fires for
// localStorage changes, so each tab writes this marker when auth state
// changes; other tabs see the event and re-read their cookies.
export const AUTH_SYNC_KEY = "sf_auth_sync";

const listeners = new Set<() => void>();

/** Subscribe to auth-state changes (login/logout/profile update, other tabs). */
export function subscribeAuthChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyAuthChange(): void {
  listeners.forEach((listener) => listener());
}

function writeSyncMarker(): void {
  try {
    localStorage.setItem(AUTH_SYNC_KEY, String(Date.now()));
  } catch {
    // private mode / storage disabled — cross-tab sync degrades gracefully
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === AUTH_SYNC_KEY) {
      notifyAuthChange();
    }
  });
}

/** Read the non-sensitive session user from the readable cookie. */
export function getSessionUser(): SessionUser | null {
  try {
    const raw = getCookie(SESSION_USER_COOKIE);
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

/** Persist the session user and broadcast the change to every tab. */
export function setSessionUser(user: SessionUser): void {
  setCookie(SESSION_USER_COOKIE, JSON.stringify(user), 60 * 60 * 24 * 7);
  writeSyncMarker();
  notifyAuthChange();
}

/** Merge updates into the current session user (e.g. after a profile edit). */
export function updateSessionUser(updates: Record<string, unknown>): SessionUser | null {
  const current = getSessionUser();
  if (!current) return null;
  const next: SessionUser = { ...current, ...updates };
  setSessionUser(next);
  return next;
}

/** Remove the readable session user and broadcast the change. */
export function clearSessionUser(): void {
  deleteCookie(SESSION_USER_COOKIE);
  writeSyncMarker();
  notifyAuthChange();
}

/** Where users land after their session ends (explicit logout or expiry). */
export const AUTH_HOME_PATH = "/";

/**
 * Clear ALL local auth state and optionally send the user somewhere.
 *
 * This clears the readable user cookie and the persisted profile store. It
 * does NOT touch the httpOnly auth cookies — callers that need those cleared
 * must hit /api/auth/logout (which revokes the session server-side too) first.
 *
 * @param redirectTo Destination path (default: home "/"). Pass `false`/`null`
 *   to clear state without navigating.
 */
export function clearSession(redirectTo: string | boolean = AUTH_HOME_PATH): void {
  clearSessionUser();

  // Wipe the persisted profile store (localStorage) so no stale user data
  // survives logout or an expired session.
  try {
    useUserStore.getState().clearProfile();
    useUserStore.persist.clearStorage();
  } catch {
    // store may not be hydrated yet — harmless
  }

  const destination =
    typeof redirectTo === "string" ? redirectTo : redirectTo ? AUTH_HOME_PATH : null;

  if (
    destination &&
    typeof window !== "undefined" &&
    window.location.pathname !== destination
  ) {
    window.location.replace(destination);
  }
}
