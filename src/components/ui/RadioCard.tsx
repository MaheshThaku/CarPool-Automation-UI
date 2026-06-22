import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function RadioCard({
  title,
  subtitle,
  icon,
  active,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        `flex h-[96px] w-full items-center gap-4 rounded-2xl border px-6 transition-all`,
        active ? 'border-[#D89B2B] bg-[#FFF8EE]' : 'border-[#E5E7EB] bg-white',
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F5EF]">
        {icon}
      </div>

      <div className="text-left">
        <h3 className="text-xl font-semibold text-[#111827]">{title}</h3>

        <p className="text-sm text-[#6B7280]">{subtitle}</p>
      </div>
    </button>
  );
}
