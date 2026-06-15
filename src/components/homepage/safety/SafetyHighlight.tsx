import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function SafetyHighlight() {
  return (
    <div className="flex h-full flex-col justify-center rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--surface)] to-[var(--background)] p-8">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
        <ShieldCheck size={34} className="text-[var(--primary)]" />
      </div>

      <h3 className="text-2xl font-bold text-[var(--heading)]">
        Your Safety Comes First
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-[var(--text-light)]">
        Every ride is protected through identity verification, live ride
        tracking, emergency support and trusted community reviews.
      </p>

      <button className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
        Learn More
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
