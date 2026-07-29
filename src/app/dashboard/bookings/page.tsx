'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { BookingStatus } from '@/types/dashboard.types';

import { useBookings } from './_hooks/useBookings';
import BookingCard from './_components/BookingCard';
import BookingFilters from './_components/BookingFilters';
import BookingSkeleton from './_components/BookingSkeleton';
import EmptyBookings from './_components/EmptyBookings';
import Pagination from '../rides/my-ride/Pagination';

export default function MyBookingsPage() {
  const {
    bookings,
    loading,
    page,
    setPage,
    activeTab,
    setActiveTab,
    totalPages,
    totalElements,
    counts,
  } = useBookings();
  console.log(counts)
  const [search, setSearch] = useState('');

  const all = bookings;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return all;
    }

    return all.filter(
      (booking) =>
        booking.sourceCity.toLowerCase().includes(query) ||
        booking.destinationCity.toLowerCase().includes(query) ||
        booking.driverName.toLowerCase().includes(query),
    );
  }, [all, search]);



  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--heading)]">
            My Bookings
          </h2>

          <p className="mt-1 text-sm text-[var(--text)]">
            {loading
              ? 'Loading your bookings…'
              : `${totalElements} booking${totalElements !== 1 ? 's' : ''} total`}
          </p>
        </div>

        <Link
          href="/dashboard/rides"
          className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
        >
          <Search size={15} />
          Find a Ride
        </Link>
      </div>

      {/* Filters */}

      <BookingFilters
        activeTab={activeTab}
        search={search}
        total={counts?.total ?? 0}
        approved={counts?.approved ?? 0}
        pending={counts?.pending ?? 0}
        completed={counts?.completed ?? 0}
        rejected={counts?.rejected ?? 0}
        cancelled={counts?.cancelled ?? 0}
        upcoming={counts?.upcoming ?? 0}
        onTabChange={setActiveTab}
        onSearchChange={setSearch}
      />

      {/* List */}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <BookingSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyBookings filtered={activeTab !== 'ALL' || search.length > 0} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
