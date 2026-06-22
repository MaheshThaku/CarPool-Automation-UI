import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function SafetyHighlight() {
  return (
    <div
      className="h-full rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--primary)]/5 to-transparent p-8"
    >
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]"
      >
        <ShieldCheck
          size={32}
          className="text-white"
        />
      </div>

      <h3
        className="text-2xl font-bold text-[var(--heading)]"
      >
        Your Safety Comes First
      </h3>

      <p
        className="mt-4 leading-relaxed text-[var(--text-light)]"
      >
        Every ride on ShareFare is backed by
        verified users, secure profiles,
        emergency support and trusted
        community standards.
      </p>

      <button
        className="mt-6 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--primary-hover)]"
      >
        Learn More
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
