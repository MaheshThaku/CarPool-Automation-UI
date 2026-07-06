'use client';

import { memo } from 'react';

import { CheckCircle2, Clock3 } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';

interface Step {
  key: string;
  label: string;
  completed: boolean;
}

interface Props {
  percentage: number;
  steps: Step[];
}

function ProfileCompletionComponent({ percentage, steps }: Props) {
  const completedCount = steps.filter((step) => step.completed).length;

  return (
    <DashboardCard>
      <div className="space-y-5">
        {/* Header */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-[var(--heading)]">
              Profile Completion
            </h3>

            <p className="mt-1 text-sm text-[var(--text-light)]">
              Complete your profile to build trust and increase ride visibility.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[var(--primary-light)] px-4 py-2">
              <span className="text-sm font-semibold text-[var(--primary)]">
                {completedCount} of {steps.length} completed
              </span>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-[var(--heading)]">
                {percentage}%
              </p>

              <p className="text-xs text-[var(--text-light)]">Complete</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}

        <div>
          <div className="h-3 overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>

        {/* Steps */}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.key}
              className={`rounded-xl border p-4 transition-all ${
                step.completed
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-[var(--border)] bg-[var(--surface)]'
              }`}
            >
              <div className="flex items-start gap-3">
                {step.completed ? (
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-green-600"
                  />
                ) : (
                  <Clock3
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                  />
                )}

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--heading)]">
                    {step.label}
                  </p>

                  <p
                    className={`mt-1 text-xs font-medium ${
                      step.completed
                        ? 'text-green-600'
                        : 'text-[var(--primary)]'
                    }`}
                  >
                    {step.completed ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

const ProfileCompletion = memo(ProfileCompletionComponent);

export default ProfileCompletion;
