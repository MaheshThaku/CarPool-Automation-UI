"use client";

import Container from "@/components/ui/Container";

import LocationField from "./LocationField";
import DateField from "./DateField";
import PassengerField from "./PassengerField";

export default function RideSearch() {
  return (
    <section
      className="
        relative
        z-20
        -mt-14
        pb-10
      "
    >
      <Container>
        <div
          className="
            rounded-3xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-6
            shadow-xl
          "
        >
          <div
            className="
              grid
              gap-4

              md:grid-cols-2

              xl:grid-cols-5
            "
          >
            <LocationField
              label="From"
              placeholder="Enter starting location"
            />

            <LocationField
              label="To"
              placeholder="Enter destination"
            />

            <DateField />

            <PassengerField />

            <button
              className="
                mt-auto
                h-[58px]
                rounded-xl
                bg-[var(--primary)]
                px-6
                font-semibold
                text-white
                transition-all

                hover:bg-[var(--primary-hover)]
              "
            >
              Search Rides
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}