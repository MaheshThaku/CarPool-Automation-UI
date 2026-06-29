'use client';

import { memo } from 'react';
import { Calendar, Clock, IndianRupee, MapPin, Users } from 'lucide-react';

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
}: RideCardProps) {
  const departure = formatDeparture(ride.departureTime);

  const availableSeats = ride.availableSeats;

  const status = rideStatusConfig(ride.status);

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-300 hover:border-[var(--primary)] hover:shadow-lg">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[var(--primary)]" />

            <h3 className="truncate text-lg font-semibold text-[var(--heading)]">
              {ride.sourceCity}
            </h3>
          </div>

          <div className="mt-1 ml-2 h-5 w-px bg-[var(--border)]" />

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[var(--primary)]" />

            <h3 className="truncate text-lg font-semibold text-[var(--heading)]">
              {ride.destinationCity}
            </h3>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className} `}
        >
          {status.label}
        </span>
      </div>

      {/* Ride Details */}

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-1 text-[var(--text-light)]">
            <Calendar size={14} />
            <span className="text-xs">Date</span>
          </div>

          <p className="mt-1 text-sm font-medium text-[var(--heading)]">
            {departure.date}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[var(--text-light)]">
            <Clock size={14} />
            <span className="text-xs">Time</span>
          </div>

          <p className="mt-1 text-sm font-medium text-[var(--heading)]">
            {departure.time}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[var(--text-light)]">
            <Users size={14} />
            <span className="text-xs">Seats Available</span>
          </div>

          <p className="mt-1 text-sm font-medium text-[var(--heading)]">
            {availableSeats}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[var(--text-light)]">
            <IndianRupee size={14} />
            <span className="text-xs">Per Seat</span>
          </div>

          <p className="mt-1 text-sm font-semibold text-[var(--primary)]">
            {formatCurrency(ride.pricePerSeat)}
          </p>
        </div>
      </div>

      {/* Vehicle Info */}

      <div className="mt-4 rounded-xl bg-[var(--background)] p-3">
        <p className="text-xs text-[var(--text-light)]">Vehicle</p>

        <p className="mt-1 text-sm font-medium text-[var(--heading)]">
          {ride.vehicleName}
        </p>

        <p className="text-xs text-[var(--text-light)]">
          {ride.vehicleLicensePlate}
        </p>
      </div>

      {/* Footer */}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-[var(--text-light)]">Driver</p>

          <p className="text-sm font-medium text-[var(--heading)]">
            {ride.driverName}
          </p>
        </div>

        <button
          type="button"
          disabled={availableSeats <= 0 || bookingLoading || booked}
          onClick={() => onBook?.(ride.id)}
          className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all ${
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
                ? 'Ride Full'
                : 'Book Ride'}
        </button>
      </div>
    </article>
  );
}

export default memo(RideCardComponent);
