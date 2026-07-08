'use client';

import { memo } from 'react';

import { Bell, Menu } from 'lucide-react';

import { useUserStore } from '@/store/user.store';

import DashboardProfileMenu from './DashboardProfileMenu';

interface Props {
  onOpenSidebar: () => void;
}

function DashboardHeaderComponent({ onOpenSidebar }: Props) {
  const profile = useUserStore((state) => state.profile);

  const hydrated = useUserStore((state) => state.hydrated);

  if (!hydrated) {
    return (
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="flex-1" />

        <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-100" />
      </header>
    );
  }

  const isRider = profile?.role === 'ROLE_RIDER';

  const notifCount = isRider ? 3 : 2;

  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4">
      <button onClick={onOpenSidebar} className="lg:hidden">
        <Menu size={24} className="text-[var(--heading)]" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-[var(--text)] hover:bg-gray-50">
          <Bell size={20} />

          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
            {notifCount}
          </span>
        </button>

        <DashboardProfileMenu user={profile} isRider={isRider} />
      </div>
    </header>
  );
}

const DashboardHeader = memo(DashboardHeaderComponent);

export default DashboardHeader;
