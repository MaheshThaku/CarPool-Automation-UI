'use client';

import { memo, useState } from 'react';

import { ArrowRight, Car, ChevronDown, ChevronUp, Users } from 'lucide-react';

import { RideResponse, RideStatus } from '@/types/ride.types';
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

  const isTerminal = ride.status === 'COMPLETED' || ride.status === 'CANCELLED';

  const handleStatusChange = async (newStatus: RideStatus) => {
    if (newStatus === ride.status) return;

    let confirmed = false;
    if (newStatus === 'STARTED') {
      confirmed = window.confirm(
        'Are you sure you want to start this ride? This will notify all passengers.'
      );
    } else if (newStatus === 'COMPLETED') {
      confirmed = window.confirm(
        'Are you sure you want to mark this ride as completed? This will complete all approved bookings.'
      );
    } else if (newStatus === 'CANCELLED') {
      confirmed = window.confirm(
        'Are you sure you want to cancel this ride? This will cancel all bookings.'
      );
    } else {
      confirmed = true;
    }

    if (!confirmed) return;

    try {
      setLoading(true);
      await rideService.updateRideStatus(ride.id, newStatus);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update ride status');
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

        {!isTerminal && (
          <div className="mt-4">
            <label className="text-xs text-[var(--text-light)] block mb-1">Update Status</label>
            <div className="relative w-full">
              <select
                disabled={loading}
                value={ride.status}
                onChange={(e) => handleStatusChange(e.target.value as RideStatus)}
                className={`w-full appearance-none rounded-xl border px-3 py-2 pr-8 text-sm font-semibold focus:outline-none transition-all cursor-pointer ${
                  ride.status === 'STARTED'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                {ride.status === 'SCHEDULED' && (
                  <>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="STARTED">Start Ride</option>
                    <option value="CANCELLED">Cancel Ride</option>
                  </>
                )}
                {ride.status === 'STARTED' && (
                  <>
                    <option value="STARTED">Started</option>
                    <option value="COMPLETED">Complete Ride</option>
                    <option value="CANCELLED">Cancel Ride</option>
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-2 text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)]"
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
          {isTerminal ? (
            <span
              className={`flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text} `}
            >
              <StatusIcon size={12} />

              {status.label}
            </span>
          ) : (
            <div className="relative inline-block w-36">
              <select
                disabled={loading}
                value={ride.status}
                onChange={(e) => handleStatusChange(e.target.value as RideStatus)}
                className={`w-full appearance-none rounded-xl border px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none transition-all cursor-pointer ${
                  ride.status === 'STARTED'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                {ride.status === 'SCHEDULED' && (
                  <>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="STARTED">Start Ride</option>
                    <option value="CANCELLED">Cancel Ride</option>
                  </>
                )}
                {ride.status === 'STARTED' && (
                  <>
                    <option value="STARTED">Started</option>
                    <option value="COMPLETED">Complete Ride</option>
                    <option value="CANCELLED">Cancel Ride</option>
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown size={12} />
              </div>
            </div>
          )}
        </td>

        {/* Bookings */}

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
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
