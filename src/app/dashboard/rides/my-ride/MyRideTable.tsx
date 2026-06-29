'use client';

import { memo, useMemo, useState } from 'react';

import { RideResponse } from '@/types/ride.types';

import MyRideRow from './MyRideRow';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 5;

interface Props {
  rides: RideResponse[];
}

function MyRideTableComponent({ rides }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rides.length / ITEMS_PER_PAGE));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const paginatedRides = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return rides.slice(start, start + ITEMS_PER_PAGE);
  }, [rides, currentPage]);

  if (rides.length === 0) {
    return null;
  }

  const startRecord = (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, rides.length);

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white">
      {/* Header */}

      {totalPages > 1 && (
        <div className="border-b border-[var(--border)] px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--text-light)]">
              Showing {startRecord}-{endRecord} of {rides.length} rides
            </p>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {/* Desktop Table */}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--text-light)] uppercase">
                Route
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--text-light)] uppercase">
                Date & Time
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--text-light)] uppercase">
                Seats Left
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--text-light)] uppercase">
                Price / Seat
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-[var(--text-light)] uppercase">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-[var(--text-light)] uppercase">
                Bookings
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedRides.map((ride) => (
              <MyRideRow key={ride.id} ride={ride} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}

      <div className="space-y-4 p-4 lg:hidden">
        {paginatedRides.map((ride) => (
          <MyRideRow key={ride.id} ride={ride} mobile />
        ))}
      </div>
    </section>
  );
}

const MyRideTable = memo(MyRideTableComponent);

export default MyRideTable;
