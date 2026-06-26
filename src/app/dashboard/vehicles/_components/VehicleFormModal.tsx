"use client";

import { useState } from "react";
import { Car, Palette, Hash, Calendar, X } from "lucide-react";

import { vehicleService } from "@/services/vehicle.service";
import { ApiError } from "@/types/auth.types";
import { VEHICLE_TYPES, VehicleRequest, VehicleResponse } from "@/types/vehicle.types";

interface VehicleFormState {
  model: string;
  registrationNumber: string;
  color: string;
  vehicleType: string;
  yearOfManufacture: string;
}

const MIN_VEHICLE_YEAR = 2000;

const VEHICLE_REG_NO_REGEX =
  /^[A-Z]{2}[ -]?[0-9]{1,2}[ -]?[A-Z]{1,3}[ -]?[0-9]{4}$|^[0-9]{2}[ -]?BH[ -]?[0-9]{4}[ -]?[A-Z]{1,2}$/;

function formFromVehicle(v: VehicleResponse | null): VehicleFormState {
  if (!v) {
    return { model: "", registrationNumber: "", color: "", vehicleType: "SEDAN", yearOfManufacture: "" };
  }
  return {
    model: v.model,
    registrationNumber: v.registrationNumber,
    color: v.color,
    vehicleType: v.vehicleType,
    yearOfManufacture: String(v.yearOfManufacture),
  };
}

interface VehicleFormModalProps {
  /** null = "add new vehicle" mode, otherwise the vehicle being edited. */
  vehicle: VehicleResponse | null;
  onClose: () => void;
  onSaved: (vehicle: VehicleResponse) => void;
}

const inputCls =
  "w-full rounded-xl border border-[var(--border)] bg-white py-2.5 pl-9 pr-3 text-sm text-[var(--heading)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

export default function VehicleFormModal({ vehicle, onClose, onSaved }: VehicleFormModalProps) {
  const [form, setForm] = useState<VehicleFormState>(formFromVehicle(vehicle));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = vehicle !== null;
  const currentYear = new Date().getFullYear();

  const handleChange = (name: keyof VehicleFormState, val: string) =>
    setForm((prev) => ({ ...prev, [name]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const year = Number(form.yearOfManufacture);
    const registrationNumber = form.registrationNumber.trim().toUpperCase();

    if (!form.model.trim() || !registrationNumber || !form.color.trim()) {
      setError("Model, registration number, and color are required.");
      return;
    }
    if (!Number.isInteger(year) || year < MIN_VEHICLE_YEAR || year > currentYear) {
      setError(`Please enter a valid year between ${MIN_VEHICLE_YEAR} and ${currentYear}.`);
      return;
    }
    if (!VEHICLE_REG_NO_REGEX.test(registrationNumber)) {
      setError("Enter a valid registration number, e.g. DL 01 AB 1234 or 22 BH 1234 AB.");
      return;
    }

    const payload: VehicleRequest = {
      model: form.model.trim(),
      registrationNumber,
      color: form.color.trim(),
      vehicleType: form.vehicleType,
      yearOfManufacture: year,
    };

    setSaving(true);
    setError("");
    try {
      const result = isEdit
        ? await vehicleService.updateVehicle(vehicle!.id, payload)
        : await vehicleService.addVehicle(payload);
      onSaved(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save vehicle. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--heading)]">
            {isEdit ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-light)] hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-light)]">Vehicle Model</label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Car size={15} className="text-[var(--text-light)]" />
              </div>
              <input
                value={form.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="e.g. Maruti Swift"
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-light)]">Registration Number</label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Hash size={15} className="text-[var(--text-light)]" />
              </div>
              <input
                value={form.registrationNumber}
                onChange={(e) => handleChange("registrationNumber", e.target.value.toUpperCase())}
                placeholder="e.g. DL 01 AB 1234"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-light)]">Color</label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <Palette size={15} className="text-[var(--text-light)]" />
                </div>
                <input
                  value={form.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  placeholder="e.g. White"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-light)]">Year</label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <Calendar size={15} className="text-[var(--text-light)]" />
                </div>
                <input
                  type="number"
                  min={MIN_VEHICLE_YEAR}
                  max={currentYear}
                  value={form.yearOfManufacture}
                  onChange={(e) => handleChange("yearOfManufacture", e.target.value)}
                  placeholder={`e.g. ${currentYear}`}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-light)]">Vehicle Type</label>
            <select
              value={form.vehicleType}
              onChange={(e) => handleChange("vehicleType", e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-white py-2.5 px-3 text-sm text-[var(--heading)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--text)] hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[var(--primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
