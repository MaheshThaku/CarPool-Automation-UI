// app/dashboard/overview/_components/shared/DashboardSection.tsx

import { memo } from 'react';

interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

function DashboardSectionComponent({
  title,
  description,
  action,
  children,
}: Props) {
  return (
    <section>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--heading)]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-[var(--text-light)]">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

const DashboardSection = memo(DashboardSectionComponent);

export default DashboardSection;
