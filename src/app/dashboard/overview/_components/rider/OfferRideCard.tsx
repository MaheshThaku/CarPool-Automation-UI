'use client';

import { memo } from 'react';

import { Car, Plus } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';
import { useRouter } from 'next/navigation';

function OfferRideCardComponent() {
  const router = useRouter();
  return (
    <DashboardCard className="relative overflow-hidden border-0 bg-gradient-to-r from-[#c97406] via-[#dd9727] to-[#f2bc53] p-0 text-white">
      {/* Background decoration */}

      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />

      <div className="absolute right-20 -bottom-8 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-8">
        {/* Left Content */}

        <div className="max-w-xl">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Car size={18} />
          </div>

          <h2 className="text-xl font-bold md:text-2xl">
            Offer a Ride. Share the Journey.
          </h2>

          <p className="mt-2 text-sm text-white/90">
            Publish your ride and earn while travelling.
          </p>

          <button
            onClick={() => router.push('/dashboard/rides/publish')}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white hover:text-[var(--primary)]"
          >
            <Plus size={15} />
            Offer Ride
          </button>
        </div>

        {/* Right Decoration */}

        <div className="hidden lg:flex">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <Car size={30} strokeWidth={1.8} className="text-white" />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

const OfferRideCard = memo(OfferRideCardComponent);

export default OfferRideCard;
