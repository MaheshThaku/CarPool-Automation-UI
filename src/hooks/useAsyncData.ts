"use client";
import { useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseAsyncDataOptions {
  /**
   * When provided, successful responses are cached in-memory (module scope)
   * under this key and reused by every component instance that requests the
   * same key, instead of re-issuing the request. This is what stops the same
   * GET firing again every time a user clicks back to a sidebar page they
   * already visited.
   */
  cacheKey?: string;
  /** How long a cached response stays fresh. Defaults to 30s. */
  ttlMs?: number;
}

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCached<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

function setCached(key: string, data: unknown, ttlMs: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/** Drop a cached entry (e.g. right after a mutation that invalidates it). */
export function invalidateAsyncCache(key: string): void {
  cache.delete(key);
}

const DEFAULT_TTL_MS = 30_000;

/**
 * Generic hook for fetching async data.
 * Cancels in-flight requests on unmount to avoid state updates on dead components.
 * Optionally caches successful results across mounts/components so navigating
 * away and back doesn't re-issue the same request (see `cacheKey`).
 *
 * Usage:
 *   const { data, loading, error } = useAsyncData(
 *     () => dashboardService.getRiderStats(),
 *     [],
 *     { cacheKey: "rider-stats" }
 *   );
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncDataOptions = {}
): AsyncState<T> & { refetch: () => void } {
  const { cacheKey, ttlMs = DEFAULT_TTL_MS } = options;
  const cachedOnInit = cacheKey ? getCached<T>(cacheKey) : undefined;

  const [state, setState] = useState<AsyncState<T>>({
    data: cachedOnInit ?? null,
    loading: cachedOnInit === undefined,
    error: null,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // tick > 0 means this run came from refetch() — always bypass the cache
    // so an explicit refresh can never be served stale data.
    const isExplicitRefetch = tick > 0;
    const fresh = !isExplicitRefetch && cacheKey ? getCached<T>(cacheKey) : undefined;

    if (fresh !== undefined) {
      setState({ data: fresh, loading: false, error: null });
      return;
    }

    let cancelled = false;
    // Resetting loading/error synchronously when deps or `tick` change is
    // intentional: it must happen before `fetcher()` is invoked below so
    // consumers see a `loading` flip on refetch, not just on first mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (cacheKey) setCached(cacheKey, data, ttlMs);
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}
