'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/useCurrentUser';

/**
 * Role-aware navigation for the "Find Ride" / "Offer Ride" CTAs (home hero and
 * footer). Unauthenticated users go to login; the matching role goes to its
 * dashboard page; the wrong role gets an error toast.
 */
export function useRideActions() {
  const router = useRouter();
  const user = useCurrentUser();

  const handleFindRide = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role === 'ROLE_PASSENGER') {
      router.push('/dashboard/rides');
      return;
    }
    toast.error("You don't have permission to access this resource.");
  };

  const handleOfferRide = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role === 'ROLE_RIDER') {
      router.push('/dashboard/rides/publish');
      return;
    }
    toast.error("You don't have permission to access this resource.");
  };

  return { handleFindRide, handleOfferRide };
}
