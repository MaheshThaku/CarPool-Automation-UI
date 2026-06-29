'use client';

import Link from 'next/link';

import { CurrentUser } from '@/hooks/useCurrentUser';

import { navLinks } from './navbar.data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: CurrentUser | null;
}

export default function MobileMenu({ isOpen, onClose, user }: Props) {
  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 absolute inset-x-4 top-[88px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl lg:hidden">
      <div className="p-5">
        {/* Navigation */}

        <div className="space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center rounded-2xl px-4 py-3.5 text-sm font-medium text-[var(--heading)] transition-all duration-300 hover:bg-[var(--background)] hover:text-[var(--primary)]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Divider */}

        <div className="my-5 h-px bg-[var(--border)]" />

        {/* User Actions */}

        {user ? (
          <div className="space-y-3">
            <Link
              href="/dashboard/overview"
              onClick={onClose}
              className="flex items-center justify-between rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-light)] p-4 transition-all duration-300 hover:border-[var(--primary)]"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-base font-bold text-white shadow-md">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}

                <div>
                  <p className="font-semibold text-[var(--heading)]">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="text-xs text-[var(--text-light)]">
                    {user.role === 'ROLE_ADMIN'
                      ? 'Admin'
                      : user.role === 'ROLE_RIDER'
                        ? 'Rider'
                        : 'Passenger'}
                  </p>
                </div>
              </div>

              {/* Dashboard CTA */}

              <div className="rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white">
                Dashboard
              </div>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/auth/login"
              onClick={onClose}
              className="flex h-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--heading)] transition-all duration-300 hover:border-[var(--primary)]"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              onClick={onClose}
              className="flex h-12 items-center justify-center rounded-2xl bg-[var(--primary)] font-medium text-white transition-all duration-300 hover:bg-[var(--primary-hover)]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
