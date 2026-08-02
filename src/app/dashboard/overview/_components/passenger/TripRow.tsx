'use client';

import { memo } from 'react';
import { Clock } from 'lucide-react';

import { parseDeparture } from '../../_utils/overview.utils';

interface Props {
  bookingId: number;
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  driverContactNumber?: string;
  driverName?: string;
  seatsBooked?: number;
  status?: string;
}

function TripRowComponent({
  sourceCity,
  destinationCity,
  departureTime,
  driverContactNumber,
  driverName,
  seatsBooked,
  status,
}: Props) {
  const departure = parseDeparture(departureTime);

  const statusClasses = {
    APPROVED: 'bg-green-50 text-[var(--success)]',
    PENDING: 'bg-[var(--primary-light)] text-[var(--primary)]',
    REJECTED: 'bg-red-50 text-[var(--error)]',
    COMPLETED: 'bg-green-50 text-[var(--success)]',
    CANCELLED: 'bg-red-50 text-[var(--error)]',
  };

  return (
    <div className="border-b border-[var(--border)] py-3.5 last:border-b-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* Left Section */}
        <div className="flex gap-3">
          {/* Date Box */}
          <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--primary-light)]">
            <span className="text-xl leading-none font-bold text-[var(--heading)]">
              {departure.date}
            </span>

            <span className="text-[10px] font-medium text-[var(--primary)] uppercase">
              {departure.month}
            </span>

            <span className="text-[10px] text-[var(--text-light)]">
              {departure.day}
            </span>
          </div>

          {/* Content */}
          <div>
            <h4 className="text-base font-semibold text-[var(--heading)] md:text-lg">
              {sourceCity}
              <span className="mx-2 text-[var(--text-light)]">→</span>
              {destinationCity}
            </h4>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text)] md:text-sm">
              <Clock size={13} />

              <span>{departure.time}</span>

              <span>•</span>

              <span>{seatsBooked ?? 1} Seats Available</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-xs text-[var(--text)] md:text-sm">
                Driver:{' '}
                <span className="font-medium">{driverName ?? '--'}</span>
              </p>
              <p className="text-xs text-[var(--text)] md:text-sm">
                Contact: <span className="font-medium">{driverContactNumber ?? '--'}</span>
              </p>

              {status && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClasses[status as keyof typeof statusClasses] ??
                    'bg-gray-100 text-gray-600'
                    }`}
                >
                  {status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <button className="w-full shrink-0 rounded-xl border border-[var(--primary)] px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary-light)] md:w-auto md:text-sm">
          View Details
        </button>
      </div>
    </div>
  );
}

const TripRow = memo(TripRowComponent);

export default TripRow;
