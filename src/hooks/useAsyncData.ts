"use client";
import { useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic hook for fetching async data.
 * Cancels in-flight requests on unmount to avoid state updates on dead components.
 *
 * Usage:
 *   const { data, loading, error } = useAsyncData(() => dashboardService.getRiderStats());
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // Resetting loading/error synchronously when deps or `tick` change is
    // intentional: it must happen before `fetcher()` is invoked below so
    // consumers see a `loading` flip on refetch, not just on first mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((data) => {
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
