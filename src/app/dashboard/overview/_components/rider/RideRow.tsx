'use client';

import { memo } from 'react';
import { Clock, Users } from 'lucide-react';

import { parseDeparture } from '../../_utils/overview.utils';
import { RideStatus } from '@/types/ride.types';

interface Props {
  id: number;

  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;

  status: RideStatus | null;
}

function RideRowComponent({
  sourceCity,
  destinationCity,
  departureTime,
  availableSeats,
  pricePerSeat,
  status,
}: Props) {
  const trip = parseDeparture(departureTime);

  const statusConfig: Record<
    RideStatus,
    { label: string; className: string }
  > = {
    SCHEDULED: {
      label: 'Scheduled',
      className: 'bg-blue-50 text-blue-700',
    },

    STARTED: {
      label: 'Started',
      className: 'bg-indigo-50 text-indigo-700',
    },

    COMPLETED: {
      label: 'Completed',
      className: 'bg-green-50 text-green-700',
    },

    CANCELLED: {
      label: 'Cancelled',
      className: 'bg-red-50 text-red-700',
    },
  };

  // Null status (passenger search results) → treat as scheduled.
  const config = status ? statusConfig[status] : statusConfig.SCHEDULED;

  return (
    <div className="border-b border-[var(--border)] py-5 last:border-b-0">
      <div className="flex gap-4">
        {/* Date Card */}

        <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[var(--primary-light)]">
          <span className="text-xl leading-none font-bold text-[var(--heading)]">
            {trip.date}
          </span>

          <span className="text-[10px] font-semibold text-[var(--primary)] uppercase">
            {trip.month}
          </span>

          <span className="text-[10px] text-[var(--text-light)]">
            {trip.day}
          </span>
        </div>

        {/* Content */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            {/* Left */}

            <div className="min-w-0">
              <h4 className="text-lg font-semibold break-words text-[var(--heading)]">
                {sourceCity}
                <span className="mx-2 text-[var(--text-light)]">→</span>
                {destinationCity}
              </h4>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--text)]">
                <Clock size={14} />

                <span>{trip.time}</span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {availableSeats} Seats Available
                </span>
              </div>
            </div>

            {/* Price */}

            <div className="shrink-0 text-right">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
              >
                {config.label}
              </span>

              <p className="mt-2 text-xl font-bold text-[var(--primary)]">
                ₹{pricePerSeat}
              </p>

              <span className="text-xs text-[var(--text-light)]">per seat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const RideRow = memo(RideRowComponent);

export default RideRow;
