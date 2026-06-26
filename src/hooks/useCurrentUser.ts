"use client";
import { useMemo, useSyncExternalStore } from "react";

import { getCookie } from "@/lib/cookies";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ROLE_PASSENGER" | "ROLE_RIDER" | "ROLE_ADMIN";
  avatarUrl?: string;
}

// No external mutation source to subscribe to; cookie is read on render.
function subscribe(): () => void {
  return () => {};
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
