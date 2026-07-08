export function buildLocalDate(
  date: string,
  time: string,
): Date {
  const [year, month, day] = date.split('-').map(Number);

  const [hours, minutes] = time.split(':').map(Number);

  return new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
    0,
  );
}

export function toLocalDateTime(
  date: string,
  time: string,
): string {
  return `${date}T${time}:00`;
}

export function formatDisplayDate(
  date: string,
  time: string,
): { date: string; time: string } | null {
  if (!date || !time) return null;

  try {
    const d = buildLocalDate(date, time);

    return {
      date: d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),

      time: d
        .toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .toUpperCase(),
    };
  } catch {
    return null;
  }
}

export function todayMin(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** Returns the YYYY-MM-DD for "today + offsetDays" — used by quick-pick date chips. */
export function dateOffset(
  offsetDays: number,
): string {
  const d = new Date();

  d.setDate(d.getDate() + offsetDays);

  const year = d.getFullYear();
  const month = String(
    d.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    d.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
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
