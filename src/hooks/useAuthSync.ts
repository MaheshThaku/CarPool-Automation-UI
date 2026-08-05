"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AUTH_HOME_PATH } from "@/lib/auth.client";

/**
 * Keeps route protection correct while the user is already on a page.
 *
 * The server-side proxy.ts guard covers navigation, but it can't react to a
 * session being destroyed while the page is open (e.g. the user logged out in
 * another tab, or a refresh failure cleared the cookies). This hook re-evaluates
 * on every auth-state change (via useCurrentUser, which subscribes to the
 * cross-tab bus) and bounces off /dashboard routes the moment the session
 * disappears.
 *
 * Redirects to the same home page as clearSession() so an explicit logout and
 * this hook never race toward different destinations.
 */
export function useAuthSync(): void {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onProtectedRoute = window.location.pathname.startsWith("/dashboard");
    if (onProtectedRoute && !user) {
      router.replace(AUTH_HOME_PATH);
    }
  }, [user, router]);
}
