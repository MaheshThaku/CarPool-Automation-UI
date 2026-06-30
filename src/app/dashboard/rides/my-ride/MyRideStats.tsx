'use client';

import { memo } from 'react';

interface Props {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
}

function MyRideStatsComponent({
  total,
  scheduled,
  completed,
  cancelled,
}: Props) {
  const stats = [
    {
      label: 'Total',
      value: total,
      color: 'text-[var(--heading)]',
    },
    {
      label: 'Scheduled',
      value: scheduled,
      color: 'text-blue-600',
    },
    {
      label: 'Completed',
      value: completed,
      color: 'text-green-600',
    },
    {
      label: 'Cancelled',
      value: cancelled,
      color: 'text-red-600',
    },
  ];

  return (
    <section className="rounded-3xl border border-[var(--border)] bg-white p-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-[var(--text-light)]">{item.label}</p>

            <h3 className={`mt-1 text-2xl font-bold ${item.color}`}>
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

const MyRideStats = memo(MyRideStatsComponent);

export default MyRideStats;
