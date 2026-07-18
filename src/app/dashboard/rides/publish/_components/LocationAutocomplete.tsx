'use client';

import { useEffect, useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state query when value prop changes from parent (e.g. initial render, reset, swap)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Efficient debounced API call
  useEffect(() => {
    // Only search if the dropdown is open, the query is not empty/too short, 
    // and the query is different from the currently selected/form value.
    if (!isOpen || query.length < 3 || query === value) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const locations = await searchLocations(query);
        setResults(locations);
      } catch (err) {
        console.error("Error searching locations:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, isOpen, value]);

  // Split address string into Name and Sub-details
  const formatAddress = (address: string) => {
    const parts = address.split(', ');
    const mainName = parts[0];
    const subtext = parts.slice(1).join(', ');
    return { mainName, subtext };
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="block mb-2 font-medium text-[var(--heading)]">{label}</label>}

      <div className="relative">
        <input
          className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all bg-white border-[var(--border)] text-[var(--heading)] placeholder-gray-400"
          value={query}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
        />
      </div>

      {/* Loading indicator inside input */}
      {loading && (
        <div className="absolute right-3 top-[10px] flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        </div>
      )}

      {/* Visually professional Google Maps-like dropdown list */}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 bg-white border border-[var(--border)] rounded-2xl w-full mt-1.5 shadow-2xl max-h-64 overflow-y-auto divide-y divide-gray-50 py-1 transition-all animate-in fade-in slide-in-from-top-1 duration-150">
          {results.map((location, index) => {
            const { mainName, subtext } = formatAddress(location.address);
            return (
              <li
                key={index}
                className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50/40 cursor-pointer transition-colors"
                onClick={() => {
                  setQuery(location.address);
                  setResults([]);
                  setIsOpen(false);
                  onSelect(location);
                }}
              >
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div className="flex flex-col min-w-0 text-left">
                  <span className="font-semibold text-sm text-[var(--heading)] truncate">
                    {mainName}
                  </span>
                  {subtext && (
                    <span className="text-xs text-[var(--text-light)] truncate mt-0.5">
                      {subtext}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}