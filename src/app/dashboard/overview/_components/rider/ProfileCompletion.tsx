// app/dashboard/overview/_components/rider/ProfileCompletion.tsx

'use client';

import { memo } from 'react';

import DashboardCard from '../shared/DashboardCard';
import DashboardSection from '../shared/DashboardSection';
import CircularProgress from '../shared/CircularProgress';

interface Props {
  percentage: number;
}

function ProfileCompletionComponent({ percentage }: Props) {
  return (
    <DashboardSection
      title="Profile Completion"
      description="Complete your profile to increase trust"
    >
      <DashboardCard>
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <CircularProgress percentage={percentage} />

          <div>
            <h4 className="font-semibold text-[var(--heading)]">
              Profile Strength
            </h4>

            <p className="mt-1 text-sm text-[var(--text-light)]">
              Your profile is {percentage}% complete.
            </p>

            <p className="mt-2 text-sm text-[var(--text-light)]">
              Add missing details and documents to improve passenger confidence.
            </p>
          </div>
        </div>
      </DashboardCard>
    </DashboardSection>
  );
}

const ProfileCompletion = memo(ProfileCompletionComponent);

export default ProfileCompletion;
