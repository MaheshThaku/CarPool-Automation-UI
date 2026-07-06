// app/dashboard/overview/_components/shared/EmptyState.tsx

import { memo } from 'react';

import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

function EmptyStateComponent({
  icon: Icon,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Icon size={24} className="text-gray-400" />
      </div>

      <h3 className="mt-4 font-semibold text-[var(--heading)]">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-[var(--text-light)]">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const EmptyState = memo(EmptyStateComponent);

export default EmptyState;
