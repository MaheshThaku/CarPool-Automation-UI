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
  // The query that the last completed search was for. When it equals the
  // current query AND results are empty, we've genuinely searched and found
  // nothing — drives the "no results" state without any reset bookkeeping.
  const [searchedQuery, setSearchedQuery] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // The value the user most recently PICKED from the dropdown. While the query
  // equals this, we skip the search that select() itself would trigger — so
  // the dropdown never reopens right after a selection.
  const lastPicked = useRef('');

  // Keep internal query in sync when parent resets/changes value externally.
  const lastSynced = useRef(value);
  useEffect(() => {
    if (value !== lastSynced.current) {
      lastSynced.current = value;
      setQuery(value);
    }
  }, [value]);

  // Debounced Photon search. Results/open are only touched inside the async
  // timer callback (event/timer context) — never synchronously in the effect
  // body — to satisfy the react-hooks set-state-in-effect rule.
  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      return;
    }

    // Don't re-search the value the user just picked from the dropdown —
    // select() set the query, so searching again would reopen the dropdown.
    if (query === lastPicked.current) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const locations = await searchLocations(query, controller.signal);
        setResults(locations);
        setOpen(locations.length > 0);
        setSearchedQuery(query);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
          setOpen(false);
          setSearchedQuery(null);
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
    // Remember the pick so the search effect skips it (no reopened dropdown).
    // searchedQuery stays null because this query never matched a search yet.
    lastPicked.current = city;
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
            const newQuery = e.target.value;
            // Any new keystroke invalidates the last pick, so searches resume.
            lastPicked.current = '';
            setQuery(newQuery);
            onChange(''); // clear parent value while user is typing
            if (newQuery.length < MIN_QUERY_LENGTH) {
              setResults([]);
              setOpen(false);
            }
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

      {query.length >= MIN_QUERY_LENGTH &&
        searchedQuery === query &&
        !loading &&
        results.length === 0 && (
          <div className="mt-1 text-sm text-gray-500" aria-live="polite">
            No results found in India.
          </div>
        )}

      {open && results.length > 0 && (
        <ul
          className={`absolute ${dropdownClass} z-50 max-h-72 w-full min-w-[240px] overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-2xl`}
        >
          {results.map((loc, index) => {
            const city = loc.city || loc.address.split(',')[0].trim();
            const sub = loc.address.replace(city, '').replace(/^,\s*/, '');

            return (
              <li
                // Photon can return several distinct places at the SAME
                // coordinates (different names), so the raw coordinate key
                // would collide — append the index to keep it unique per row.
                key={`${loc.latitude}-${loc.longitude}-${index}`}
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
