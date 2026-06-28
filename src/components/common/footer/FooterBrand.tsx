import Link from 'next/link';

import Logo from '../navbar/Logo';

import { socialLinks } from './footer.data';

export default function FooterBrand() {
  return (
    <div>
      <Logo />

      <p className="mt-6 max-w-md leading-8 text-[var(--text)]">
        India&apos;s trusted ride sharing platform connecting verified
        passengers and drivers for affordable, safe and sustainable travel
        across cities.
      </p>

      <div className="mt-8">
        <p className="mb-4 text-sm font-semibold tracking-wider text-[var(--text-light)] uppercase">
          Follow Us
        </p>

        <div className="flex items-center gap-3">
          {socialLinks.map((social) => {
            const Icon = social.icon;

            return (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-2 hover:rotate-6 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white hover:shadow-xl"
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
