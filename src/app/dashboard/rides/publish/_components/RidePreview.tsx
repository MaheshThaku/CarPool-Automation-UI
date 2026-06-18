import { ArrowRight, Calendar, CheckCircle, Car, Clock, DollarSign, MapPin, Users } from "lucide-react";

import { OfferRideFormValues } from "@/schemas/publish-ride.schema";
import { formatDisplayDate } from "./utils";

interface RidePreviewProps {
  values: OfferRideFormValues;
}

export default function RidePreview({ values }: RidePreviewProps) {
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
