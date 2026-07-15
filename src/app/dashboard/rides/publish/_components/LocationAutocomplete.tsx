'use client';

import { useEffect, useState } from 'react';
import { searchLocations, LocationResult } from '@/services/photon.service';

interface LocationAutocompleteProps {
  label: string;
  placeholder?: string;
  onSelect: (location: LocationResult) => void;

  value?: string;
}

export default function LocationAutocomplete({
  label,
  placeholder,
  onSelect,
  value = "",
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const locations = await searchLocations(query);
        setResults(locations);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">
      <label className="block mb-2 font-medium">{label}</label>

      <input
        className="w-full border rounded-md px-3 py-2"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setResults([]);
        }}
      />

      {loading && (
        <div className="text-sm text-gray-500 mt-1">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <ul className="absolute z-50 bg-white border rounded-md w-full mt-1 shadow-lg max-h-64 overflow-auto">
          {results.map((location, index) => (
            <li
              key={index}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(location.address);
                setResults([]);
                onSelect(location);
              }}
            >
              <div className="font-medium">{location.address}</div>

              <div className="text-xs text-gray-500">
                {location.latitude}, {location.longitude}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}