'use client';

import Link from 'next/link';

import { X } from 'lucide-react';

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
        {/* Header */}

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--heading)]">Menu</h3>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[var(--background)]"
          >
            <X size={18} />
          </button>
        </div>

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
              className="flex items-center gap-3 rounded-2xl bg-[var(--primary)] px-4 py-3.5 font-medium text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                {user.firstName.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-semibold">{user.firstName}</p>

                <p className="text-xs text-white/80">Go To Dashboard</p>
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
