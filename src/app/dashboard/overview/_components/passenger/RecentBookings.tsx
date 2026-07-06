'use client';

import { memo } from 'react';
import { BookOpen } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';
import EmptyState from '../shared/EmptyState';
import Pagination from '../shared/Paginationc';

import { usePagination } from '../../_hooks/usePagination';
import RecentBookingRow from './RecentBookingRow';

interface Booking {
  bookingId: number;
  sourceCity: string;
  destinationCity: string;
  bookingTime: string;
  totalAmount?: number;
  status: string;
  driverName?: string;
}

interface Props {
  bookings: Booking[];
}

function RecentBookingsComponent({ bookings }: Props) {
  const {
    paginatedItems,
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
  } = usePagination({
    items: bookings,
    pageSize: 5,
  });

  return (
    <DashboardCard className="flex min-h-[520px] flex-col overflow-hidden p-0 lg:h-[650px]">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <h3 className="text-lg font-semibold text-[var(--heading)] md:text-xl">
          Recent Bookings
        </h3>
      </div>

      {/* Body */}

      <div className="flex-1 overflow-hidden">
        {bookings.length === 0 ? (
          <div className="px-5 py-10">
            <EmptyState
              icon={BookOpen}
              title="No Recent Bookings"
              description="Booking history will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)] px-5">
            {paginatedItems.map((booking) => (
              <RecentBookingRow key={booking.bookingId} booking={booking} />
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

export default memo(RecentBookingsComponent);
