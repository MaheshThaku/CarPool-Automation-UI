export function toIso(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString();
}

export function formatDisplayDate(date: string, time: string): { date: string; time: string } | null {
  if (!date || !time) return null;
  try {
    const d = new Date(`${date}T${time}`);
    return {
      date: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase(),
    };
  } catch {
    return null;
  }
}

export function todayMin(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/** Returns the YYYY-MM-DD for "today + offsetDays" — used by quick-pick date chips. */
export function dateOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function inputCls(hasIcon: boolean, error?: string): string {
  return `w-full rounded-xl border ${
    error
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20"
  } bg-white py-3 pr-4 text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none transition-all focus:ring-2 ${
    hasIcon ? "pl-10" : "pl-4"
  }`;
}
