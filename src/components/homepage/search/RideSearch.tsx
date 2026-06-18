"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/ui/Container";

import LocationField from "./LocationField";
import DateField from "./DateField";
import PassengerField from "./PassengerField";

export default function RideSearch() {
  const router = useRouter();

  const [sourceCity, setSourceCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [requiredSeats, setRequiredSeats] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (sourceCity.trim()) params.set("sourceCity", sourceCity.trim());
    if (destinationCity.trim()) params.set("destinationCity", destinationCity.trim());
    if (departureDate) params.set("departureDate", departureDate);
    if (requiredSeats > 1) params.set("requiredSeats", String(requiredSeats));

    router.push(`/dashboard/rides?${params.toString()}`);
  };

  return (
    <section
      className="relative z-20 -mt-14 pb-10"
    >
      <Container>
        <form
          onSubmit={handleSearch}
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"
        >
          <div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
            <LocationField
              label="From"
              placeholder="Enter starting location"
              value={sourceCity}
              onChange={(e) => setSourceCity(e.target.value)}
            />

            <LocationField
              label="To"
              placeholder="Enter destination"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
            />

            <DateField
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />

            <PassengerField
              value={requiredSeats}
              onChange={setRequiredSeats}
            />

            <button
              type="submit"
              className="mt-auto h-[58px] rounded-xl bg-[var(--primary)] px-6 font-semibold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-95"
            >
              Search Rides
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
}
