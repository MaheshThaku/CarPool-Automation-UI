'use client';

import { memo } from 'react';

import { RideResponse } from '@/types/ride.types';

import MyRideRow from './MyRideRow';
import Pagination from './Pagination';

interface Props {
  rides: RideResponse[];
  page: number;
  totalPages: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
}

function MyRideTableComponent({
  rides,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onRefresh,
}: Props) {
  if (!rides.length) {
    return null;
  }

  const startRecord = totalElements ? (page - 1) * rides.length + 1 : 1;
  const endRecord = totalElements ? startRecord + rides.length - 1 : rides.length;

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
      {/* Table meta-bar: record count + pagination */}
      <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-gray-50/60 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-[var(--text-light)]">
          Showing{' '}
          <span className="font-semibold text-[var(--heading)]">
            {startRecord}–{endRecord}
          </span>
          {totalElements ? (
            <>
              {' '}of{' '}
              <span className="font-semibold text-[var(--heading)]">{totalElements}</span>
            </>
          ) : null}
        </p>
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50/80">
              {/* Route */}
              <th className="border-b border-[var(--border)] px-6 py-3.5 text-left text-[10px] font-bold tracking-widest text-[var(--text-light)] uppercase">
                Route
              </th>
              {/* Date & Time */}
              <th className="border-b border-[var(--border)] px-6 py-3.5 text-left text-[10px] font-bold tracking-widest text-[var(--text-light)] uppercase">
                Date &amp; Time
              </th>
              {/* Seats Left */}
              <th className="border-b border-[var(--border)] px-6 py-3.5 text-left text-[10px] font-bold tracking-widest text-[var(--text-light)] uppercase">
                Seats Left
              </th>
              {/* Price / Seat */}
              <th className="border-b border-[var(--border)] px-6 py-3.5 text-left text-[10px] font-bold tracking-widest text-[var(--text-light)] uppercase">
                Price / Seat
              </th>
              {/* Status */}
              <th className="border-b border-[var(--border)] px-6 py-3.5 text-left text-[10px] font-bold tracking-widest text-[var(--text-light)] uppercase">
                Status
              </th>
              {/* Bookings — centred to match the button in each row */}
              <th className="w-48 border-b border-[var(--border)] px-6 py-3.5 text-center text-[10px] font-bold tracking-widest text-[var(--text-light)] uppercase">
                Bookings
              </th>
            </tr>
          </thead>

          <tbody>
            {rides.map((ride) => (
              <MyRideRow key={ride.id} ride={ride} onRefresh={onRefresh} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 p-4 lg:hidden">
        {rides.map((ride) => (
          <MyRideRow key={ride.id} ride={ride} mobile onRefresh={onRefresh} />
        ))}
      </div>
    </section>
  );
}

const MyRideTable = memo(MyRideTableComponent);

export default MyRideTable;
