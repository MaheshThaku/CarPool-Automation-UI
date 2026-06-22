'use client';

import { MapPin } from 'lucide-react';

interface Props {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LocationField({
  label,
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs font-semibold uppercase tracking-wide text-[var(--text-light)]"
      >
        {label}
      </label>

      <div
        className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
      >
        <MapPin size={18} className="text-[var(--primary)]" />

        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-[var(--heading)] outline-none placeholder:text-[var(--text-light)]"
        />
      </div>

      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
