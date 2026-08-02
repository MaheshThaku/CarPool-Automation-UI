'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { Bell, Menu } from 'lucide-react';

import { useUserStore } from '@/store/user.store';

import DashboardProfileMenu from './DashboardProfileMenu';

import { useNotificationStore } from '../notification/notification.store';
import NotificationDropdown from '../notification/NotificationDropdown';


interface Props {
  onOpenSidebar: () => void;
}

function DashboardHeaderComponent({ onOpenSidebar }: Props) {

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const bellRef = useRef<HTMLButtonElement>(null);

  const profile = useUserStore((state) => state.profile);

  const hydrated = useUserStore((state) => state.hydrated);

  const isRider = profile?.role === 'ROLE_RIDER';

  // const notifCount = isRider ? 3 : 2;
  const unreadCount = useNotificationStore(
    (state) => state.unreadCount,
  );

  // Close the popup on outside click or Escape, only while it is open.
  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        bellRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (!hydrated) {
    return (
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="flex-1" />

        <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-100" />
      </header>
    );
  }



  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4">
      <button onClick={onOpenSidebar} className="lg:hidden">
        <Menu size={24} className="text-[var(--heading)]" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <div ref={containerRef} className="relative">
          <button
            ref={bellRef}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-haspopup="true"
            aria-expanded={open}
            className="relative rounded-full p-2 hover:bg-gray-50"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown open={open} />
        </div>

        <DashboardProfileMenu
          user={profile}
          isRider={isRider}
        />
      </div>
    </header>
  );
}

const DashboardHeader = memo(DashboardHeaderComponent);

export default DashboardHeader;
