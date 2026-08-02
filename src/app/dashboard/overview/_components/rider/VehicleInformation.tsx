'use client';

import Link from 'next/link';
import { memo } from 'react';

import { Car, Hash, Palette, Calendar, Plus } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';

interface Vehicle {
  id: number;
  model: string;
  registrationNumber: string;
  color?: string;
  vehicleType?: string;
  yearOfManufacture?: number;
}

interface Props {
  vehicles: Vehicle[];
}

function formatVehicleType(type?: string) {
  if (!type) return '--';

  return type
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function VehicleInformationComponent({ vehicles }: Props) {
  const hasVehicles = vehicles.length > 0;
  const displayedVehicles = vehicles.slice(0, 3);

  return (
    <DashboardCard className="flex h-full min-h-[420px] flex-col">
      {/* Header */}

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            Vehicle Information
          </h3>

          <p className="mt-1 text-sm text-[var(--text-light)]">
            Vehicles linked to your rider profile
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/vehicles"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            Edit
          </Link>

          <Link
            href="/dashboard/vehicles"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            <Plus size={15} />
            Add Vehicle
          </Link>
        </div>
      </div>

      {/* Empty State */}

      {!hasVehicles ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--primary-light)]/20 px-6 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
            <Car size={28} className="text-[var(--primary)]" />
          </div>

          <h4 className="mt-4 text-lg font-semibold text-[var(--heading)]">
            No Vehicle Added
          </h4>

          <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--text-light)]">
            Add a vehicle to start publishing rides and accepting bookings.
          </p>

          <Link
            href="/dashboard/vehicles"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            <Plus size={16} />
            Add Vehicle
          </Link>
        </div>
      ) : (
        /* Vehicle List */
        <div className="flex-1 space-y-3">
          {displayedVehicles.map((vehicle) => (
            <div
              key={`${vehicle.id}-${vehicle.registrationNumber}`}
              className="rounded-2xl border border-[var(--border)] bg-white p-4 transition-all duration-200 hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/10"
            >
              <div className="flex gap-4">
                {/* Icon */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)]">
                  <Car size={20} className="text-[var(--primary)]" />
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <h4 className="truncate text-base font-semibold text-[var(--heading)]">
                      {vehicle.model || 'Unknown Vehicle'}
                    </h4>

                    <span className="w-fit rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-medium text-[var(--primary)]">
                      {formatVehicleType(vehicle.vehicleType)}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                    <div className="flex items-center gap-2 text-[var(--text)]">
                      <Hash size={14} className="text-[var(--primary)]" />

                      <span className="truncate">
                        {vehicle.registrationNumber || '--'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[var(--text)]">
                      <Palette size={14} className="text-[var(--primary)]" />

                      <span>{vehicle.color || '--'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[var(--text)]">
                      <Calendar size={14} className="text-[var(--primary)]" />

                      <span>{vehicle.yearOfManufacture || '--'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

const VehicleInformation = memo(VehicleInformationComponent);

export default VehicleInformation;
