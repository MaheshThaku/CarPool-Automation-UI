import Link from 'next/link';
import { ArrowRight, Car } from 'lucide-react';

export default function HeroActions() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      {/* Primary CTA */}

      <Link
        href="/find-ride"
        className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-8 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)] hover:shadow-xl sm:w-auto"
      >
        Find a Ride
        <ArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>

      {/* Secondary CTA */}

      <Link
        href="/offer-ride"
        className="group flex h-14 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-8 text-base font-semibold text-[var(--heading)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-white hover:shadow-lg sm:w-auto"
      >
        <Car
          size={18}
          className="text-[var(--primary)] transition-transform duration-300 group-hover:rotate-6"
        />
        Offer a Ride
      </Link>
    </div>
  );
}
