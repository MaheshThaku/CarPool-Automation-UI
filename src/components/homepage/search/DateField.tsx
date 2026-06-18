"use client";

import { Calendar } from "lucide-react";

interface Props {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DateField({ value, onChange }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs font-semibold uppercase tracking-wide text-[var(--text-light)]"
      >
        Date
      </label>

      <div
        className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
      >
        <Calendar
          size={18}
          className="text-[var(--primary)]"
        />

        <input
          type="date"
          min={today}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-[var(--heading)] outline-none"
        />
      </div>
    </div>
  );
}
