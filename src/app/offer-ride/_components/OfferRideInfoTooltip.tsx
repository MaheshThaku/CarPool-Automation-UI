'use client';

/**
 * OfferRideInfoTooltip
 *
 * A small (ℹ) icon button fixed near the top-right of the offer-ride page.
 * On hover / click it expands to show the six rider verification requirements.
 *
 * This is purely informational — no API call is made.
 */

import { useState } from 'react';
import {
  Info,
  X,
  CheckCircle2,
  Mail,
  Phone,
  CreditCard,
  Car,
  ShieldCheck,
  FileText,
} from 'lucide-react';

const REQUIREMENTS = [
  {
    icon: Mail,
    label: 'Email Verified',
    desc: 'A confirmed email address on your account.',
  },
  {
    icon: Phone,
    label: 'Phone Verified',
    desc: 'Your mobile number verified via OTP.',
  },
  {
    icon: CreditCard,
    label: 'Driving License',
    desc: 'Valid, government-issued driving license.',
  },
  {
    icon: Car,
    label: 'Vehicle RC',
    desc: 'Registration certificate of the vehicle you will use.',
  },
  {
    icon: ShieldCheck,
    label: 'Vehicle Insurance',
    desc: 'Comprehensive insurance policy for your vehicle.',
  },
  {
    icon: FileText,
    label: 'Government ID',
    desc: 'Aadhaar card, PAN card, or passport.',
  },
] as const;

export default function OfferRideInfoTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* (ℹ) Trigger button — fixed at top-right below navbar */}
      <div className="fixed right-5 top-20 z-40">
        <button
          type="button"
          id="offer-ride-requirements-btn"
          aria-label="What you need to offer rides"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="group flex items-center gap-2 rounded-full border border-[var(--primary)] bg-white px-3 py-2 text-xs font-semibold text-[var(--primary)] shadow-md transition-all hover:bg-[var(--primary)] hover:text-white"
        >
          <Info size={14} className="shrink-0" />
          <span className="hidden sm:inline">What you need</span>
        </button>

        {/* Dropdown popover */}
        {open && (
          <div
            role="tooltip"
            className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl"
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--heading)]">
                  Requirements to Offer Rides
                </h3>
                <p className="mt-0.5 text-[11px] text-[var(--text-light)]">
                  All 6 must be verified before you can publish.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            </div>

            {/* Requirements list */}
            <ul className="space-y-2.5">
              {REQUIREMENTS.map(({ icon: Icon, label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--heading)]">
                      {label}
                    </p>
                    <p className="text-[11px] text-[var(--text-light)]">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-4 border-t border-[var(--border)] pt-3">
              <p className="text-[11px] text-[var(--text-light)]">
                Already have an account?{' '}
                <a
                  href="/auth/login"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Log in →
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
