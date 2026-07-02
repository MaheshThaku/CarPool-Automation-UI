'use client';

import { memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';

import Logo from '@/components/common/navbar/Logo';
import { deleteCookie } from '@/lib/cookies';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import SidebarNav from './SidebarNav';

import { RIDER_NAV, PASSENGER_NAV, NavItem } from '../_constants/navigation';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface SidebarContentProps {
  navItems: NavItem[];
  pathname: string;
  onLinkClick: () => void;
  onLogout: () => void;
}

const SidebarContent = memo(function SidebarContent({
  navItems,
  pathname,
  onLinkClick,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex h-19 items-center border-b border-[var(--border)]">
        <Logo clickable={false} size="lg" />
      </div>

      {/* Navigation */}
      <SidebarNav
        navItems={navItems}
        pathname={pathname}
        onLinkClick={onLinkClick}
      />

      {/* Logout */}
      <div className="border-t border-[var(--border)] p-2">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
});

function DashboardSidebarComponent({ sidebarOpen, setSidebarOpen }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();

  const isRider = user?.role === 'ROLE_RIDER';

  const navItems = isRider ? RIDER_NAV : PASSENGER_NAV;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch {
      // ignore
    }

    deleteCookie('user');
    deleteCookie('tokenExpiry');

    router.replace('/auth/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-[240px] shrink-0 border-r border-[var(--border)] lg:block">
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          onLinkClick={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="absolute top-0 left-0 h-full w-[240px] border-r border-[var(--border)] shadow-xl">
            <SidebarContent
              navItems={navItems}
              pathname={pathname}
              onLinkClick={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </aside>

          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 rounded-full bg-white p-2 shadow-md"
          >
            <X size={18} className="text-[var(--heading)]" />
          </button>
        </div>
      )}
    </>
  );
}

const DashboardSidebar = memo(DashboardSidebarComponent);

export default DashboardSidebar;
