"use client";

/** Read a cookie value by name from document.cookie (client-side only). */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
}

/** Write a non-httpOnly cookie (SameSite=Strict, path=/). */
export function setCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 7): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Strict${secure}`;
}

/** Delete a client-readable cookie. */
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
}
