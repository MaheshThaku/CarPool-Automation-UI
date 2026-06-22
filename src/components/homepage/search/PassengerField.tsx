'use client';

import { Users } from 'lucide-react';

interface Props {
  value: number;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PassengerField({ value, onChange, error }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-wide text-[var(--text-light)] uppercase">
        Passengers
      </label>

      <div
        className={`flex items-center gap-3 rounded-xl border bg-[var(--surface)] px-4 py-4 ${
          error ? 'border-[var(--error)]' : 'border-[var(--border)]'
        } `}
      >
        <Users size={18} className="text-[var(--primary)]" />

        <select
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-[var(--heading)] outline-none"
        >
          <option value={1}>1 Passenger</option>
          <option value={2}>2 Passengers</option>
          <option value={3}>3 Passengers</option>
          <option value={4}>4 Passengers</option>
        </select>
      </div>

      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
