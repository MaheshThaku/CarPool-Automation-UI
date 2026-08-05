"use client";
import { useMemo, useSyncExternalStore } from "react";

import { getCookie } from "@/lib/cookies";
import { subscribeAuthChange } from "@/lib/auth.client";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ROLE_PASSENGER" | "ROLE_RIDER" | "ROLE_ADMIN";
  avatarUrl?: string;
}

// Re-render whenever auth state changes (login/logout/profile update in this
// tab, or a login/logout in ANOTHER tab via the cross-tab sync marker). The
// snapshot re-reads the `user` cookie, so a logout elsewhere is reflected here
// immediately instead of on the next reload.
function subscribe(onStoreChange: () => void): () => void {
  return subscribeAuthChange(onStoreChange);
}

function getSnapshot(): string | null {
  return getCookie("user");
}

function getServerSnapshot(): string | null {
  return null;
}

export function useCurrentUser(): CurrentUser | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }, [raw]);
}
