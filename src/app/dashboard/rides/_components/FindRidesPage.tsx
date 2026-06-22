"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin, Calendar, Search, ArrowRight, Clock,
  Users, Star, ArrowLeftRight, Car, IndianRupee,
} from "lucide-react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { api } from "@/lib/axios";
import { RideResponse } from "@/types/ride.types";

/* =====================================================================
   Search form
===================================================================== */

interface SearchForm {
  sourceCity: string;
  destinationCity: string;
  date: string;
}

/* =====================================================================
   Utilities
===================================================================== */

function parseDeparture(iso: string) {
  try {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase(),
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
    };
  } catch {
    return { date: "—", time: "—", day: "—" };
  }
}

function todayMin() {
  return new Date().toISOString().slice(0, 10);
}

/* =====================================================================
   Ride Result Card
===================================================================== */

function RideCard({ ride }: { ride: RideResponse }) {
  const dt = parseDeparture(ride.departureTime);

  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-white shadow-sm transition-all hover:border-[var(--primary)]/50 hover:shadow-md">
      <div className="p-5">
        {/* Route header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
              {ride.driverName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-[var(--heading)]">{ride.driverName}</p>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-light)]">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span>New driver</span>
              </div>
            </div>
          </div>
          <span className="text-xl font-bold text-[var(--primary)]">Rs.{ride.pricePerSeat.toLocaleString("en-IN")}</span>
        </div>

        {/* Route */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] ring-2 ring-[var(--primary)]/20" />
              <span className="font-semibold text-[var(--heading)]">{ride.sourceCity}</span>
            </div>
            <div className="ml-[5px] h-5 border-l-2 border-dashed border-gray-300" />
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-gray-400 ring-2 ring-gray-200" />
              <span className="font-semibold text-[var(--heading)]">{ride.destinationCity}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-xs text-[var(--text-light)]">
            <span className="flex items-center gap-1"><Clock size={11} />{dt.time}</span>
            <span className="flex items-center gap-1"><Calendar size={11} />{dt.day}, {dt.date}</span>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <div className="flex items-center gap-3 text-xs text-[var(--text)]">
            <span className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1">
              <Users size={12} className="text-[var(--primary)]" />
              {ride.availableSeats} seat{ride.availableSeats !== 1 ? "s" : ""} left
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1">
              <Car size={12} className="text-[var(--primary)]" />
              Verified
            </span>
          </div>
          <button className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-95">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Popular routes suggestion
===================================================================== */

const POPULAR_ROUTES = [
  { from: "Delhi", to: "Jaipur" },
  { from: "Mumbai", to: "Pune" },
  { from: "Bangalore", to: "Mysore" },
  { from: "Chennai", to: "Pondicherry" },
];

/* =====================================================================
   Page
===================================================================== */

export default function FindRidesPage() {
  const [searchParams, setSearchParams] = useState<SearchForm | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SearchForm>({
    defaultValues: { sourceCity: "", destinationCity: "", date: "" },
  });

  const values = watch();

  // Fetch rides only after user submits search
  const results$ = useAsyncData<RideResponse[]>(
    async () => {
      if (!searchParams) return [];
      try {
        const res = await api.get<RideResponse[]>("/v1/passenger/ride/search", {
          params: {
            sourceCity: searchParams.sourceCity,
            destinationCity: searchParams.destinationCity,
            date: searchParams.date || undefined,
          },
        });
        return res.data;
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 401) throw err;
        return [];
      }
    },
    [searchParams]
  );

  const onSearch = (data: SearchForm) => {
    setSearchParams(data);
    setHasSearched(true);
  };

  const swapCities = () => {
    const src = values.sourceCity;
    const dst = values.destinationCity;
    setValue("sourceCity", dst);
    setValue("destinationCity", src);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">Find a Ride</h2>
        <p className="mt-1 text-sm text-[var(--text)]">Search from available rides and travel together.</p>
      </div>

      {/* Search card */}
      <form onSubmit={handleSubmit(onSearch)} className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          {/* From */}
          <div className="flex-1 min-w-[140px] space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-light)]">From</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primary)]" />
              <input
                {...register("sourceCity", { required: true })}
                placeholder="Departure city"
                className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]/20 ${errors.sourceCity ? "border-red-400" : "border-[var(--border)] focus:border-[var(--primary)]"}`}
              />
            </div>
          </div>

          {/* Swap */}
          <button type="button" onClick={swapCities}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--text)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] mb-0.5">
            <ArrowLeftRight size={15} />
          </button>

          {/* To */}
          <div className="flex-1 min-w-[140px] space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-light)]">To</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("destinationCity", { required: true })}
                placeholder="Arrival city"
                className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]/20 ${errors.destinationCity ? "border-red-400" : "border-[var(--border)] focus:border-[var(--primary)]"}`}
              />
            </div>
          </div>

          {/* Date */}
          <div className="flex-1 min-w-[140px] space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-light)]">Date <span className="text-gray-400">(optional)</span></label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
              <input type="date" min={todayMin()} {...register("date")}
                className="w-full rounded-xl border border-[var(--border)] py-2.5 pl-9 pr-3 text-sm text-[var(--heading)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" />
            </div>
          </div>

          {/* Submit */}
          <button type="submit"
            className="flex h-[42px] items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-95 mb-0.5">
            <Search size={15} /> Search
          </button>
        </div>
      </form>

      {/* Popular routes (shown before first search) */}
      {!hasSearched && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--heading)]">Popular Routes</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {POPULAR_ROUTES.map(({ from, to }) => (
              <button key={from + to}
                onClick={() => { setValue("sourceCity", from); setValue("destinationCity", to); }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-light)]">
                <span className="font-medium text-[var(--heading)]">{from}</span>
                <ArrowRight size={12} className="text-[var(--primary)]" />
                <span className="font-medium text-[var(--heading)]">{to}</span>
              </button>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-white p-5">
            <h3 className="font-semibold text-[var(--heading)]">How it works</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { step: "1", icon: Search, title: "Search a Ride", desc: "Enter your pickup and drop cities to find available rides." },
                { step: "2", icon: Car, title: "Choose Your Ride", desc: "Compare drivers, timings and prices. Pick the one that suits you." },
                { step: "3", icon: IndianRupee, title: "Book & Pay", desc: "Confirm your seat and pay securely. That's it!" },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                    {step}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--heading)]">{title}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-light)]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div>
          {results$.loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse rounded-2xl border border-[var(--border)] bg-white p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 rounded-lg bg-gray-100" />
                      <div className="h-3 w-20 rounded-lg bg-gray-100" />
                    </div>
                    <div className="h-6 w-16 rounded-lg bg-gray-100" />
                  </div>
                  <div className="h-20 rounded-xl bg-gray-50" />
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <div className="h-8 w-24 rounded-lg bg-gray-100" />
                    <div className="h-8 w-24 rounded-xl bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : (results$.data ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                <Car size={28} className="text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--heading)]">No rides found</h3>
              <p className="mt-1.5 max-w-xs text-sm text-[var(--text)]">
                No rides available for <strong>{searchParams?.sourceCity}</strong> → <strong>{searchParams?.destinationCity}</strong>
                {searchParams?.date ? ` on ${searchParams.date}` : ""}. Try a different date or route.
              </p>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm text-[var(--text)]">
                <span className="font-semibold text-[var(--heading)]">{(results$.data ?? []).length}</span> ride{(results$.data ?? []).length !== 1 ? "s" : ""} found · {searchParams?.sourceCity} → {searchParams?.destinationCity}
              </p>
              <div className="space-y-4">
                {(results$.data ?? []).map(ride => <RideCard key={ride.id} ride={ride} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
