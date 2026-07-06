'use client';

import { memo } from 'react';
import { MapPin } from 'lucide-react';

interface Props {
  booking: {
    bookingId: number;
    sourceCity: string;
    destinationCity: string;
    bookingTime: string;
    status: string;
    totalAmount?: number;
  };
}

function RecentBookingRowComponent({ booking }: Props) {
  const bookingDate = new Date(booking.bookingTime);

  const formattedDate = bookingDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = bookingDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusClasses = {
    APPROVED: 'bg-green-50 text-[var(--success)]',
    COMPLETED: 'bg-green-50 text-[var(--success)]',
    PENDING: 'bg-[var(--primary-light)] text-[var(--primary)]',
    REJECTED: 'bg-red-50 text-[var(--error)]',
    CANCELLED: 'bg-red-50 text-[var(--error)]',
  };

  return (
    <div className="my-3 py-4">
      <div className="flex items-start gap-4">
        {/* Icon */}

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--background)]">
          <MapPin size={18} className="text-[var(--text-light)]" />
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            {/* Left */}

            <div className="min-w-0">
              <h4 className="truncate text-base font-semibold text-[var(--heading)] md:text-lg">
                {booking.sourceCity}
                <span className="mx-2 text-[var(--text-light)]">→</span>
                {booking.destinationCity}
              </h4>

              <p className="mt-1 text-sm text-[var(--text-light)]">
                {formattedDate}
                {' • '}
                {formattedTime}
              </p>
            </div>

            {/* Right */}

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="text-lg font-semibold text-[var(--heading)] md:text-xl">
                ₹{booking.totalAmount ?? 0}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusClasses[booking.status as keyof typeof statusClasses] ??
                  'bg-gray-100 text-gray-600'
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RecentBookingRowComponent);
