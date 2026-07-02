'use client';

import { memo } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/cn';

import { NavItem } from '../_constants/navigation';
import { getActiveHref } from '../_utils/getActiveHref';

interface Props {
  navItems: NavItem[];
  pathname: string;
  onLinkClick?: () => void;
}

function SidebarNavComponent({ navItems, pathname, onLinkClick }: Props) {
  const activeHref = getActiveHref(navItems, pathname);

  return (
    <nav className="flex-1 space-y-0.5 p-3">
      {navItems.map((item) => {
        const Icon = item.icon;

        const active = activeHref === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
              active
                ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                : 'text-[var(--text)] hover:bg-gray-50 hover:text-[var(--heading)]',
            )}
          >
            <Icon size={18} />

            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const SidebarNav = memo(SidebarNavComponent);

export default SidebarNav;
