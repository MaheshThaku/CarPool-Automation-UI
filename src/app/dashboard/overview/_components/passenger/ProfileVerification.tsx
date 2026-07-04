'use client';

import { memo } from 'react';

import { CheckCircle, Mail, Phone } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';

import { ProfileVerification as ProfileVerificationType } from '@/types/dashboard.types';

interface Props {
  verification: ProfileVerificationType | null;
}

function ProfileVerificationComponent({ verification }: Props) {
  const emailVerified = verification?.emailVerified ?? false;

  const contactVerified = verification?.contactVerified ?? false;

  return (
    <DashboardCard className="h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-[var(--heading)]">
          Profile Verification
        </h3>
      </div>

      <div className="space-y-5">
        {/* Email */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-[var(--text)]">Email Address</p>

            {verification?.email && (
              <p className="mt-1 text-sm text-[var(--text-light)]">
                {verification.email}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                emailVerified ? 'text-[var(--success)]' : 'text-[var(--error)]'
              }`}
            >
              {emailVerified ? 'Verified' : 'Pending'}
            </span>

            {emailVerified && (
              <CheckCircle size={18} className="text-[var(--success)]" />
            )}
          </div>
        </div>

        {/* Contact */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-[var(--text)]">Contact Number</p>

            {verification?.contactNumber && (
              <p className="mt-1 text-sm text-[var(--text-light)]">
                {verification.contactNumber}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                contactVerified
                  ? 'text-[var(--success)]'
                  : 'text-[var(--error)]'
              }`}
            >
              {contactVerified ? 'Verified' : 'Pending'}
            </span>

            {contactVerified && (
              <CheckCircle size={18} className="text-[var(--success)]" />
            )}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

const ProfileVerification = memo(ProfileVerificationComponent);

export default ProfileVerification;
