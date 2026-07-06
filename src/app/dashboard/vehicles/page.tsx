/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useMemo, useState } from 'react';

import { useAsyncData, invalidateAsyncCache } from '@/hooks/useAsyncData';
import { vehicleService } from '@/services/vehicle.service';
import { VehicleResponse } from '@/types/vehicle.types';

import VehicleFormModal from './_components/VehicleFormModal';
import DeleteVehicleDialog from './_components/DeleteVehicleDialog';
import VehicleInfoSection from './_components/VehicleInfoSection';

import VehiclesHeader from './_components/VehicleHeader';
import VehiclesTable from './_components/VehiclesTable';
import EmptyVehiclesState from './_components/EmptyVehicleState';

const VEHICLES_CACHE_KEY = 'my-vehicles';
const MAX_VEHICLES = 10;

export default function ManageVehiclesPage() {
  const vehicles$ = useAsyncData(() => vehicleService.getMyVehicles(), [], {
    cacheKey: VEHICLES_CACHE_KEY,
  });

  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);

  useEffect(() => {
    if (vehicles$.data) {
      setVehicles(vehicles$.data);
    }
  }, [vehicles$.data]);

  const [formTarget, setFormTarget] = useState<VehicleResponse | null | 'new'>(
    null,
  );

  const [deleteTarget, setDeleteTarget] = useState<VehicleResponse | null>(
    null,
  );

  const atLimit = vehicles.length >= MAX_VEHICLES;

  const defaultId = useMemo(() => {
    if (!vehicles.length) return null;

    return vehicles.reduce(
      (min, v) => (v.id < min ? v.id : min),
      vehicles[0].id,
    );
  }, [vehicles]);

  const handleSaved = async (vehicle: VehicleResponse) => {
    invalidateAsyncCache(VEHICLES_CACHE_KEY);

    if (!vehicle?.id) {
      await vehicles$.refetch?.();
      setFormTarget(null);
      return;
    }

    setVehicles((prev) => {
      const exists = prev.some((v) => v.id === vehicle.id);

      return exists
        ? prev.map((v) => (v.id === vehicle.id ? vehicle : v))
        : [...prev, vehicle];
    });

    setFormTarget(null);
  };

  const handleDeleted = (id: number) => {
    invalidateAsyncCache(VEHICLES_CACHE_KEY);

    setVehicles((prev) => prev.filter((v) => v.id !== id));

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <VehiclesHeader atLimit={atLimit} onAdd={() => setFormTarget('new')} />

      {vehicles$.loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : vehicles$.error ? (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-center text-sm text-red-600">
          {vehicles$.error}

          <button
            onClick={vehicles$.refetch}
            className="ml-2 font-medium underline"
          >
            Retry
          </button>
        </div>
      ) : vehicles.length === 0 ? (
        <EmptyVehiclesState onAdd={() => setFormTarget('new')} />
      ) : (
        <VehiclesTable
          vehicles={vehicles}
          defaultId={defaultId}
          onEdit={setFormTarget}
          onDelete={setDeleteTarget}
        />
      )}

      {formTarget !== null && (
        <VehicleFormModal
          vehicle={formTarget === 'new' ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteVehicleDialog
          vehicle={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      <VehicleInfoSection />
    </div>
  );
}
