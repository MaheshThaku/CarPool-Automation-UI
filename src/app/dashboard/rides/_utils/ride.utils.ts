import {
  RideStatus,
  BookingStatus,
} from '@/types/ride.types';

export function formatDeparture(
  departureTime?: string,
): {
  date: string;
  time: string;
} {
  if (!departureTime) {
    return {
      date: '—',
      time: '—',
    };
  }

  const date = new Date(departureTime);

  return {
    date: date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),

    time: date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

export function formatCurrency(
  amount?: number,
): string {
  if (!amount || amount <= 0) {
    return '₹0';
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Short human label relative to today ("Today", "Tomorrow", "in 3 days").
 * Returns null for dates further out (or invalid) — the absolute date is
 * shown alongside, so this is only a friendly accent.
 */
export function getDepartureLabel(
  departureTime?: string,
): string | null {
  if (!departureTime) {
    return null;
  }

  const date = new Date(departureTime);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const startOfDeparture = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffDays = Math.round(
    (startOfDeparture.getTime() - startOfToday.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return 'Today';

  if (diffDays === 1) return 'Tomorrow';

  if (diffDays > 1 && diffDays <= 7) return `in ${diffDays} days`;

  return null;
}

export function rideStatusConfig(
  status: RideStatus,
) {
  switch (status) {
    case 'COMPLETED':
      return {
        label: 'Completed',
        className:
          'bg-green-50 text-green-700 border-green-200',
      };

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        className:
          'bg-red-50 text-red-700 border-red-200',
      };

    default:
      return {
        label: 'Scheduled',
        className:
          'bg-blue-50 text-blue-700 border-blue-200',
      };
  }
}

export function bookingStatusConfig(
  status: BookingStatus,
) {
  switch (status) {
    case 'APPROVED':
      return {
        label: 'Approved',
        className:
          'bg-green-50 text-green-700 border-green-200',
      };

    case 'REJECTED':
      return {
        label: 'Rejected',
        className:
          'bg-red-50 text-red-700 border-red-200',
      };

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        className:
          'bg-gray-50 text-gray-700 border-gray-200',
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        className:
          'bg-blue-50 text-blue-700 border-blue-200',
      };

    default:
      return {
        label: 'Pending',
        className:
          'bg-amber-50 text-amber-700 border-amber-200',
      };
  }
}

export function getPassengerName(
  passengerName?: string,
): string {
  return passengerName?.trim() || 'Unknown Passenger';
}