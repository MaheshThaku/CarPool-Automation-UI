'use client';

import Link from 'next/link';
import { Car, Plus } from 'lucide-react';

export default function EmptyRidesState() {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-white px-6 py-12 text-center">
      {/* Icon */}

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
        <Car size={28} className="text-[var(--primary)]" />
      </div>

      {/* Heading */}

      <h2 className="mt-5 text-2xl font-bold text-[var(--heading)]">
        No Rides Found
      </h2>

      {/* Description */}

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--text-light)]">
        You haven't published any rides yet. Start offering rides and connect
        with passengers travelling on the same route.
      </p>

      {/* CTA */}

      <Link
        href="/offer-ride"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--primary-hover)] hover:shadow-lg"
      >
        <Plus size={16} />
        Offer Your First Ride
      </Link>
    </section>
  );
}
