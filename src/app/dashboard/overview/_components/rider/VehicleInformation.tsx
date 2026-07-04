'use client';

import Link from 'next/link';
import { memo } from 'react';

import { Car, Hash, Plus, ArrowRight } from 'lucide-react';

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
  vehicle: Vehicle | null;
}

function VehicleInformationComponent({ vehicle }: Props) {
  const hasVehicle = !!vehicle;

  return (
    <DashboardCard className="h-full">
      <div className="flex h-full flex-col">
        {/* Header */}

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-[var(--heading)]">
            Vehicle Information
          </h3>

          <p className="mt-1 text-sm text-[var(--text-light)]">
            Vehicle available for ride publishing
          </p>
        </div>

        {!hasVehicle ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] px-6 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <Car size={24} className="text-gray-400" />
            </div>

            <h4 className="mt-4 text-base font-semibold text-[var(--heading)]">
              No Vehicle Added
            </h4>

            <p className="mt-2 max-w-xs text-sm text-[var(--text-light)]">
              Add your vehicle before publishing rides.
            </p>

            <Link
              href="/dashboard/vehicles"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              <Plus size={15} />
              Add Vehicle
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
                <Car size={24} className="text-[var(--primary)]" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-lg font-semibold text-[var(--heading)]">
                  {vehicle.model}
                </h4>

                <div className="mt-2 flex flex-wrap gap-2">
                  {vehicle.vehicleType && (
                    <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-medium text-[var(--primary)]">
                      {vehicle.vehicleType}
                    </span>
                  )}

                  {vehicle.color && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {vehicle.color}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-light)]">
                  <Hash size={14} />
                  {vehicle.registrationNumber}
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <Link
                href="/dashboard/vehicles"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                Manage Vehicles
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

const VehicleInformation = memo(VehicleInformationComponent);

export default VehicleInformation;
