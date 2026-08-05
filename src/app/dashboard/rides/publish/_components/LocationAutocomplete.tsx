'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronRight } from 'lucide-react';

import {
  searchLocations,
  type LocationResult,
} from '@/services/photon.service';

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

    // Don't re-search the value the user just picked from the dropdown —
    // select() set the query, so searching again would reopen the dropdown.
    if (query === lastPicked.current) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError(false);
        const locations = await searchLocations(query, controller.signal);
        setResults(locations);
        setSearchedQuery(query);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error('Location search failed:', err);
        setResults([]);
        setSearchedQuery(null);
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
  const showNoResults =
    isQueryValid &&
    searchedQuery === query &&
    !loading &&
    !error &&
    results.length === 0;

  function selectLocation(location: LocationResult) {
    lastSyncedValue.current = location.address;
    // Remember the pick so the search effect skips it (no reopened dropdown).
    // searchedQuery stays null because this query never matched a search yet.
    lastPicked.current = location.address;
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
        className={`${inputClassName} bg-transparent!`}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          const newQuery = e.target.value;
          // Any new keystroke invalidates the last pick, so searches resume.
          lastPicked.current = '';
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

      {showNoResults && (
        <div className="mt-1 text-sm text-gray-500" aria-live="polite">
          No results found in India.
        </div>
      )}

      {showDropdown && (
        <ul className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.map((location, index) => (
            <li
              // Photon can return several distinct places at the SAME
              // coordinates (different names), so the raw coordinate key would
              // collide — append the index to keep it unique per row.
              key={`${location.latitude}-${location.longitude}-${index}`}
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
