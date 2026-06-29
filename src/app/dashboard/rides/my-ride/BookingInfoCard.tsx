'use client';

import { memo } from 'react';
import { Calendar, Car, Check, MapPin, Trash2, Users, X } from 'lucide-react';

import { RideBookingResponse } from '@/types/ride.types';

import PassengerAvatar from './PassengerAvatar';
import { getBookingStatusConfig } from './ride-status';

interface Props {
  booking: RideBookingResponse;
  loading?: boolean;
  onApprove: (bookingId: number) => Promise<void>;
  onReject: (bookingId: number) => Promise<void>;
  onDelete: (bookingId: number) => void | Promise<void>;
}

function BookingInfoCardComponent({
  booking,
  loading = false,
  onApprove,
  onReject,
  onDelete,
}: Props) {
  const status = getBookingStatusConfig(booking.status);
  const bookingDate = new Date(booking.bookingTime).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const canDelete =
    booking.status === 'REJECTED' ||
    booking.status === 'CANCELLED' ||
    booking.status === 'COMPLETED';

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:shadow-md">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <PassengerAvatar
            name={booking.passengerName}
            photoUrl={booking.passengerProfilePic}
          />

          <div>
            <h4 className="font-semibold text-[var(--heading)]">
              {booking.passengerName}
            </h4>

            <p className="text-xs text-[var(--text-light)]">
              {booking.passengerAge
                ? `${booking.passengerAge} years`
                : 'Passenger'}
            </p>

            <p className="mt-1 text-xs text-[var(--text-light)]">
              Booking #{booking.bookingId}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text} `}
        >
          {status.label}
        </span>
      </div>

      {/* Route */}

      <div className="mt-5 rounded-xl bg-[var(--background)] p-3">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-[var(--primary)]" />

          <span className="font-medium text-[var(--heading)]">
            {booking.sourceCity}
          </span>

          <span className="text-[var(--text-light)]">→</span>

          <span className="font-medium text-[var(--heading)]">
            {booking.destinationCity}
          </span>
        </div>
      </div>

      {/* Details */}

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div>
          <p className="text-xs text-[var(--text-light)]">Seats</p>

          <div className="mt-1 flex items-center gap-1">
            <Users size={14} />

            <span className="font-medium text-[var(--heading)]">
              {booking.seatsBooked}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-[var(--text-light)]">Amount</p>

          <p className="mt-1 font-semibold text-[var(--primary)]">
            ₹{booking.totalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--text-light)]">Vehicle</p>

          <div className="mt-1 flex items-center gap-1">
            <Car size={14} />

            <span className="font-medium text-[var(--heading)]">
              {booking.vehicleModel ?? 'N/A'}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs text-[var(--text-light)]">Vehicle No.</p>

          <p className="mt-1 font-medium text-[var(--heading)]">
            {booking.vehicleRegistrationNumber ?? 'N/A'}
          </p>
        </div>
      </div>

      {/* Driver */}

      {booking.driverName && (
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <p className="text-xs text-[var(--text-light)]">Driver</p>

          <p className="mt-1 font-medium text-[var(--heading)]">
            {booking.driverName}
            {booking.driverAge && ` • ${booking.driverAge} yrs`}
          </p>
        </div>
      )}

      {/* Booking Time */}

      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-light)]">
        <Calendar size={14} />
        Requested on {bookingDate}
      </div>

      {/* Actions */}

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        {booking.status === 'PENDING' && (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={() => onReject(booking.bookingId)}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 disabled:opacity-60"
            >
              <X size={14} />

              {loading ? 'Processing...' : 'Reject'}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => onApprove(booking.bookingId)}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 disabled:opacity-60"
            >
              <Check size={14} />

              {loading ? 'Processing...' : 'Approve'}
            </button>
          </>
        )}

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(booking.bookingId)}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

const BookingInfoCard = memo(BookingInfoCardComponent);

export default BookingInfoCard;
