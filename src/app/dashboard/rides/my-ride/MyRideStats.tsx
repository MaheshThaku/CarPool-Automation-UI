'use client';

import { memo } from 'react';
import { Car, CalendarDays, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';

import { RideFilterTab } from '../_types/ride-page.types';

interface Props {
  total: number;

  scheduled: number;

  completed: number;

  cancelled: number;

  loading?: boolean;

  /** Currently selected filter — the matching card gets an active ring. */
  activeTab?: RideFilterTab;

  /** When provided, each stat card becomes a button that filters the list. */
  onSelect?: (tab: RideFilterTab) => void;
}

function MyRideStatsComponent({
  total,
  scheduled,
  completed,
  cancelled,
  loading = false,
  activeTab = 'ALL',
  onSelect,
}: Props) {
  const stats: Array<{
    key: RideFilterTab;
    label: string;
    value: number;
    icon: LucideIcon;
    iconColor: string;
    bg: string;
  }> = [
    {
      key: 'ALL',
      label: 'Total Rides',
      value: total,
      icon: Car,
      iconColor: 'text-[var(--primary)]',
      bg: 'bg-[var(--primary-light)]',
    },
    {
      key: 'SCHEDULED',
      label: 'Scheduled',
      value: scheduled,
      icon: CalendarDays,
      iconColor: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      key: 'COMPLETED',
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      key: 'CANCELLED',
      label: 'Cancelled',
      value: cancelled,
      icon: XCircle,
      iconColor: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  return (
    <section
      aria-label="Ride statistics"
      className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white"
    >
      <div className="grid grid-cols-2 divide-x divide-y divide-[var(--border)] sm:grid-cols-4 sm:divide-y-0">
        {stats.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          const isClickable = Boolean(onSelect);

          return (
            <button
              key={item.key}
              type="button"
              disabled={!isClickable}
              onClick={() => onSelect?.(item.key)}
              aria-pressed={active}
              aria-label={`Show ${item.label.toLowerCase()}`}
              className={`relative flex items-center gap-3 p-4 text-left transition-colors lg:p-5 ${
                isClickable
                  ? 'cursor-pointer hover:bg-[var(--background)]'
                  : 'cursor-default'
              } ${
                active
                  ? 'bg-[var(--primary-light)]/40 ring-2 ring-inset ring-[var(--primary)]/40'
                  : ''
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon size={22} className={item.iconColor} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-[var(--text-light)] uppercase">
                  {item.label}
                </p>

                {loading ? (
                  <div className="mt-2 h-7 w-12 animate-pulse rounded bg-gray-200" />
                ) : (
                  <p className="mt-1 text-2xl font-bold text-[var(--heading)]">
                    {item.value}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const MyRideStats = memo(MyRideStatsComponent);

export default MyRideStats;
