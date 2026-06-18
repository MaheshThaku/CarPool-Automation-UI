"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Car, CheckCircle } from "lucide-react";

import { RideResponse } from "@/types/ride.types";
import { formatDisplayDate } from "./utils";

interface SuccessStateProps {
  ride: RideResponse;
  onOfferAnother: () => void;
}

export default function SuccessState({ ride, onOfferAnother }: SuccessStateProps) {
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
