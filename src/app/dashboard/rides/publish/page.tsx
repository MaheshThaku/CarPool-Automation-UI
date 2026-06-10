"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import {
  MapPin, ArrowRight, Calendar, DollarSign,
  Users, CheckCircle, ChevronLeft, Car,
  Clock, AlertCircle, ArrowLeftRight, Minus, Plus,
} from "lucide-react";

import { rideService } from "@/services/ride.service";
import { RideResponse } from "@/types/ride.types";

/* =====================================================================
   Zod schema — mirrors the backend CreateRideRequest constraints:
   sourceCity / destinationCity: ≥ 1 char
   departureTime: must be in the future
   pricePerSeat: positive double
   totalSeats: int 1–8
===================================================================== */

const offerRideSchema = z.object({
  sourceCity: z.string().min(1, "Source city is required"),
  destinationCity: z.string().min(1, "Destination city is required"),
  departureDate: z.string().min(1, "Date is required"),
  departureTime: z.string().min(1, "Time is required"),
  pricePerSeat: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  totalSeats: z.number().int().min(1).max(8),
}).refine(
  (data) => {
    if (!data.departureDate || !data.departureTime) return true;
    return new Date(`${data.departureDate}T${data.departureTime}`) > new Date();
  },
  { message: "Departure must be in the future", path: ["departureDate"] }
).refine(
  (data) => data.sourceCity.toLowerCase() !== data.destinationCity.toLowerCase(),
  { message: "Source and destination can't be the same", path: ["destinationCity"] }
);

type FormValues = z.infer<typeof offerRideSchema>;

/* =====================================================================
   Utilities
===================================================================== */

function toIso(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString();
}

function formatDisplayDate(date: string, time: string) {
  if (!date || !time) return null;
  try {
    const d = new Date(`${date}T${time}`);
    return {
      date: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase(),
    };
  } catch { return null; }
}

function todayMin() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/* =====================================================================
   Sub-components
===================================================================== */

function InputField({
  label, required, icon: Icon, error, children,
}: {
  label: string; required?: boolean; icon?: React.ElementType;
  error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--heading)]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Icon size={16} className="text-[var(--text-light)]" />
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasIcon: boolean, error?: string) =>
  `w-full rounded-xl border ${error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]/20"} bg-white py-3 pr-4 text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none transition-all focus:ring-2 ${hasIcon ? "pl-10" : "pl-4"}`;

/* =====================================================================
   Seat Picker
===================================================================== */

function SeatPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[var(--heading)]">
        Total Seats <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--heading)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-95"
        >
          <Minus size={16} />
        </button>

        <div className="flex flex-1 items-center justify-center gap-1.5">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                n === value
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : n <= value
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "border border-[var(--border)] bg-white text-[var(--text-light)]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onChange(Math.min(8, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--heading)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] active:scale-95"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className="text-xs text-[var(--text-light)]">Maximum 8 seats per ride</p>
    </div>
  );
}

/* =====================================================================
   Live Preview Card
===================================================================== */

