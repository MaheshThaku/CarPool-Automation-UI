'use client';

import { memo } from 'react';

import { useCurrentUser } from '@/hooks/useCurrentUser';

import RiderDashboard from './rider/RiderDashboard';
import PassengerDashboard from './passenger/PassengerDashboard';
import DashboardLoader from './DashboardLoader';

function DashboardContainerComponent() {
  const user = useCurrentUser();

  if (!user) {
    return <DashboardLoader />;
  }

  if (user.role === 'ROLE_RIDER') {
    return <RiderDashboard user={user} />;
  }

  if (user.role === 'ROLE_PASSENGER') {
    return <PassengerDashboard user={user} />;
  }

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h3 className="font-semibold text-red-600">Invalid User Role</h3>

      <pre className="mt-2 text-xs">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

const DashboardContainer = memo(DashboardContainerComponent);

export default DashboardContainer;
