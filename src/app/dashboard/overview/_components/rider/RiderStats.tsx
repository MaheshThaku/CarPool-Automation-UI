'use client';

import { memo } from 'react';

import { Car, CalendarCheck, ShieldCheck } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';

interface Props {
  totalRides: number;
  scheduledRides: number;
  verificationStatus?: string;
}

function RiderStatsComponent({
  totalRides,
  scheduledRides,
  verificationStatus = 'PENDING',
}: Props) {
  const isVerified = verificationStatus === 'VERIFIED';

  const isRejected = verificationStatus === 'REJECTED';

  const stats = [
    {
      title: 'Total Rides',
      value: totalRides,
      subtitle: 'All time',
      icon: Car,
      bg: 'bg-[var(--primary-light)]',
      iconColor: 'text-[var(--primary)]',
    },

    {
      title: 'Upcoming Rides',
      value: scheduledRides,
      subtitle: 'Next 7 days',
      icon: CalendarCheck,
      bg: 'bg-[var(--primary-light)]',
      iconColor: 'text-[var(--primary)]',
    },

    {
      title: 'Verification Status',
      value: isVerified ? 'Verified' : isRejected ? 'Rejected' : 'Pending',
      subtitle: isVerified
        ? "You're good to go!"
        : isRejected
          ? 'Verification rejected'
          : 'Complete verification',
      icon: ShieldCheck,
      bg: isVerified ? 'bg-green-50' : isRejected ? 'bg-red-50' : 'bg-amber-50',
      iconColor: isVerified
        ? 'text-green-600'
        : isRejected
          ? 'text-red-600'
          : 'text-amber-600',
      valueColor: isVerified
        ? 'text-green-600'
        : isRejected
          ? 'text-red-600'
          : 'text-amber-600',
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <DashboardCard key={item.title} className="h-[110px]">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.bg}`}
              >
                <Icon size={24} className={item.iconColor} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-[var(--text-light)]">{item.title}</p>

                <h3
                  className={`mt-1 text-2xl font-bold ${
                    item.valueColor ?? 'text-[var(--heading)]'
                  }`}
                >
                  {item.value}
                </h3>

                <p className="text-sm text-[var(--text-light)]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}

const RiderStats = memo(RiderStatsComponent);

export default RiderStats;
