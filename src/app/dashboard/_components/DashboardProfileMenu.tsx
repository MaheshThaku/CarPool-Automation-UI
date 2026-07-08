'use client';

import { memo, useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronDown, LogOut, User } from 'lucide-react';

import { cn } from '@/lib/cn';
import { deleteCookie } from '@/lib/cookies';

import { ProfileData } from '@/types/profile.types';

import { useUserStore } from '@/store/user.store';

interface Props {
  user: ProfileData | null;
  isRider: boolean;
}

function DashboardProfileMenuComponent({ user }: Props) {
  const router = useRouter();

  const clearProfile = useUserStore((state) => state.clearProfile);

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

    clearProfile();

    deleteCookie('user');
    deleteCookie('token');
    deleteCookie('tokenExpiry');

    router.replace('/auth/login');
  };

  /**
   * Prevent:
   * Profile / Passenger flash
   * during hydration.
   */
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />

        <div className="hidden space-y-1 sm:block">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />

          <div className="h-2.5 w-16 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  const avatar = user.profilePictureUrl ?? user.avatarUrl;

  const initials = (user.firstName?.[0] ?? 'U').toUpperCase();

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const roleLabel = user.role === 'ROLE_RIDER' ? 'Rider' : 'Passenger';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-xl px-2 py-1 transition-colors hover:bg-[var(--primary-light)]"
      >
        {/* Avatar */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary)] font-semibold text-white">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* User Info */}

        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-[var(--heading)]">
            {fullName}
          </p>

          <p className="text-xs text-[var(--text-light)]">{roleLabel}</p>
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
        <div className="absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-xl">
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text)] transition-colors hover:bg-[var(--primary-light)]"
          >
            <User size={15} className="text-[var(--primary)]" />
            Profile
          </Link>

          <div className="border-t border-[var(--border)]" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
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
