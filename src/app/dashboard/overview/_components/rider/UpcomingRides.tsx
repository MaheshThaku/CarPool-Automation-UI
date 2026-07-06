'use client';

import { memo } from 'react';
import { Calendar } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';
import EmptyState from '../shared/EmptyState';
import Pagination from '../shared/Paginationc';

import { usePagination } from '../../_hooks/usePagination';

import RideRow from './RideRow';
import { UpcomingRide } from '@/types/dashboard.types';

interface Props {
  rides: UpcomingRide[];
}

function UpcomingRidesComponent({ rides }: Props) {
  const {
    paginatedItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination({
    items: rides,
    pageSize: 5,
  });

  return (
    <DashboardCard className="flex flex-col overflow-hidden p-0">
      {/* Header */}

      <div className="flex items-start justify-between border-b border-[var(--border)] px-6 py-5">
        <div>
          <h3 className="text-2xl font-semibold text-[var(--heading)]">
            Upcoming Rides
          </h3>

          <p className="mt-1 text-sm text-[var(--text-light)]">
            Your scheduled published rides
          </p>
        </div>

        <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-sm font-semibold text-[var(--primary)]">
          {rides.length} Rides
        </span>
      </div>

      {/* Body */}

      <div className="flex-1 overflow-hidden">
        {rides.length === 0 ? (
          <div className="px-6 py-10">
            <EmptyState
              icon={Calendar}
              title="No Upcoming Rides"
              description="Published rides will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)] px-6">
            {paginatedItems.map((ride) => (
              <RideRow
                key={ride.id}
                id={ride.id}
                sourceCity={ride.sourceCity}
                destinationCity={ride.destinationCity}
                departureTime={ride.departureTime}
                availableSeats={ride.availableSeats}
                pricePerSeat={ride.pricePerSeat}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}

      {totalPages > 1 && (
        <div>
          <Pagination
            page={page}
            totalPages={totalPages}
            hasPrev={hasPrev}
            hasNext={hasNext}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </div>
      )}
    </DashboardCard>
  );
}

const UpcomingRides = memo(UpcomingRidesComponent);

export default UpcomingRides;
