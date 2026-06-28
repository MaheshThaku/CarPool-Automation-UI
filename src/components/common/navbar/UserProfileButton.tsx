'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { CurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  user: CurrentUser;
}

export default function UserProfileButton({ user }: Props) {
  const [imageError, setImageError] = useState(false);

  const roleLabel =
    user.role === 'ROLE_ADMIN'
      ? 'Admin'
      : user.role === 'ROLE_RIDER'
        ? 'Rider'
        : 'Passenger';

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

  return (
    <Link
      href="/dashboard/overview"
      className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2 transition-all duration-300 hover:border-[var(--border)] hover:bg-white/70"
    >
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[var(--primary-light)] shadow-md">
        {user.avatarUrl && !imageError ? (
          <Image
            src={user.avatarUrl}
            alt={fullName}
            fill
            sizes="44px"
            unoptimized
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--primary)] text-sm font-semibold text-white">
            {user.firstName?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
        )}
      </div>

      <div className="hidden min-w-0 xl:block">
        <p className="truncate text-sm font-semibold text-[var(--heading)]">
          {fullName}
        </p>

        <p className="text-xs font-medium text-[var(--text-light)]">
          {roleLabel}
        </p>
      </div>

      <ChevronDown
        size={16}
        className="hidden text-[var(--text-light)] transition-transform duration-300 group-hover:rotate-180 xl:block"
      />
    </Link>
  );
}
