'use client';

import { memo } from 'react';
import { Calendar, Clock, IndianRupee, Users } from 'lucide-react';

import { RideCardProps } from '../_types/ride-page.types';
import {
  formatCurrency,
  formatDeparture,
  rideStatusConfig,
} from '../_utils/ride.utils';

function RideCardComponent({
  ride,
  onBook,
  booked = false,
  bookingLoading = false,
  requiredSeats = 1,
}: RideCardProps) {
  const departure = formatDeparture(ride.departureTime);

  const availableSeats = ride.availableSeats;

  const status = rideStatusConfig(ride.status);

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-300 hover:border-[var(--primary)] hover:shadow-md">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_1.3fr_1fr_1.1fr] md:items-center">
        {/* Route (From -> To) */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative flex flex-col justify-center items-center py-1 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-[var(--primary)] bg-white" />
            <div className="w-0.5 h-5 bg-[var(--border)] my-0.5" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
          </div>
          <div className="flex flex-col justify-between py-0.5 h-11 min-w-0">
            <span className="text-sm font-semibold text-[var(--heading)] truncate leading-tight">
              {ride.sourceCity}
            </span>
            <span className="text-sm font-semibold text-[var(--heading)] truncate leading-tight">
              {ride.destinationCity}
            </span>
          </div>
        </div>

        {/* Schedule & Vehicle */}
        <div className="flex flex-col justify-center gap-1 md:border-l md:border-[var(--border)] md:pl-4 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-light)] flex-wrap">
            <Calendar size={13} className="text-[var(--primary)]" />
            <span className="font-medium text-[var(--heading)]">{departure.date}</span>
            <span>•</span>
            <Clock size={13} className="text-[var(--primary)]" />
            <span className="font-medium text-[var(--heading)]">{departure.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-light)] min-w-0">
            <span className="truncate">Driver: <strong className="font-medium text-[var(--heading)]">{ride.driverName}</strong></span>
            <span>•</span>
            <span className="truncate">Vehicle: <strong className="font-medium text-[var(--heading)]">{ride.vehicleName}</strong></span>
          </div>
        </div>

        {/* Seats & Price */}
        <div className="flex flex-col justify-center gap-1 md:border-l md:border-[var(--border)] md:pl-4">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-light)]">
            <Users size={13} className="text-[var(--primary)]" />
            <span>Available:</span>
            <span className="font-semibold text-[var(--heading)]">{availableSeats} seats</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-light)]">
            <IndianRupee size={13} className="text-[var(--primary)]" />
            <span>Per seat:</span>
            <span className="font-bold text-[var(--primary)]">{formatCurrency(ride.pricePerSeat)}</span>
          </div>
        </div>

        {/* Status & Booking button */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-[var(--border)] md:border-t-0 md:pt-0 md:border-l md:border-[var(--border)] md:pl-4 md:flex-col md:items-end md:justify-center">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold flex-shrink-0 ${status.className}`}>
            {status.label}
          </span>
          <button
            type="button"
            disabled={availableSeats <= 0 || bookingLoading || booked}
            onClick={() => onBook?.(ride.id)}
            className={`w-full md:w-auto rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all shadow-sm ${
              booked
                ? 'bg-green-600'
                : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)]'
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {bookingLoading
              ? 'Booking...'
              : booked
                ? 'Request Sent'
                : availableSeats <= 0
                  ? 'Full'
                  : requiredSeats > 1
                    ? `Book ${requiredSeats} Seats`
                    : 'Book Ride'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(RideCardComponent);
