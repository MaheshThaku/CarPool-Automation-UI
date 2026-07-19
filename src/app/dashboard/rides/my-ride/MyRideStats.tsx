'use client';

import { memo } from 'react';

import { Car, CalendarDays, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  total: number;

  scheduled: number;

  completed: number;

  cancelled: number;

  loading?: boolean;
}

function MyRideStatsComponent({
  total,
  scheduled,
  completed,
  cancelled,
  loading = false,
}: Props) {
  const stats = [
    {
      label: 'Total Rides',
      value: total,
      icon: Car,
      iconColor: 'text-[var(--primary)]',
      bg: 'bg-[var(--primary-light)]',
    },
    {
      label: 'Upcoming',
      value: scheduled,
      icon: CalendarDays,
      iconColor: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
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

          return (
            <div
              key={item.label}
              className="flex items-center gap-3 p-4 lg:p-5"
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

const MyRideStats = memo(MyRideStatsComponent);

export default MyRideStats;
