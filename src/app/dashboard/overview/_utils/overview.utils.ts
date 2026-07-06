// app/dashboard/overview/_utils/overview.utils.ts

import { CurrentUser } from '@/hooks/useCurrentUser';
import { DocStatus } from '@/types/dashboard.types';

export function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  }

  if (hour < 17) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
}

export function formatDisplayName(
  user: CurrentUser,
): string {
  if (
    user.firstName &&
    user.firstName !== user.email.split('@')[0]
  ) {
    return user.firstName;
  }

  const prefix = user.email.split('@')[0];

  return (
    prefix.charAt(0).toUpperCase() +
    prefix.slice(1)
  );
}

export function parseDeparture(
  iso: string,
) {
  try {
    const date = new Date(iso);

    return {
      date: date.getDate(),

      month: date.toLocaleString('en-IN', {
        month: 'short',
      }),

      day: date.toLocaleString('en-IN', {
        weekday: 'short',
      }),

      time: date
        .toLocaleString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .toUpperCase(),
    };
  } catch {
    return {
      date: '--',
      month: '---',
      day: '---',
      time: '--:--',
    };
  }
}

export function getDocumentStatus(
  status: DocStatus,
) {
  switch (status) {
    case 'VERIFIED':
      return {
        label: 'Verified',
        color: 'text-green-600',
      };

    case 'PENDING':
      return {
        label: 'Pending',
        color: 'text-amber-500',
      };

    case 'REJECTED':
      return {
        label: 'Rejected',
        color: 'text-red-500',
      };

    default:
      return {
        label: 'Not Provided',
        color: 'text-amber-500',
      };
  }
}

export function calculatePercentage(
  current: number,
  total: number,
): number {
  if (!total) {
    return 0;
  }

  return Math.round(
    (current / total) * 100,
  );
}