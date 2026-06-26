import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SafetyHighlight() {
  return (
    <div className="h-full rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--primary)]/5 to-transparent p-8">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]">
        <ShieldCheck size={32} className="text-white" />
      </div>
      <h3 className="text-2xl font-bold text-[var(--heading)]">
        Your Safety Comes First
      </h3>
      <p className="mt-4 leading-relaxed text-[var(--text-light)]">
        Every ride on ShareFare is backed by verified users, secure profiles,
        emergency support and trusted community standards.
      </p>

      <Link
        href="/safety"
        className="mt-8 inline-flex rounded-xl border border-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white"
      >
        Learn More →
      </Link>
    </div>
  );
}
