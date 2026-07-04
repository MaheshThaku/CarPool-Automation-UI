'use client';

import { memo } from 'react';

import { CalendarCheck, BookOpen, ShieldCheck } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';

interface Props {
  totalBookings: number;
  upcomingTrips: number;
  profileVerified: boolean;
}

function PassengerStatsComponent({
  totalBookings,
  upcomingTrips,
  profileVerified,
}: Props) {
  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      subtitle: 'All time',
      icon: BookOpen,
      bg: 'bg-[var(--primary-light)]',
      iconColor: 'text-[var(--primary)]',
    },

    {
      title: 'Upcoming Trips',
      value: upcomingTrips,
      subtitle: 'Next 7 days',
      icon: CalendarCheck,
      bg: 'bg-[var(--primary-light)]',
      iconColor: 'text-[var(--primary)]',
    },

    {
      title: 'Profile Verified',
      value: profileVerified ? 'Verified' : 'Pending',
      subtitle: profileVerified
        ? "You're good to go!"
        : 'Verification required',
      icon: ShieldCheck,
      bg: profileVerified ? 'bg-green-50' : 'bg-amber-50',
      iconColor: profileVerified ? 'text-green-600' : 'text-amber-600',
      valueColor: profileVerified ? 'text-green-600' : 'text-amber-600',
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

              <div>
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

export default memo(PassengerStatsComponent);
