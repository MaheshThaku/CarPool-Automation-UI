'use client';

import { useEffect } from 'react';

import { profileService } from '@/services/profile.service';
import { useUserStore } from '@/store/user.store';

export function useProfileBootstrap() {
  const profile = useUserStore(
    (state) => state.profile,
  );

  const setProfile = useUserStore(
    (state) => state.setProfile,
  );

  const clearProfile = useUserStore(
    (state) => state.clearProfile,
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const latestProfile =
          await profileService.getProfile();

        setProfile(latestProfile);
      } catch (error) {
        console.error(
          '[ProfileBootstrap]',
          error,
        );

        // Unauthorized / expired session
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          (error as { status?: number })
            .status === 401
        ) {
          clearProfile();
        }
      }
    };

    /**
     * Persisted Zustand already contains profile.
     * Show it instantly.
     *
     * Then silently sync latest profile
     * in the background.
     */
    loadProfile();

    return () => {
      controller.abort();
    };
  }, [setProfile, clearProfile]);

  return profile;
}