'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronRight } from 'lucide-react';

const MIN_QUERY_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 400;

interface LocationAutocompleteProps {
  readonly label: string;
  readonly placeholder?: string;
  readonly onSelect: (location: LocationResult) => void;
  readonly value?: string;
  /** Pass the same class string every other field in the form uses
   *  (e.g., inputCls(true, error)) so icon spacing/borders/error state
   *  stay consistent instead of being hardcoded here. */
  readonly inputClassName: string;
}

export default function LocationAutocomplete({
                                               label,
                                               placeholder,
                                               onSelect,
                                               value = '',
                                               inputClassName,
                                             }: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Tracks the last external `value` we've already applied to `query`.
  // We only ever pull in a NEW external value (e.g., a form reset, or the
  // user picking a suggestion which round-trips through the parent) —
  // never on every render just because the prop reference changed.
  // This runs post-render (effect), not during render, so it can't
  // tear a keystroke the user is mid-typing.
  const lastSyncedValue = useRef(value);

  useEffect(() => {
    if (value !== lastSyncedValue.current) {
      lastSyncedValue.current = value;
      setQuery(value);
    }
  }, [value]);

  const isQueryValid = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(false);
        const locations = await searchLocations(query, controller.signal);
        setResults(locations);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('Location search failed:', err);
        setResults([]);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = isQueryValid && results.length > 0;
  const showLoading = isQueryValid && loading;
  const showError = isQueryValid && !loading && error;

  function selectLocation(location: LocationResult) {
    lastSyncedValue.current = location.address;
    setQuery(location.address);
    setResults([]);
    onSelect(location);
    inputRef.current?.focus();
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' && showDropdown) {
      e.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (e.key === 'Escape') {
      setResults([]);
    }
  }

  function handleOptionKeyDown(
    e: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      optionRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        inputRef.current?.focus();
      } else {
        optionRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Escape') {
      setResults([]);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="mb-2 block font-medium">{label}</label>}

      <input
        ref={inputRef}
        // Applying !bg-transparent fixes the missing icon bug by allowing the
        // absolute icon behind this input element to shine right through.
        className={`${inputClassName} !bg-transparent`}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          const newQuery = e.target.value;
          setQuery(newQuery);
          if (newQuery.length < MIN_QUERY_LENGTH) {
            setResults([]);
          }
        }}
        onKeyDown={handleInputKeyDown}
      />

      {showLoading && (
        <div className="mt-1 text-sm text-gray-500" aria-live="polite">
          Searching...
        </div>
      )}

      {showError && (
        <div className="mt-1 text-sm text-red-500" role="alert">
          Search failed. Try again.
        </div>
      )}

      {showDropdown && (
        <ul className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.map((location, index) => (
            <li
              key={`${location.latitude}-${location.longitude}`}
              className="border-b border-gray-100 last:border-none"
            >
              <button
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between p-3.5 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                onClick={() => selectLocation(location)}
                onKeyDown={(e) => handleOptionKeyDown(e, index)}
              >
                <div className="flex flex-col pr-4">
                  <span className="font-semibold text-gray-900">
                    {location.mainText}
                  </span>
                  {location.subText && (
                    <span className="mt-0.5 text-sm text-gray-500">
                      {location.subText}
                    </span>
                  )}
                </div>
                <ChevronRight size={18} className="shrink-0 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const PHOTON_BASE_URL = 'https://photon.komoot.io/api';
const RESULTS_LIMIT = 5;
const REQUEST_TIMEOUT_MS = 8000;

export interface PhotonFeature {
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    street?: string;
    district?: string;
  };
}

export interface PhotonResponse {
  features: PhotonFeature[];
}

export interface LocationResult {
  city: string;
  address: string;
  mainText: string;
  subText: string;
  latitude: number;
  longitude: number;
}

function dedupeResults(results: LocationResult[]): LocationResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    // Deduplicate exact matches to clean up messy API returned groups
    const key = `${r.mainText.toLowerCase()}-${r.subText.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<LocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());

  try {
    const response = await fetch(
      `${PHOTON_BASE_URL}?q=${encodeURIComponent(trimmed)}&limit=${RESULTS_LIMIT}`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`);
    }

    const data: PhotonResponse = await response.json();

    const results: LocationResult[] = data.features.map((feature) => {
      const p = feature.properties;

      // Determine the primary identifier for the Location
      const mainText = p.name || p.city || p.state || 'Unknown Location';

      // Build out the contextual address (avoiding duplicates from mainText)
      const subParts = [];
      if (p.street && p.street !== mainText) subParts.push(p.street);
      if (p.district && p.district !== mainText) subParts.push(p.district);
      if (p.city && p.city !== mainText) subParts.push(p.city);
      if (p.state && p.state !== mainText) subParts.push(p.state);
      if (p.country && p.country !== mainText) subParts.push(p.country);

      const subText = subParts.filter(Boolean).join(', ');
      const fullAddress = subText ? `${mainText}, ${subText}` : mainText;

      return {
        city: p.city || p.name || '',
        address: fullAddress,
        mainText,
        subText,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
      };
    });

    return dedupeResults(results);
  } finally {
    clearTimeout(timeoutId);
  }
}
