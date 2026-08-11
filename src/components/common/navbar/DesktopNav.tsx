'use client';

import Link from 'next/link';

import { CurrentUser } from '@/hooks/useCurrentUser';

import { getVisibleNavLinks } from './navbar.data';

interface Props {
  user: CurrentUser | null;
}

export default function DesktopNav({ user }: Props) {
  return (
    <div className="hidden items-center gap-10 lg:flex">
      {getVisibleNavLinks(user?.role).map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="group relative text-[15px] font-semibold text-[var(--heading)] transition-all duration-300 hover:text-[var(--primary-hover)]"
        >
          {item.label}

          <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-[var(--primary)] transition-all duration-300 group-hover:w-full" />
        </Link>
      ))}
    </div>
  );
}
