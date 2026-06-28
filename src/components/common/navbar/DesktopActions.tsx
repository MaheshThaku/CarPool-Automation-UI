'use client';

import Link from 'next/link';

import { CurrentUser } from '@/hooks/useCurrentUser';

import UserProfileButton from './UserProfileButton';

interface Props {
  user: CurrentUser | null;
}

export default function DesktopActions({ user }: Props) {
  if (user) {
    return (
      <div className="hidden lg:flex">
        <UserProfileButton user={user} />
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-3 lg:flex">
      <Link
        href="/auth/login"
        className="rounded-xl border border-[var(--heading)]/20 bg-[var(--heading)]/20 px-5 py-2.5 text-sm font-medium text-[var(--heading)] backdrop-blur-md transition-all duration-300 hover:border-[var(--primary)] hover:bg-[var(--primary)]/20 hover:text-white"
      >
        Login
      </Link>

      <Link
        href="/auth/register"
        className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-[var(--primary-hover)]"
      >
        Sign Up
      </Link>
    </div>
  );
}
