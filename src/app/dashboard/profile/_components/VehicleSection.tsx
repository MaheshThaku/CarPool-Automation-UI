"use client";

import { useState } from "react";
import { Car } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import { vehicleService } from "@/services/vehicle.service";
import { ApiError } from "@/types/auth.types";
import { VEHICLE_TYPES, VehicleResponse } from "@/types/vehicle.types";
import Field from "./Field";
import SectionHeader from "./SectionHeader";
import SuccessBanner from "./SuccessBanner";
import SectionError from "./SectionError";
import Skeleton from "./Skeleton";

interface VehicleFormState {
  model: string;
  registrationNumber: string;
  color: string;
  vehicleType: string;
  yearOfManufacture: number | undefined;
}

const EMPTY_FORM: VehicleFormState = {
  model: "", registrationNumber: "", color: "", vehicleType: "SEDAN", yearOfManufacture: undefined,
};

function formFromVehicle(v: VehicleResponse | null): VehicleFormState {
  if (!v) return EMPTY_FORM;
  return {
    model: v.model,
    registrationNumber: v.registrationNumber,
    color: v.color,
    vehicleType: v.vehicleType,
    yearOfManufacture: v.yearOfManufacture,
  };
}

export default function VehicleSection() {
  const vehicles$ = useAsyncData(() => vehicleService.getMyVehicles());
  const vehicle = vehicles$.data?.[0] ?? null;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<VehicleFormState>(formFromVehicle(vehicle));

  // Re-sync the editable form whenever a fresh vehicle record arrives
  // (initial load or after refetch), compared during render rather than in
  // a useEffect.
  const [syncedVehicle, setSyncedVehicle] = useState(vehicle);
  if (vehicle !== syncedVehicle) {
    setSyncedVehicle(vehicle);
    setForm(formFromVehicle(vehicle));
  }

  const handleChange = (name: string, val: string) =>
    setForm((prev) => ({ ...prev, [name]: name === "yearOfManufacture" ? (val ? Number(val) : undefined) : val }));

  const handleCancel = () => { setForm(formFromVehicle(vehicle)); setEditing(false); setError(""); };

  const handleSave = async () => {
    if (!form.model.trim() || !form.registrationNumber.trim() || !form.color.trim()) {
      setError("Model, registration number, and color are required."); return;
    }
    if (!form.yearOfManufacture || form.yearOfManufacture < 1990) {
      setError("Please enter a valid year of manufacture (1990 or later)."); return;
    }
    setSaving(true); setError("");
    try {
      const payload = {
        model: form.model.trim(),
        registrationNumber: form.registrationNumber.trim(),
        color: form.color.trim(),
        vehicleType: form.vehicleType,
        yearOfManufacture: form.yearOfManufacture,
      };
      if (vehicle?.id) {
        await vehicleService.updateVehicle(vehicle.id, payload);
      } else {
        await vehicleService.addVehicle(payload);
      }
      vehicles$.refetch();
      setEditing(false);
      setSuccess("Vehicle details saved.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save vehicle. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (vehicles$.loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <SectionHeader
        title="Vehicle Information"
        subtitle="Details about your vehicle for passengers"
        editing={editing}
        saving={saving}
        onEdit={() => { setForm(formFromVehicle(vehicle)); setEditing(true); }}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {success && <div className="mt-4"><SuccessBanner message={success} onDismiss={() => setSuccess("")} /></div>}
      {error && <div className="mt-4"><SectionError message={error} /></div>}
      {vehicles$.error && !editing && <div className="mt-4"><SectionError message={vehicles$.error} onRetry={vehicles$.refetch} /></div>}

      {!vehicle && !editing ? (
        <div className="mt-6 flex flex-col items-center py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Car size={22} className="text-gray-400" />
          </div>
          <p className="mt-3 font-medium text-[var(--heading)]">No vehicle added yet</p>
          <p className="mt-1 text-sm text-[var(--text-light)]">Add your vehicle to start offering rides.</p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            Add Vehicle
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Vehicle Model" name="model" value={form.model} editing={editing} icon={Car} onChange={handleChange} />
          <Field label="Registration Number" name="registrationNumber" value={form.registrationNumber} editing={editing} icon={Car} onChange={handleChange} />
          <Field label="Color" name="color" value={form.color} editing={editing} onChange={handleChange} />
          <Field
            label="Vehicle Type" name="vehicleType" value={form.vehicleType} editing={editing} onChange={handleChange}
            options={VEHICLE_TYPES.map((t) => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }))}
          />
          <Field label="Year of Manufacture" name="yearOfManufacture" value={form.yearOfManufacture ? String(form.yearOfManufacture) : ""} editing={editing} onChange={handleChange} type="number" />
        </div>
      )}
    </div>
  );
}
