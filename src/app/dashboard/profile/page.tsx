'use client';

import { useEffect, useState } from 'react';

import { ProfileData } from '@/types/profile.types';
import { updateSessionUser } from '@/lib/auth.client';

import PersonalInfoSection from './_components/PersonalInfoSection';
import AvatarSection from './_components/AvatarSection';
import SectionError from './_components/SectionError';
import Skeleton from './_components/Skeleton';

import { useAsyncData } from '@/hooks/useAsyncData';
import { profileService } from '@/services/profile.service';
import { useUserStore } from '@/store/user.store';

export default function ProfilePage() {
  const setProfile = useUserStore((state) => state.setProfile);

  const profile$ = useAsyncData(() => profileService.getProfile(), [], {
    cacheKey: 'current-profile',
  });

  const [profileUpdates, setProfileUpdates] = useState<Partial<ProfileData>>(
    {},
  );

  const profile = profile$.data
    ? {
        ...profile$.data,
        ...profileUpdates,
      }
    : null;

  const isRider = profile?.role === 'ROLE_RIDER';

  /* -------------------------------- */
  /* Sync fetched profile to Zustand  */
  /* -------------------------------- */

  useEffect(() => {
    if (profile$.data) {
      setProfile(profile$.data);
    }
  }, [profile$.data, setProfile]);

  /* -------------------------------- */
  /* Session-user sync helper         */
  /* -------------------------------- */

  const updateUserCookie = (updates: Record<string, unknown>) => {
    // Centralized helper: updates the `user` cookie AND broadcasts the change
    // to every tab (navbar updates live, no reload needed).
    updateSessionUser(updates);
  };

  /* -------------------------------- */
  /* Avatar sync                      */
  /* -------------------------------- */

  useEffect(() => {
    if (profile?.avatarUrl) {
      updateUserCookie({
        avatarUrl: profile.avatarUrl,
      });
    }
  }, [profile?.avatarUrl]);

  /* -------------------------------- */
  /* Loading                          */
  /* -------------------------------- */

  if (profile$.loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            <Skeleton className="h-40 rounded-2xl" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- */
  /* Error                            */
  /* -------------------------------- */

  if (profile$.error) {
    return <SectionError message={profile$.error} onRetry={profile$.refetch} />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">My Profile</h2>

        <p className="mt-1 text-sm text-[var(--text)]">
          Manage your personal details and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left Column */}

        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <AvatarSection
              profile={profile}
              onAvatarChange={(url) => {
                if (!url) return;

                const updatedProfile = {
                  ...profile,
                  avatarUrl: url,
                  profilePictureUrl: url,
                };

                setProfileUpdates((prev) => ({
                  ...prev,
                  avatarUrl: url,
                  profilePictureUrl: url,
                }));

                setProfile(updatedProfile);

                updateUserCookie({
                  avatarUrl: url,
                });
              }}
            />

            <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-light)]">Role</span>

                <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
                  {isRider ? 'Rider' : 'Passenger'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-light)]">Member since</span>

                <span className="text-xs font-medium text-[var(--heading)]">
                  {profile.memberSince
                    ? new Date(profile.memberSince).getFullYear()
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}

        <div className="space-y-6">
          <PersonalInfoSection
            profile={profile}
            onSaved={(updated) => {
              const updatedProfile = {
                ...profile,
                ...updated,
              };

              setProfileUpdates((prev) => ({
                ...prev,
                ...updated,
              }));

              setProfile(updatedProfile);

              updateUserCookie({
                firstName: updated.firstName,
                lastName: updated.lastName,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
