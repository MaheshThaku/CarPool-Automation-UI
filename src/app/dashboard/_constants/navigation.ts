import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  FileText,
  Search,
  BookOpen,
  User,
  Wrench,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

export const RIDER_NAV: NavItem[] = [
  {
    href: '/dashboard/overview',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/rides/publish',
    label: 'Offer Ride',
    icon: Car,
  },
  {
    href: '/dashboard/vehicles',
    label: 'Manage Vehicle',
    icon: Wrench,
  },
  {
    href: '/dashboard/rides',
    label: 'My Rides',
    icon: CalendarCheck,
  },
  {
    href: '/dashboard/documents',
    label: 'Documents',
    icon: FileText,
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
  },
];

export const PASSENGER_NAV: NavItem[] = [
  {
    href: '/dashboard/overview',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/rides',
    label: 'Find Rides',
    icon: Search,
  },
  {
    href: '/dashboard/bookings',
    label: 'My Bookings',
    icon: BookOpen,
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
  },
];