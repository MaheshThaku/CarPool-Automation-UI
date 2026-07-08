/**
 * Converts a Date object to YYYY-MM-DD using local timezone.
 */
function toLocalDateInputValue(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Returns local ISO datetime string without UTC conversion.
 * Example:
 * date = "2026-07-08"
 * time = "10:30"
 * =>
 * "2026-07-08T10:30:00"
 */
export function toIso(date: string, time: string): string {
  return `${date}T${time}:00`;
}

/**
 * Backward compatibility.
 * Older components still import this function.
 */
export function toLocalDateTime(date: string, time: string): string {
  return toIso(date, time);
}

/**
 * Returns a local Date object.
 */
export function buildLocalDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

/**
 * Formats date & time for ride preview.
 */
export function formatDisplayDate(
  date: string,
  time: string
): { date: string; time: string } | null {
  if (!date || !time) return null;

  try {
    const d = buildLocalDate(date, time);

    return {
      date: d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: d
        .toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase(),
    };
  } catch {
    return null;
  }
}

/**
 * Minimum selectable date (today).
 */
export function todayMin(): string {
  return toLocalDateInputValue(new Date());
}

/**
 * Returns YYYY-MM-DD for today + offsetDays.
 */
export function dateOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return toLocalDateInputValue(d);
}

/**
 * Shared input styling.
 */
export function inputCls(hasIcon: boolean, error?: string): string {
  return `w-full rounded-xl border ${
    error
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
      : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20"
  } bg-white py-3 pr-4 text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none transition-all focus:ring-2 ${
    hasIcon ? "pl-10" : "pl-4"
  }`;
}