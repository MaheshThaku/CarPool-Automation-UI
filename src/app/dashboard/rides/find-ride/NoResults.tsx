'use client';

import { SearchX } from 'lucide-react';

export default function NoResults() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]">
        <SearchX size={28} className="text-[var(--primary)]" />
      </div>

      <h3 className="mt-5 text-xl font-bold text-[var(--heading)]">
        No Rides Found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-light)]">
        We couldn&apos;t find any rides matching your search criteria. Try
        changing your route, date, or required seats.
      </p>
    </div>
  );
}
