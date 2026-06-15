import { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export default function WhyUsFeature({
  title,
  description,
  icon: Icon,
}: Props) {
  return (
    <div className="group flex flex-col items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-5 py-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[var(--primary)] hover:shadow-xl">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 transition-all duration-300 group-hover:bg-[var(--primary)]">
        <Icon
          size={30}
          className="text-[var(--primary)] transition-colors group-hover:text-white"
        />
      </div>

      <h3 className="text-base font-bold text-[var(--heading)]">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-[var(--text-light)]">
        {description}
      </p>
    </div>
  );
}
