"use client";
import { useEffect, useState } from "react";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ROLE_PASSENGER" | "ROLE_RIDER" | "ROLE_ADMIN";
}

export function useCurrentUser(): CurrentUser | null {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return user;
}
