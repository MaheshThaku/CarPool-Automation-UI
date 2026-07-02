'use client';

import { memo } from 'react';

import { Bell, Menu } from 'lucide-react';

import { useCurrentUser } from '@/hooks/useCurrentUser';

import DashboardProfileMenu from './DashboardProfileMenu';

interface Props {
  onOpenSidebar: () => void;
}

function DashboardHeaderComponent({ onOpenSidebar }: Props) {
  const user = useCurrentUser();

  const isRider = user?.role === 'ROLE_RIDER';

  const notifCount = isRider ? 3 : 2;

  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4">
      {/* Mobile Menu */}

      <button onClick={onOpenSidebar} className="lg:hidden">
        <Menu size={24} className="text-[var(--heading)]" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Notifications */}

        <button className="relative rounded-full p-2 text-[var(--text)] hover:bg-gray-50">
          <Bell size={20} />

          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
            {notifCount}
          </span>
        </button>

        {/* Profile */}

        <DashboardProfileMenu user={user} isRider={isRider} />
      </div>
    </header>
  );
}

const DashboardHeader = memo(DashboardHeaderComponent);

export default DashboardHeader;
