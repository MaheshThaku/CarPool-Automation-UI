'use client';

import Link from 'next/link';

import { useRideActions } from '@/hooks/useRideActions';

/**
 * The "Product" footer column. Find Ride / Offer Ride navigate like the home
 * hero (role-aware) instead of going straight to the marketing pages.
 */
export default function FooterProductLinks() {
  const { handleFindRide, handleOfferRide } = useRideActions();

  const linkClasses =
    'text-[var(--text)] transition-colors duration-300 hover:text-[var(--primary)]';

  return (
    <div>
      <h4 className="mb-5 text-lg font-semibold text-[var(--heading)]">
        Product
      </h4>

      <ul className="space-y-3">
        <li>
          <button type="button" onClick={handleFindRide} className={`cursor-pointer ${linkClasses}`}>
            Find Ride
          </button>
        </li>
        <li>
          <button type="button" onClick={handleOfferRide} className={`cursor-pointer ${linkClasses}`}>
            Offer Ride
          </button>
        </li>
        <li>
          <Link href="/safety" className={linkClasses}>
            Safety
          </Link>
        </li>
      </ul>
    </div>
  );
}
