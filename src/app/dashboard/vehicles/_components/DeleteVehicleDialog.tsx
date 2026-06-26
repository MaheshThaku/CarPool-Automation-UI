"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { vehicleService } from "@/services/vehicle.service";
import { ApiError } from "@/types/auth.types";
import { VehicleResponse } from "@/types/vehicle.types";

interface DeleteVehicleDialogProps {
  vehicle: VehicleResponse;
  onClose: () => void;
  onDeleted: (id: number) => void;
}

export default function DeleteVehicleDialog({ vehicle, onClose, onDeleted }: DeleteVehicleDialogProps) {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await vehicleService.deleteVehicle(vehicle.id);
      onDeleted(vehicle.id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete vehicle. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-[var(--heading)]">Remove this vehicle?</h2>
        <p className="mt-1.5 text-sm text-[var(--text-light)]">
          <span className="font-medium text-[var(--heading)]">
            {vehicle.model} — {vehicle.registrationNumber}
          </span>{" "}
          will be removed from your account. This can&apos;t be undone.
        </p>

        {error && <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--text)] hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {deleting ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
