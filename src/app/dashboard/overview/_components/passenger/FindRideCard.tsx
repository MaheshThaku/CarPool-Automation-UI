'use client';

import { memo, useState } from 'react';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import DashboardCard from '../shared/DashboardCard';
import CityAutocomplete from '@/components/ui/CityAutocomplete';

function FindRideCardComponent() {
  const router = useRouter();
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (sourceCity.trim()) params.append('sourceCity', sourceCity.trim());
    if (destinationCity.trim()) params.append('destinationCity', destinationCity.trim());
    if (departureDate) params.append('departureDate', departureDate);
    router.push(`/dashboard/rides?${params.toString()}`);
  };

  const handleSwap = () => {
    const temp = sourceCity;
    setSourceCity(destinationCity);
    setDestinationCity(temp);
  };

  return (
    <DashboardCard className="relative overflow-visible border-0 bg-gradient-to-r from-[#c96d05] to-[#f0b54d] p-8 text-white">
      <div className="relative z-10">
        <h2 className="text-4xl font-bold">Find Your Next Ride</h2>

        <p className="mt-2 text-white/90">
          Search from thousands of rides and travel safely with verified drivers.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-3 shadow-lg">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_1fr_auto]">

            {/* Source city autocomplete */}
            <CityAutocomplete
              value={sourceCity}
              onChange={setSourceCity}
              placeholder="From"
              inputClassName="h-10 w-full bg-transparent text-[var(--heading)] outline-none placeholder:text-gray-400"
              className="self-center"
            />

            {/* Swap */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="flex items-center justify-center transition-transform hover:scale-110 active:scale-95 text-[var(--primary)]"
                onClick={handleSwap}
                aria-label="Swap departure and arrival cities"
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>

            {/* Destination city autocomplete */}
            <CityAutocomplete
              value={destinationCity}
              onChange={setDestinationCity}
              placeholder="To"
              inputClassName="h-10 w-full bg-transparent text-[var(--heading)] outline-none placeholder:text-gray-400"
              className="self-center"
            />

            {/* Date */}
            <div className="flex items-center gap-3 px-3">
              <Calendar size={18} className="shrink-0 text-[var(--primary)]" />
              <input
                type="date"
                className="w-full bg-transparent text-[var(--heading)] outline-none"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>

            {/* Search button */}
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              Search Rides
            </button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

export default memo(FindRideCardComponent);
