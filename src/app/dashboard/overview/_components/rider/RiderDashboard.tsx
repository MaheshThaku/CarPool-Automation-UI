'use client';

import { memo } from 'react';

import { CurrentUser } from '@/hooks/useCurrentUser';

import { getGreeting, formatDisplayName } from '../../_utils/overview.utils';
import { useRiderDashboard } from '../../_hooks/useRiderDashboard';

import RiderHero from './RiderHero';
import RiderStats from './RiderStats';
import OfferRideCard from './OfferRideCard';
import UpcomingRides from './UpcomingRides';
import VerificationStatus from './VerificationStatus';
import VehicleInformation from './VehicleInformation';
import ProfileCompletion from './ProfileCompletion';

interface Props {
  user: CurrentUser;
}

function RiderDashboardComponent({ user }: Props) {
  const {
    stats,
    upcomingRides,
    vehicles,
    riderVerification,
  } = useRiderDashboard();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <RiderHero greeting={getGreeting()} name={formatDisplayName(user)} />

      {/* Profile Completion & Verification Readiness */}
      <ProfileCompletion
        riderVerification={riderVerification}
        hasVehicle={(vehicles && vehicles.length > 0) || false}
      />

      {/* Stats */}
      <RiderStats
        totalRides={stats?.totalRides ?? 0}
        scheduledRides={stats?.upcomingRides ?? 0}
        verificationStatus={stats?.verificationStatus}
      />

      {/* Offer Ride Banner */}
      <OfferRideCard />

      {/* Upcoming Rides */}
      <UpcomingRides rides={upcomingRides} />

      {/* Verification Status + Vehicle Information */}
      <div className="grid gap-6 xl:grid-cols-2">
        <VerificationStatus riderVerification={riderVerification} />

        <VehicleInformation vehicles={vehicles || []} />
      </div>
    </div>
  );
}

const RiderDashboard = memo(RiderDashboardComponent);

export default RiderDashboard;
