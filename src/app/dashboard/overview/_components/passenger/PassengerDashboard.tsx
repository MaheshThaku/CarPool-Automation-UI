'use client';

import { memo } from 'react';

import { CurrentUser } from '@/hooks/useCurrentUser';

import { getGreeting, formatDisplayName } from '../../_utils/overview.utils';
import { usePassengerDashboard } from '../../_hooks/usePassengerDashboard';

import PassengerHero from './PassengerHero';
import PassengerStats from './PassengerStats';
import UpcomingTrips from './UpcomingTrips';
import RecentBookings from './RecentBookings';
import ProfileVerification from './ProfileVerification';
import SafetySection from './SafetySection';
import FindRideCard from './FindRideCard';

interface Props {
  user: CurrentUser;
}

function PassengerDashboardComponent({ user }: Props) {
  const { stats, upcomingTrips, bookings, verification } =
    usePassengerDashboard();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <PassengerHero greeting={getGreeting()} name={formatDisplayName(user)} />

      {/* Stats */}
      <PassengerStats
        totalBookings={stats?.totalBookings ?? 0}
        upcomingTrips={stats?.upcomingTrips ?? 0}
        profileVerified={stats?.profileVerified ?? false}
      />

      <FindRideCard />

      {/* Upcoming Trips + Recent Bookings */}
      <div className="grid gap-6 xl:grid-cols-2">
        <UpcomingTrips trips={upcomingTrips} />

        <RecentBookings bookings={bookings} />
      </div>

      {/* Bottom Cards */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileVerification verification={verification} />

        <SafetySection />
      </div>
    </div>
  );
}

export default memo(PassengerDashboardComponent);
