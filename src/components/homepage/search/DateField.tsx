'use client';

import { Calendar } from 'lucide-react';

interface Props {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DateField({ value, onChange, error }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-wide text-[var(--text-light)] uppercase">
        Date
      </label>

      <div
        className={`flex items-center gap-3 rounded-xl border bg-[var(--surface)] px-4 py-4 ${
          error ? 'border-[var(--error)]' : 'border-[var(--border)]'
        } `}
      >
        <Calendar size={18} className="text-[var(--primary)]" />

        <input
          type="date"
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-[var(--heading)] outline-none"
        />
      </div>

      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
