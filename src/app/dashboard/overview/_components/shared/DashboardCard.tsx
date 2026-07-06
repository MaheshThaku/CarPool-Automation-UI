// app/dashboard/overview/_components/shared/DashboardCard.tsx

import { memo } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function DashboardCardComponent({ children, className = '' }: Props) {
  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm ${className} `}
    >
      {children}
    </section>
  );
}

const DashboardCard = memo(DashboardCardComponent);

export default DashboardCard;
