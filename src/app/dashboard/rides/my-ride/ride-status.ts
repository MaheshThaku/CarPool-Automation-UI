import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

import {
  RideStatus,
  BookingStatus,
} from '@/types/ride.types';

export function getRideStatusConfig(
  status: RideStatus,
) {
  switch (status) {
    case 'SCHEDULED':
      return {
        label: 'Scheduled',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: Clock,
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: CheckCircle,
      };

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        bg: 'bg-red-50',
        text: 'text-red-600',
        icon: XCircle,
      };

    default:
      return {
        label: status,
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: AlertCircle,
      };
  }
}

export function getBookingStatusConfig(
  status: BookingStatus,
) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
      };

    case 'APPROVED':
      return {
        label: 'Approved',
        bg: 'bg-green-50',
        text: 'text-green-700',
      };

    case 'REJECTED':
      return {
        label: 'Rejected',
        bg: 'bg-red-50',
        text: 'text-red-600',
      };

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        bg: 'bg-gray-100',
        text: 'text-gray-600',
      };

    case 'COMPLETED':
      return {
        label: 'Cancelled',
        bg: 'bg-gray-100',
        text: 'text-gray-600',
      };

    default:
      return {
        label: status,
        bg: 'bg-gray-100',
        text: 'text-gray-600',
      };
  }
}