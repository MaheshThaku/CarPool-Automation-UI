'use client';

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type CSSProperties,
} from 'react';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { searchLocations, type LocationResult } from '@/services/photon.service';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 380;

export interface CityAutocompleteProps {
  /** Controlled value — the city string shown in the input */
  value: string;
  /** Called whenever the user selects a suggestion */
  onChange: (city: string) => void;
  placeholder?: string;
  /** Extra className applied to the input element */
  inputClassName?: string;
  /** Extra className applied to the wrapper div */
  className?: string;
  id?: string;
  /** Force-open dropdown direction: 'down' (default) | 'up' */
  dropdownDirection?: 'down' | 'up';
  style?: CSSProperties;
}

/**
 * City-only autocomplete backed by the Photon/Komoot geocoder.
 * On selection it calls onChange(city) — no coordinates needed.
 * Designed to be a drop-in replacement for a plain text <input>.
 */
export default function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Search city…',
  inputClassName = '',
  className = '',
  id,
  dropdownDirection = 'down',
  style,
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Keep internal query in sync when parent resets/changes value externally
  const lastSynced = useRef(value);
  useEffect(() => {
    if (value !== lastSynced.current) {
      lastSynced.current = value;
      setQuery(value);
    }
  }, [value]);

  // Debounced Photon search
  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const locations = await searchLocations(query, controller.signal);
        setResults(locations);
        setOpen(locations.length > 0);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setOpen(false);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  function select(location: LocationResult) {
    const city = location.city || location.address.split(',')[0].trim();
    lastSynced.current = city;
    setQuery(city);
    setResults([]);
    setOpen(false);
    onChange(city);
    inputRef.current?.focus();
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' && open) {
      e.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function handleOptionKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      optionRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) inputRef.current?.focus();
      else optionRefs.current[index - 1]?.focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.focus();
    }
  }

  const dropdownClass =
    dropdownDirection === 'up'
      ? 'bottom-full mb-1'
      : 'top-full mt-1';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} style={style}>
      <div className="relative flex items-center">
        <MapPin
          size={16}
          className="pointer-events-none absolute left-3 shrink-0 text-[var(--primary)]"
        />
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(''); // clear parent value while user is typing
          }}
          onKeyDown={handleInputKeyDown}
          className={`w-full pl-9 pr-8 ${inputClassName}`}
        />
        {loading && (
          <Loader2
            size={14}
            className="pointer-events-none absolute right-3 animate-spin text-[var(--primary)]"
          />
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          className={`absolute ${dropdownClass} z-50 max-h-72 w-full min-w-[240px] overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-2xl`}
        >
          {results.map((loc, index) => {
            const city = loc.city || loc.address.split(',')[0].trim();
            const sub = loc.address.replace(city, '').replace(/^,\s*/, '');

            return (
              <li
                key={`${loc.latitude}-${loc.longitude}`}
                className="border-b border-gray-100 last:border-none"
              >
                <button
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => select(loc)}
                  onKeyDown={(e) => handleOptionKeyDown(e, index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="truncate font-semibold text-gray-900">{city}</p>
                    {sub && (
                      <p className="mt-0.5 truncate text-xs text-gray-500">{sub}</p>
                    )}
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-gray-400" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
