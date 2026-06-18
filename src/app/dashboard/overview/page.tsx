"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

import RiderDashboard from "./_components/RiderDashboard";
import PassengerDashboard from "./_components/PassengerDashboard";

export default function OverviewPage() {
  const user = useCurrentUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return user.role === "ROLE_RIDER" ? (
    <RiderDashboard user={user} />
  ) : (
    <PassengerDashboard user={user} />
  );
}
