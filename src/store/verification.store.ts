/**
 * verification.store.ts
 *
 * Zustand store that holds the rider's full verification status.
 *
 * Why this store exists:
 *  Before this store, every component that needed verification data called
 *  dashboardService.getRiderVerificationStatus() independently, resulting in
 *  3+ duplicate network requests per dashboard session.  This store is loaded
 *  once by `useVerificationBootstrap` (called from the dashboard layout) and
 *  all child pages/components simply read from it.
 */

import { create } from 'zustand';

import { dashboardService } from '@/services/dashboard.service';
import { RiderVerificationStatusResponse } from '@/types/dashboard.types';

interface VerificationStore {
  /** The full verification status response from the backend. */
  verificationStatus: RiderVerificationStatusResponse | null;

  /** True while the initial fetch is in flight. */
  isLoading: boolean;

  /** Stores the last fetch error message (if any). */
  error: string | null;

  /** Replace the stored verification status (used after a fetch or upload). */
  setVerificationStatus: (data: RiderVerificationStatusResponse | null) => void;

  /** Fetch from the API and store the result.  Safe to call multiple times — it
   *  will de-dup concurrent calls by checking `isLoading`. */
  fetchVerificationStatus: () => Promise<void>;

  /** Reset the store (e.g. on logout). */
  reset: () => void;
}

export const useVerificationStore = create<VerificationStore>((set, get) => ({
  verificationStatus: null,
  isLoading: false,
  error: null,

  setVerificationStatus: (data) => set({ verificationStatus: data }),

  fetchVerificationStatus: async () => {
    // Prevent concurrent fetches.
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const data = await dashboardService.getRiderVerificationStatus();
      set({ verificationStatus: data, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load verification status';
      set({ error: message, isLoading: false });
    }
  },

  reset: () =>
    set({ verificationStatus: null, isLoading: false, error: null }),
}));
