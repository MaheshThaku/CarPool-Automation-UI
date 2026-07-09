'use client';

import { memo, useState } from 'react';

import { ArrowRight, Car, ChevronDown, ChevronUp, Users } from 'lucide-react';

import { RideResponse } from '@/types/ride.types';
import { rideService } from '@/services/ride.service';

import RideBookingsPanel from './RideBookingPanel';
import { getRideStatusConfig } from './ride-status';

interface Props {
  ride: RideResponse;
  mobile?: boolean;
  onRefresh?: () => void;
}

function formatDeparture(departureTime: string) {
  const date = new Date(departureTime);

  return {
    date: date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),

    day: date.toLocaleDateString('en-IN', {
      weekday: 'short',
    }),

    time: date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

function MyRideRowComponent({ ride, mobile = false, onRefresh }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const departure = formatDeparture(ride.departureTime);

  const status = getRideStatusConfig(ride.status);

  const StatusIcon = status.icon;

  const handleCompleteRide = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to mark this ride as completed? This will also complete all approved bookings and reject pending requests.'
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await rideService.completeRide(ride.id);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to complete ride');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MOBILE ---------------- */

  if (mobile) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-[var(--heading)]">
              <span>{ride.sourceCity}</span>

              <ArrowRight size={14} />

              <span>{ride.destinationCity}</span>
            </div>

            <p className="mt-1 text-xs text-[var(--text-light)]">
              Ride #{ride.id}
            </p>
          </div>

          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${status.bg} ${status.text} `}
          >
            <StatusIcon size={10} />

            {status.label}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[var(--text-light)]">Date</p>

            <p className="font-medium text-[var(--heading)]">
              {departure.date}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-light)]">Time</p>

            <p className="font-medium text-[var(--heading)]">
              {departure.time}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-light)]">Seats</p>

            <p className="font-medium text-[var(--heading)]">
              {ride.availableSeats}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-light)]">Price</p>

            <p className="font-semibold text-[var(--primary)]">
              ₹{ride.pricePerSeat.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {ride.status === 'SCHEDULED' && (
          <button
            type="button"
            disabled={loading}
            onClick={handleCompleteRide}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2.5 text-sm font-semibold transition-colors"
          >
            {loading ? 'Completing...' : 'Complete Ride'}
          </button>
        )}

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-2 text-sm font-medium"
        >
          Bookings
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="mt-4">
            <RideBookingsPanel rideId={ride.id} />
          </div>
        )}
      </div>
    );
  }

  /* ---------------- DESKTOP ---------------- */

  return (
    <>
      <tr className="border-b border-[var(--border)] transition-colors hover:bg-gray-50">
        {/* Route */}

        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)]">
              <Car size={16} className="text-[var(--primary)]" />
            </div>

            <div>
              <div className="flex items-center gap-2 font-semibold text-[var(--heading)]">
                <span>{ride.sourceCity}</span>

                <ArrowRight size={13} />

                <span>{ride.destinationCity}</span>
              </div>

              <p className="text-sm text-[var(--text-light)]">
                Ride #{ride.id}
              </p>
            </div>
          </div>
        </td>

        {/* Date */}

        <td className="px-6 py-4">
          <p className="font-medium text-[var(--heading)]">{departure.date}</p>

          <p className="text-sm text-[var(--text-light)]">
            {departure.day} · {departure.time}
          </p>
        </td>

        {/* Seats */}

        <td className="px-6 py-4">
          <span className="flex items-center gap-1">
            <Users size={14} />

            {ride.availableSeats}
          </span>
        </td>

        {/* Price */}

        <td className="px-6 py-4 font-semibold text-[var(--primary)]">
          ₹{ride.pricePerSeat.toLocaleString('en-IN')}
        </td>

        {/* Status */}

        <td className="px-6 py-4">
          <span
            className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text} `}
          >
            <StatusIcon size={12} />

            {status.label}
          </span>
        </td>

        {/* Bookings */}

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end items-center gap-2">
            {ride.status === 'SCHEDULED' && (
              <button
                type="button"
                disabled={loading}
                onClick={handleCompleteRide}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 text-sm font-semibold transition-colors"
              >
                {loading ? 'Completing...' : 'Complete Ride'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium transition-all hover:border-[var(--primary)]"
            >
              Bookings
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} className="bg-gray-50 px-6 py-5">
            <RideBookingsPanel rideId={ride.id} />
          </td>
        </tr>
      )}
    </>
  );
}

const MyRideRow = memo(MyRideRowComponent);

export default MyRideRow;
