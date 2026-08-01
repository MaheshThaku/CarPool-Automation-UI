'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';

import { BookingStatus } from '@/types/dashboard.types';

import { TABS } from './bookingUtils';

type FilterTab = BookingStatus | "ALL" | "UPCOMING";

interface Props {
  activeTab: FilterTab;

  search: string;

  total: number;

  upcoming: number;

  approved: number;

  pending: number;

  completed: number;

  rejected: number;

  cancelled: number;

  onTabChange: (tab: FilterTab) => void;

  onSearchChange: (value: string) => void;
}

function BookingFiltersComponent({
  activeTab,
  search,
  total,
  upcoming,
  approved,
  pending,
  completed,
  rejected,
  cancelled,
  onTabChange,
  onSearchChange,
}: Props) {
  const counts = {
    UPCOMING: upcoming,
    ALL: total,
    APPROVED: approved,
    PENDING: pending,
    COMPLETED: completed,
    REJECTED: rejected,
    CANCELLED: cancelled,
  };

  return (
    <section className="flex flex-wrap items-center gap-3">
      {/* Tabs */}

      <div className="flex overflow-x-auto rounded-xl border border-[var(--border)] bg-white p-1">
        {TABS.map(({ key, label }) => {
          const active = activeTab === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onTabChange(key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all ${active
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--text)] hover:text-[var(--heading)]'
                }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{label}</span>

                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active
                    ? "bg-white/30 text-white"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {counts[key]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}

      <div className="relative min-w-[180px] flex-1">
        <Search
          size={15}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-light)]"
        />

        <input
          type="text"
          placeholder="Search city or driver…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-white py-2 pr-4 pl-9 text-sm text-[var(--heading)] outline-none placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>
    </section>
  );
}

const BookingFilters = memo(BookingFiltersComponent);

export default BookingFilters;
