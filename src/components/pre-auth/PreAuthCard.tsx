import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  features: string[];
};

export default function PreAuthCard({ title, description, features }: Props) {
  return (
    <section className="flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-xl rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl">
        <h2 className="text-4xl font-bold text-[var(--heading)]">{title}</h2>

        <p className="mt-4 text-[var(--text)]">{description}</p>

        <ul className="mt-8 space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />

              <span className="text-[var(--text)]">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 space-y-4">
          <Link
            href="/auth/login"
            className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] font-semibold text-white transition-all hover:bg-[var(--primary-hover)]"
          >
            Login
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/auth/register"
            className="flex h-14 items-center justify-center rounded-xl border border-[var(--border)] font-semibold text-[var(--heading)]"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
