'use client';

import { memo, useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronDown, LogOut, User } from 'lucide-react';

import { cn } from '@/lib/cn';
import { deleteCookie } from '@/lib/cookies';

import { CurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  user: CurrentUser | null;
  isRider: boolean;
}

function DashboardProfileMenuComponent({ user, isRider }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1 transition-all hover:bg-gray-50"
      >
        {/* Avatar */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary)] text-sm font-bold text-white">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.firstName}
              className="h-full w-full object-cover"
            />
          ) : (
            (user?.firstName?.charAt(0).toUpperCase() ?? 'U')
          )}
        </div>

        {/* Name */}

        <div className="hidden sm:block">
          <p className="text-sm leading-tight font-semibold text-[var(--heading)]">
            {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
          </p>

          <p className="text-xs text-[var(--text-light)]">
            {isRider ? 'Rider' : 'Passenger'}
          </p>
        </div>

        <ChevronDown
          size={15}
          className={cn(
            'hidden text-[var(--text-light)] transition-transform sm:block',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-lg">
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-sm text-[var(--text)] hover:bg-gray-50"
          >
            <User size={15} className="text-[var(--text-light)]" />
            Profile
          </Link>

          <div className="border-t border-[var(--border)]" />

          <button
            onClick={() => {
              setOpen(false);

              handleLogout();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const DashboardProfileMenu = memo(DashboardProfileMenuComponent);

export default DashboardProfileMenu;
