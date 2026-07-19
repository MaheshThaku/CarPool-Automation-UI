'use client';

import { memo, useMemo } from 'react';
import { Calendar } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';
import EmptyState from '../shared/EmptyState';
import Pagination from '../shared/Paginationc';

import RideRow from './RideRow';

import { RideResponse } from '@/types/ride.types';

interface Props {
  readonly rides: RideResponse[];
  readonly page: number;
  readonly totalPages: number;
  readonly totalElements: number;
  readonly onPageChange: (page: number) => void;
}

function isUpcomingRide(
  ride: RideResponse,
): ride is RideResponse & { status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' } {
  return ride.status !== 'STARTED';
}

function UpcomingRidesComponent({
  rides,
  page,
  totalPages,
  totalElements,
  onPageChange,
}: Props) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const upcomingRides = useMemo(() => rides.filter(isUpcomingRide), [rides]);

  return (
    <DashboardCard className="flex flex-col overflow-hidden p-0">
      <div className="flex items-start justify-between border-b border-(--border) px-6 py-5">
        <div>
          <h3 className="text-2xl font-semibold text-(--heading)">
            Upcoming Rides
          </h3>
          <p className="mt-1 text-sm text-(--text-light)">
            Your scheduled published rides
          </p>
        </div>

        <span className="rounded-full bg-(--primary-light) px-3 py-1 text-sm font-semibold text-(--primary)">
          {totalElements} Rides
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        {upcomingRides.length === 0 ? (
          <div className="px-6 py-10">
            <EmptyState
              icon={Calendar}
              title="No Upcoming Rides"
              description="Published rides will appear here."
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

      {totalPages > 1 && (
        <div className="border-t border-(--border) px-6 py-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            hasPrev={hasPrev}
            hasNext={hasNext}
            prevPage={() => onPageChange(page - 1)}
            nextPage={() => onPageChange(page + 1)}
          />
        </div>
      )}
    </DashboardCard>
  );
}

const UpcomingRides = memo(UpcomingRidesComponent);

export default UpcomingRides;
