'use client';

import { memo, useMemo } from 'react';
import { Calendar } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';
import EmptyState from '../shared/EmptyState';

import RideRow from './RideRow';

import { RideResponse } from '@/types/ride.types';

const MAX_RIDES = 5;
const ACTIVE_STATUSES = new Set<RideResponse['status']>(['SCHEDULED', 'STARTED']);

interface Props {
  readonly rides: RideResponse[];
}

function UpcomingRidesComponent({ rides }: Props) {
  const upcomingRides = useMemo(
    () =>
      rides
        .filter((ride) => ACTIVE_STATUSES.has(ride.status))
        .slice(0, MAX_RIDES),
    [rides],
  );

  return (
    <DashboardCard className="flex flex-col overflow-hidden p-0">
      <div className="flex items-start justify-between border-b border-(--border) px-6 py-5">
        <div>
          <h3 className="text-2xl font-semibold text-(--heading)">
            Upcoming Rides
          </h3>
          <p className="mt-1 text-sm text-(--text-light)">
            Your scheduled and active rides
          </p>
        </div>

        <span className="rounded-full bg-(--primary-light) px-3 py-1 text-sm font-semibold text-(--primary)">
          {upcomingRides.length} Rides
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        {upcomingRides.length === 0 ? (
          <div className="px-6 py-10">
            <EmptyState
              icon={Calendar}
              title="No Upcoming Rides"
              description="Scheduled or active rides will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-(--border) px-6">
            {upcomingRides.map((ride) => (
              <RideRow
                key={ride.id}
                id={ride.id}
                sourceCity={ride.sourceCity}
                destinationCity={ride.destinationCity}
                departureTime={ride.departureTime}
                availableSeats={ride.availableSeats}
                pricePerSeat={ride.pricePerSeat}
                status={ride.status}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

const UpcomingRides = memo(UpcomingRidesComponent);

export default UpcomingRides;
