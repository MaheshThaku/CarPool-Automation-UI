// app/dashboard/overview/_constants/safety.constants.ts

import {
  ShieldCheck,
  UserCheck,
  BadgeCheck,
} from 'lucide-react';

export const SAFETY_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Verified Drivers',
    description:
      'Ride with verified community members.',
  },

  {
    icon: UserCheck,
    title: 'Trusted Profiles',
    description:
      'Identity verification increases trust.',
  },

  {
    icon: BadgeCheck,
    title: 'Secure Booking',
    description:
      'Bookings are protected and traceable.',
  },
] as const;