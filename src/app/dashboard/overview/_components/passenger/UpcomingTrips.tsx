'use client';

import { memo } from 'react';
import { Calendar } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';
import EmptyState from '../shared/EmptyState';
import Pagination from '../shared/Paginationc';

import { usePagination } from '../../_hooks/usePagination';
import TripRow from './TripRow';

interface Trip {
  bookingId: number;
  sourceCity: string;
  destinationCity: string;
  bookingTime: string;
  driverName?: string;
  seatsBooked?: number;
  status?: string;
}

interface Props {
  trips: Trip[];
}

function UpcomingTripsComponent({ trips }: Props) {
  const {
    paginatedItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination({
    items: trips,
    pageSize: 5,
  });

  return (
    <DashboardCard className="flex min-h-[520px] flex-col overflow-hidden p-0 lg:h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-lg font-semibold text-[var(--heading)] md:text-xl">
          Upcoming Trips
        </h3>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {trips.length === 0 ? (
          <div className="px-5 py-10">
            <EmptyState
              icon={Calendar}
              title="No Upcoming Trips"
              description="Your planned journeys will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)] px-5">
            {paginatedItems.map((trip) => (
              <TripRow
                key={trip.bookingId}
                bookingId={trip.bookingId}
                sourceCity={trip.sourceCity}
                destinationCity={trip.destinationCity}
                bookingTime={trip.bookingTime}
                driverName={trip.driverName}
                seatsBooked={trip.seatsBooked}
                status={trip.status}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {totalPages > 1 && (
        <div className="">
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

export default memo(UpcomingTripsComponent);
