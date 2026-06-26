"use client";

import { useState } from "react";
import { Car, Pencil, Trash2, Plus, Star } from "lucide-react";

import { useAsyncData, invalidateAsyncCache } from "@/hooks/useAsyncData";
import { vehicleService } from "@/services/vehicle.service";
import { VehicleResponse } from "@/types/vehicle.types";

import VehicleFormModal from "./_components/VehicleFormModal";
import DeleteVehicleDialog from "./_components/DeleteVehicleDialog";

const VEHICLES_CACHE_KEY = "my-vehicles";
const MAX_VEHICLES = 10;

// The rider's first-added vehicle (lowest id) is treated as their default —
// it's what Offer Ride pre-selects so a rider never has to choose a vehicle
// just to publish a ride. There's no backend field for this; it's derived.
function defaultVehicleId(vehicles: VehicleResponse[]): number | null {
  if (vehicles.length === 0) return null;
  return vehicles.reduce((min, v) => (v.id < min ? v.id : min), vehicles[0].id);
}

export default function ManageVehiclesPage() {
  const vehicles$ = useAsyncData(() => vehicleService.getMyVehicles(), [], { cacheKey: VEHICLES_CACHE_KEY });

  // Local mirror of the fetched list that we patch directly after each
  // add/edit/delete using the mutation's own response, instead of firing a
  // second GET to reload the whole collection. Re-sync it whenever the
  // underlying fetch produces a new array (initial load, retry, or another
  // tab/page invalidating the shared cache).
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [syncedSource, setSyncedSource] = useState<VehicleResponse[] | null>(null);
  if (vehicles$.data && vehicles$.data !== syncedSource) {
    setSyncedSource(vehicles$.data);
    setVehicles(vehicles$.data);
  }

  const [formTarget, setFormTarget] = useState<VehicleResponse | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<VehicleResponse | null>(null);

  const atLimit = vehicles.length >= MAX_VEHICLES;
  const defaultId = defaultVehicleId(vehicles);

  // Other pages (Offer Ride) cache this same list under the same key — drop
  // their cached copy so their next visit reflects this change. We don't
  // refetch it ourselves here: the mutation's response is already the
  // authoritative result, so updating local state directly avoids a
  // redundant network round-trip on every single add/edit/delete.
  const handleSaved = (vehicle: VehicleResponse) => {
    invalidateAsyncCache(VEHICLES_CACHE_KEY);
    setVehicles((prev) => {
      const exists = prev.some((v) => v.id === vehicle.id);
      return exists ? prev.map((v) => (v.id === vehicle.id ? vehicle : v)) : [...prev, vehicle];
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--heading)]">Manage Vehicles</h2>
          <p className="mt-1 text-sm text-[var(--text)]">
            Add and manage the vehicles you drive for rides.
          </p>
        </div>
        {!atLimit && (
          <button
            onClick={() => setFormTarget("new")}
            className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            <Plus size={16} /> Add Vehicle
          </button>
        )}
      </div>

      {atLimit && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You&apos;ve reached the {MAX_VEHICLES}-vehicle limit. Remove a vehicle to add another.
        </div>
      )}

      {vehicles$.loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : vehicles$.error ? (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-center text-sm text-red-600">
          {vehicles$.error}
          <button onClick={vehicles$.refetch} className="ml-2 font-medium underline">
            Retry
          </button>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[var(--border)] bg-white p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Car size={26} className="text-gray-400" />
          </div>
          <h3 className="mt-4 font-semibold text-[var(--heading)]">No vehicles yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-[var(--text-light)]">
            Add a vehicle to start offering rides — passengers will see this when they book with you.
          </p>
          <button
            onClick={() => setFormTarget("new")}
            className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50 text-xs font-medium uppercase tracking-wide text-[var(--text-light)]">
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Registration No.</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Color</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50/60">
                  <td className="flex items-center gap-2.5 px-5 py-3.5 font-medium text-[var(--heading)]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                      <Car size={14} className="text-[var(--primary)]" />
                    </div>
                    {v.model}
                    {v.id === defaultId && (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                        <Star size={10} /> Default
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text)]">{v.registrationNumber}</td>
                  <td className="px-5 py-3.5 text-[var(--text)]">
                    {v.vehicleType.charAt(0) + v.vehicleType.slice(1).toLowerCase()}
                  </td>
                  <td className="px-5 py-3.5 text-[var(--text)]">{v.color}</td>
                  <td className="px-5 py-3.5 text-[var(--text)]">{v.yearOfManufacture}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setFormTarget(v)}
                        className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(v)}
                        className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-red-500 hover:border-red-400 hover:bg-red-50"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formTarget !== null && (
        <VehicleFormModal
          vehicle={formTarget === "new" ? null : formTarget}
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
    </div>
  );
}
