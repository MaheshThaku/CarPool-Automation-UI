'use client';

import Link from 'next/link';

import { navLinks } from './navbar.data';

export default function DesktopNav() {
  return (
    <div className="hidden items-center gap-8 lg:flex">
      {navLinks.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="relative text-sm font-medium text-[var(--heading)] transition-colors duration-300 hover:text-[var(--primary)]"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
