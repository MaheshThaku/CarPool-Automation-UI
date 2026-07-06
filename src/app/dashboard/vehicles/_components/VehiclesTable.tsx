'use client';

import { memo } from 'react';

import { Car, Pencil, Trash2, Star } from 'lucide-react';

import { VehicleResponse } from '@/types/vehicle.types';

interface Props {
  vehicles: VehicleResponse[];
  defaultId: number | null;
  onEdit: (vehicle: VehicleResponse) => void;
  onDelete: (vehicle: VehicleResponse) => void;
}

function formatVehicleType(type?: string) {
  if (!type) return '--';

  return type
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function VehiclesTableComponent({
  vehicles,
  defaultId,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      {/* Desktop Table */}

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-gray-50 text-xs font-medium tracking-wide text-[var(--text-light)] uppercase">
              <th className="px-5 py-3">Vehicle</th>

              <th className="px-5 py-3">Registration No.</th>

              <th className="px-5 py-3">Type</th>

              <th className="px-5 py-3">Color</th>

              <th className="px-5 py-3">Year</th>

              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={
                  vehicle.id ?? `${vehicle.registrationNumber}-${vehicle.model}`
                }
                className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50/60"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                      <Car size={16} className="text-[var(--primary)]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--heading)]">
                          {vehicle.model ?? '--'}
                        </span>

                        {vehicle.id === defaultId && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                            <Star size={10} />
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-[var(--text)]">
                  {vehicle.registrationNumber ?? '--'}
                </td>

                <td className="px-5 py-4 text-[var(--text)]">
                  {formatVehicleType(vehicle.vehicleType)}
                </td>

                <td className="px-5 py-4 text-[var(--text)]">
                  {vehicle.color ?? '--'}
                </td>

                <td className="px-5 py-4 text-[var(--text)]">
                  {vehicle.yearOfManufacture ?? '--'}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(vehicle)}
                      className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-400 hover:bg-red-50"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Cards */}

      <div className="divide-y divide-[var(--border)] lg:hidden">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id ?? `${vehicle.registrationNumber}-${vehicle.model}`}
            className="p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                  <Car size={16} className="text-[var(--primary)]" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-[var(--heading)]">
                      {vehicle.model ?? '--'}
                    </h4>

                    {vehicle.id === defaultId && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                        <Star size={10} />
                        Default
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-[var(--text-light)]">
                    {vehicle.registrationNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[var(--text-light)]">Type</p>

                <p className="font-medium text-[var(--heading)]">
                  {formatVehicleType(vehicle.vehicleType)}
                </p>
              </div>

              <div>
                <p className="text-[var(--text-light)]">Color</p>

                <p className="font-medium text-[var(--heading)]">
                  {vehicle.color ?? '--'}
                </p>
              </div>

              <div>
                <p className="text-[var(--text-light)]">Year</p>

                <p className="font-medium text-[var(--heading)]">
                  {vehicle.yearOfManufacture ?? '--'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onEdit(vehicle)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <Pencil size={14} />
                Edit
              </button>

              <button
                onClick={() => onDelete(vehicle)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const VehiclesTable = memo(VehiclesTableComponent);

export default VehiclesTable;
