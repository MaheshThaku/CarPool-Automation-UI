'use client';

import { User } from 'lucide-react';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface Props {
  value: Gender;
  onChange: (value: Gender) => void;
}

const genders = [
  {
    value: 'MALE',
    label: 'Male',
  },
  {
    value: 'FEMALE',
    label: 'Female',
  },
  {
    value: 'OTHER',
    label: 'Other',
  },
] as const;

export default function GenderSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {genders.map((gender) => {
        const active = value === gender.value;

        return (
          <button
            key={gender.value}
            type="button"
            onClick={() => onChange(gender.value)}
            aria-pressed={active}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all duration-200 sm:h-14 sm:text-base ${
              active
                ? `border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm`
                : `border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--primary)]`
            } `}
          >
            <User
              size={18}
              className="shrink-0"
            />

            <span>{gender.label}</span>
          </button>
        );
      })}
    </div>
  );
}
