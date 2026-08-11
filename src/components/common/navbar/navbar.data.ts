export const navLinks = [
  {
    label: 'Find Ride',
    href: '/dashboard/rides',
  },
  {
    label: 'Offer Ride',
    href: '/dashboard/rides/publish',
  },
  {
    label: 'Safety',
    href: '/safety',
  },
  {
    label: 'About Us',
    href: '/about',
  },
  {
    label: 'Contact Us',
    href: '/contactUs',
  },
];

type NavRole = 'ROLE_PASSENGER' | 'ROLE_RIDER' | 'ROLE_ADMIN' | undefined;

/**
 * Role-gates the ride-action links in the navbar:
 *  - Guests (not logged in) see both "Find Ride" and "Offer Ride".
 *  - Passengers see only "Find Ride".
 *  - Riders see only "Offer Ride".
 *  - Admins see neither (they're not a passenger or rider).
 *  - All other links (Safety, About, Contact) are always visible.
 */
export function getVisibleNavLinks(role: NavRole) {
  return navLinks.filter((item) => {
    if (item.href === '/dashboard/rides') {
      return !role || role === 'ROLE_PASSENGER';
    }
    if (item.href === '/dashboard/rides/publish') {
      return !role || role === 'ROLE_RIDER';
    }
    return true;
  });
}