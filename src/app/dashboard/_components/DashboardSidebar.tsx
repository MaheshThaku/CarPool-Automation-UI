'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

import Logo from '@/components/common/navbar/Logo';
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
}

const SidebarContent = memo(function SidebarContent({
  navItems,
  pathname,
  onLinkClick,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex h-17 shrink-0 items-center border-b border-[var(--border)] px-5">
        <Logo clickable={true} size="lg" />
      </div>

      {/* Navigation */}
      <SidebarNav
        navItems={navItems}
        pathname={pathname}
        onLinkClick={onLinkClick}
      />
    </div>
  );
});

function DashboardSidebarComponent({ sidebarOpen, setSidebarOpen }: Props) {
  const pathname = usePathname();
  const user = useCurrentUser();

  const isRider = user?.role === 'ROLE_RIDER';

  const navItems = isRider ? RIDER_NAV : PASSENGER_NAV;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-[240px] shrink-0 border-r border-[var(--border)] lg:block">
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          onLinkClick={() => {}}
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
