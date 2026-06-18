"use client";

import { useState } from "react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAsyncData } from "@/hooks/useAsyncData";
import { profileService } from "@/services/profile.service";
import { getCookie, setCookie } from "@/lib/cookies";
import { ProfileData } from "@/types/profile.types";

import Skeleton from "./_components/Skeleton";
import SectionError from "./_components/SectionError";
import AvatarSection from "./_components/AvatarSection";
import PersonalInfoSection from "./_components/PersonalInfoSection";
import VehicleSection from "./_components/VehicleSection";
import PasswordSection from "./_components/PasswordSection";
import VerificationCard from "./_components/VerificationCard";

export default function ProfilePage() {
  const currentUser = useCurrentUser();
  const isRider = currentUser?.role === "ROLE_RIDER";

  const profile$ = useAsyncData(() => profileService.getProfile());
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Promote freshly-fetched profile data into local editable state, compared
  // during render rather than in a useEffect.
  if (profile$.data && profile$.data !== profile) {
    setProfile(profile$.data);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">My Profile</h2>
        <p className="mt-1 text-sm text-[var(--text)]">Manage your personal details and account settings.</p>
      </div>

      {profile$.loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6 flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-40 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      ) : profile$.error ? (
        <SectionError message={profile$.error} onRetry={profile$.refetch} />
      ) : !profile ? null : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <AvatarSection
                profile={profile}
                onAvatarChange={(url) => setProfile((p) => p ? { ...p, avatarUrl: url } : p)}
              />
              <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-light)]">Role</span>
                  <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
                    {isRider ? "Rider" : "Passenger"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-light)]">Member since</span>
                  <span className="text-[var(--heading)] text-xs font-medium">
                    {profile.memberSince ? new Date(profile.memberSince).getFullYear() : "—"}
                  </span>
                </div>
              </div>
            </div>

            <VerificationCard profile={profile} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <PersonalInfoSection
              profile={profile}
              onSaved={(updated) => {
                setProfile(updated);
                // also sync the cached user-cookie name
                try {
                  const stored = getCookie("user");
                  if (stored) {
                    const u = JSON.parse(stored);
                    u.firstName = updated.firstName;
                    u.lastName = updated.lastName;
                    setCookie("user", JSON.stringify(u));
                  }
                } catch { /* ignore */ }
              }}
            />
            {isRider && <VehicleSection />}
            <PasswordSection />
          </div>
        </div>
      )}
    </div>
  );
}
