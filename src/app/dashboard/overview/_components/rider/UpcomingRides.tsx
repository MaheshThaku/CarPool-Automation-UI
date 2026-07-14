'use client';

import { memo } from 'react';
import { Calendar } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';
import EmptyState from '../shared/EmptyState';
import Pagination from '../shared/Paginationc';

import RideRow from './RideRow';

import { RideResponse } from '@/types/ride.types';

interface Props {
  rides: RideResponse[];

  page: number;

  totalPages: number;

  totalElements: number;

  onPageChange: (page: number) => void;
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
          {totalElements} Rides
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
            {rides.map((ride) => (
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

      {/* Footer */}

      {totalPages > 1 && (
        <div className="border-t border-[var(--border)] px-6 py-4">
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
