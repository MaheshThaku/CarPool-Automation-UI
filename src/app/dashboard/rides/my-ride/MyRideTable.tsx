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
}

function MyRideTableComponent({
  rides,
  page,
  totalPages,
  totalElements,
  onPageChange,
}: Props) {
  if (!rides.length) {
    return null;
  }

  const startRecord = totalElements ? (page - 1) * rides.length + 1 : 1;

  const endRecord = totalElements
    ? startRecord + rides.length - 1
    : rides.length;

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white">
      {/* Header */}

      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--text-light)]">
            Showing {startRecord}-{endRecord}
            {totalElements ? ` of ${totalElements}` : ''}
          </p>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {/* Desktop */}

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
            {rides.map((ride) => (
              <MyRideRow key={ride.id} ride={ride} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}

      <div className="space-y-4 p-4 lg:hidden">
        {rides.map((ride) => (
          <MyRideRow key={ride.id} ride={ride} mobile />
        ))}
      </div>
    </section>
  );
}

const MyRideTable = memo(MyRideTableComponent);

export default MyRideTable;