function RidePreview({ values }: { values: FormValues }) {
  const dt = formatDisplayDate(values.departureDate, values.departureTime);
  const price = Number(values.pricePerSeat) || 0;
  const hasSource = values.sourceCity.trim();
  const hasDest = values.destinationCity.trim();

  return (
    <div className="sticky top-6 space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)]">
            <Car size={16} className="text-[var(--primary)]" />
          </div>
          <h3 className="font-semibold text-[var(--heading)]">Ride Preview</h3>
        </div>

        {/* Route */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 flex-col items-center rounded-xl bg-gray-50 py-3 text-center">
            <MapPin size={14} className="text-[var(--primary)]" />
            <p className="mt-1 text-xs text-[var(--text-light)]">From</p>
            <p className={`mt-0.5 text-sm font-semibold ${hasSource ? "text-[var(--heading)]" : "text-[var(--text-light)]"}`}>
              {hasSource || "—"}
            </p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)]">
            <ArrowRight size={14} className="text-[var(--primary)]" />
          </div>
          <div className="flex flex-1 flex-col items-center rounded-xl bg-gray-50 py-3 text-center">
            <MapPin size={14} className="text-[var(--primary)]" />
            <p className="mt-1 text-xs text-[var(--text-light)]">To</p>
            <p className={`mt-0.5 text-sm font-semibold ${hasDest ? "text-[var(--heading)]" : "text-[var(--text-light)]"}`}>
              {hasDest || "—"}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 space-y-2 rounded-xl bg-gray-50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-[var(--text-light)]">
              <Calendar size={13} /> Date
            </span>
            <span className="font-medium text-[var(--heading)]">{dt?.date ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-[var(--text-light)]">
              <Clock size={13} /> Time
            </span>
            <span className="font-medium text-[var(--heading)]">{dt?.time ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-[var(--text-light)]">
              <Users size={13} /> Seats
            </span>
            <span className="font-medium text-[var(--heading)]">{values.totalSeats}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-[var(--text-light)]">
              <DollarSign size={13} /> Per Seat
            </span>
            <span className="font-semibold text-[var(--primary)]">
              {price > 0 ? `Rs.${price.toLocaleString("en-IN")}` : "—"}
            </span>
          </div>
        </div>

        {/* Earnings estimate */}
        {price > 0 && (
          <div className="mt-3 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary-light)] p-3">
            <p className="text-xs text-[var(--text-light)]">Estimated earnings</p>
            <p className="mt-0.5 text-lg font-bold text-[var(--primary)]">
              Rs.{(price * values.totalSeats).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-[var(--text-light)]">
              {values.totalSeats} seat{values.totalSeats > 1 ? "s" : ""} × Rs.{price.toLocaleString("en-IN")}
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h4 className="text-sm font-semibold text-[var(--heading)]">Tips for a great ride</h4>
        <ul className="mt-3 space-y-2">
          {[
            "Set a fair price to attract more passengers",
            "Be punctual — passengers rely on your schedule",
            "Keep your vehicle clean and comfortable",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-xs text-[var(--text)]">
              <CheckCircle size={13} className="mt-0.5 shrink-0 text-green-500" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* =====================================================================
   Success State
===================================================================== */

function SuccessState({ ride, onOfferAnother }: { ride: RideResponse; onOfferAnother: () => void }) {
  const router = useRouter();
  const dt = formatDisplayDate(
    ride.departureTime.slice(0, 10),
    ride.departureTime.slice(11, 16)
  );

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="mt-5 text-2xl font-bold text-[var(--heading)]">Ride Published!</h2>
      <p className="mt-2 text-sm text-[var(--text)]">Your ride is now live. Passengers can book it.</p>

      <div className="mt-6 w-full max-w-sm rounded-2xl border border-[var(--border)] bg-white p-5 text-left shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary-light)]">
            <Car size={16} className="text-[var(--primary)]" />
          </div>
          <span className="text-xs font-medium text-[var(--text-light)]">Ride #{ride.id}</span>
          <span className="ml-auto rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
            {ride.status}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="font-bold text-[var(--heading)]">{ride.sourceCity}</span>
          <ArrowRight size={14} className="text-[var(--primary)]" />
          <span className="font-bold text-[var(--heading)]">{ride.destinationCity}</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-gray-50 p-2">
            <p className="text-[10px] text-[var(--text-light)]">Date</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--heading)]">{dt?.date ?? "—"}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-2">
            <p className="text-[10px] text-[var(--text-light)]">Seats</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--heading)]">{ride.availableSeats}</p>
          </div>
          <div className="rounded-xl bg-[var(--primary-light)] p-2">
            <p className="text-[10px] text-[var(--primary)]">Per Seat</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--primary)]">Rs.{ride.pricePerSeat}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onOfferAnother}
          className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-gray-50"
        >
          Offer Another Ride
        </button>
        <button
          onClick={() => router.push("/dashboard/rides")}
          className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          View My Rides
        </button>
      </div>
    </div>
  );
}

/* =====================================================================
   Page
===================================================================== */

export default function OfferRidePage() {
  const [publishedRide, setPublishedRide] = useState<RideResponse | null>(null);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(offerRideSchema),
    mode: "onChange",
    defaultValues: { totalSeats: 2, sourceCity: "", destinationCity: "", departureDate: "", departureTime: "", pricePerSeat: "" },
  });

  const values = watch();

  const onSubmit = async (data: FormValues) => {
    setSubmitError("");
    try {
      const ride = await rideService.publishRide({
        sourceCity: data.sourceCity.trim(),
        destinationCity: data.destinationCity.trim(),
        departureTime: toIso(data.departureDate, data.departureTime),
        pricePerSeat: Number(data.pricePerSeat),
        totalSeats: data.totalSeats,
      });
      setPublishedRide(ride);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setSubmitError(msg || "Failed to publish ride. Please try again.");
    }
  };

  const handleOfferAnother = () => {
    setPublishedRide(null);
    setSubmitError("");
    reset();
  };

  if (publishedRide) {
    return (
      <div className="mx-auto max-w-2xl">
        <SuccessState ride={publishedRide} onOfferAnother={handleOfferAnother} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/overview"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--text)] hover:bg-gray-50"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[var(--heading)]">Offer a Ride</h2>
          <p className="text-sm text-[var(--text)]">Fill in the details to publish your ride</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Route */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <h3 className="font-semibold text-[var(--heading)]">Route Details</h3>
            <p className="mt-0.5 text-xs text-[var(--text-light)]">Where are you starting and where are you going?</p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField label="Pickup City" required icon={MapPin} error={errors.sourceCity?.message}>
                <input
                  {...register("sourceCity")}
                  placeholder="e.g. Delhi"
                  className={inputCls(true, errors.sourceCity?.message)}
                />
              </InputField>

              {/* Swap button */}
              <div className="hidden sm:flex sm:col-span-2 sm:-my-2 sm:justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const src = values.sourceCity;
                    const dst = values.destinationCity;
                    setValue("sourceCity", dst, { shouldValidate: true });
                    setValue("destinationCity", src, { shouldValidate: true });
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                >
                  <ArrowLeftRight size={13} /> Swap
                </button>
              </div>

              <InputField label="Drop City" required icon={MapPin} error={errors.destinationCity?.message}>
                <input
                  {...register("destinationCity")}
                  placeholder="e.g. Jaipur"
                  className={inputCls(true, errors.destinationCity?.message)}
                />
              </InputField>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <h3 className="font-semibold text-[var(--heading)]">Schedule</h3>
            <p className="mt-0.5 text-xs text-[var(--text-light)]">When is your departure?</p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField label="Departure Date" required icon={Calendar} error={errors.departureDate?.message}>
                <input
                  type="date"
                  min={todayMin()}
                  {...register("departureDate")}
                  className={inputCls(true, errors.departureDate?.message)}
                />
              </InputField>

              <InputField label="Departure Time" required icon={Clock} error={errors.departureTime?.message}>
                <input
                  type="time"
                  {...register("departureTime")}
                  className={inputCls(true, errors.departureTime?.message)}
                />
              </InputField>
            </div>
          </div>

          {/* Seats & Price */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <h3 className="font-semibold text-[var(--heading)]">Seats & Pricing</h3>
            <p className="mt-0.5 text-xs text-[var(--text-light)]">How many passengers can you take and at what price?</p>

            <div className="mt-5 space-y-5">
              <SeatPicker
                value={values.totalSeats}
                onChange={(n) => setValue("totalSeats", n, { shouldValidate: true })}
              />

              <InputField label="Price per Seat (₹)" required icon={DollarSign} error={errors.pricePerSeat?.message}>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="e.g. 500"
                  {...register("pricePerSeat")}
                  className={inputCls(true, errors.pricePerSeat?.message)}
                />
              </InputField>
            </div>
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Publishing…
              </>
            ) : (
              <>
                <Car size={16} />
                Publish Ride
              </>
            )}
          </button>
        </form>

        {/* Preview */}
        <RidePreview values={values} />
      </div>
    </div>
  );
}
