'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Car } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function HeroActions() {
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

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      {/* Primary CTA */}
      <button
        onClick={handleFindRide}
        className="group flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-8 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)] hover:shadow-xl sm:w-auto"
      >
        Find a Ride
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>

      {/* Secondary CTA */}
      <button
        onClick={handleOfferRide}
        className="group flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white/90 px-8 text-base font-semibold text-black shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-xl sm:w-auto"
      >
        <Car
          size={18}
          className="text-[var(--primary)] transition-transform duration-300 group-hover:rotate-6"
        />
        Offer a Ride
      </button>
    </div>
  );
}
