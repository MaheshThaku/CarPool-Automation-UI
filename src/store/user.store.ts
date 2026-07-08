import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProfileData } from '@/types/profile.types';

interface UserStore {
  profile: ProfileData | null;

  hydrated: boolean;

  setProfile: (
    profile: ProfileData | null,
  ) => void;

  clearProfile: () => void;

  setHydrated: (
    hydrated: boolean,
  ) => void;
}

export const useUserStore =
  create<UserStore>()(
    persist(
      (set) => ({
        profile: null,

        hydrated: false,

        setProfile: (profile) =>
          set({ profile }),

        clearProfile: () =>
          set({ profile: null }),

        setHydrated: (hydrated) =>
          set({ hydrated }),
      }),
      {
        name: 'sharefare-user-store',

        onRehydrateStorage:
          () => (state) => {
            state?.setHydrated(true);
          },
      },
    ),
  );