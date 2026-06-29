'use client';

import { memo } from 'react';
import { Search } from 'lucide-react';

import { RideStatus } from '@/types/ride.types';

type FilterTab = 'ALL' | RideStatus;

interface Props {
  activeTab: FilterTab;

  search: string;

  total: number;

  scheduled: number;

  completed: number;

  cancelled: number;

  onTabChange: (tab: FilterTab) => void;

  onSearchChange: (value: string) => void;
}

function MyRideFiltersComponent({
  activeTab,
  search,
  total,
  scheduled,
  completed,
  cancelled,
  onTabChange,
  onSearchChange,
}: Props) {
  const tabs = [
    {
      key: 'ALL',
      label: 'All Rides',
      count: total,
    },
    {
      key: 'SCHEDULED',
      label: 'Scheduled',
      count: scheduled,
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
      count: completed,
    },
    {
      key: 'CANCELLED',
      label: 'Cancelled',
      count: cancelled,
    },
  ] as const;

  return (
    <section className="flex flex-col gap-4 xl:flex-row xl:items-center">
      {/* Tabs */}

      <div className="scrollbar-hide flex overflow-x-auto rounded-2xl border border-[var(--border)] bg-white p-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                active
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text)] hover:text-[var(--heading)]'
              } `}
            >
              {tab.label}

              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-[var(--text-light)]'
                } `}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}

      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-light)]"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by city..."
          className="h-12 w-full rounded-2xl border border-[var(--border)] bg-white pr-4 pl-11 text-sm text-[var(--heading)] transition-all duration-300 outline-none placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
        />
      </div>
    </section>
  );
}

const MyRideFilters = memo(MyRideFiltersComponent);

export default MyRideFilters;
