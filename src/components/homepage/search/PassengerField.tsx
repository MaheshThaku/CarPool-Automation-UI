'use client';

import { Users } from 'lucide-react';

interface Props {
  value?: number;
  onChange?: (value: number) => void;
}

export default function PassengerField({ value = 1, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-wide text-[var(--text-light)] uppercase">
        Passengers
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
        <Users size={18} className="text-[var(--primary)]" />

        <select
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="w-full bg-transparent text-[var(--heading)] outline-none"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n} Passenger{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
