'use client';

import { forwardRef, useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/cn';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
  suffix?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(
  (
    { label, icon: Icon, error, required, className, type, suffix, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-2 block text-sm font-semibold text-[var(--heading)]"
          >
            {label}

            {required && <span className="ml-1 text-[var(--error)]">*</span>}
          </label>
        )}

        <div
          className={cn(
            `flex h-[62px] items-center rounded-xl border bg-[var(--surface)] px-4 transition-all duration-200 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/10`,
            error ? 'border-[var(--error)]' : 'border-[var(--border)]',
          )}
        >
          {Icon && (
            <Icon
              size={22}
              className="mr-3 shrink-0 text-[var(--text-light)]"
            />
          )}

          <input
            ref={ref}
            type={inputType}
            className={cn(
              `w-full bg-transparent text-base text-[var(--heading)] outline-none placeholder:text-[var(--text-light)] disabled:cursor-not-allowed disabled:opacity-60`,
              className,
            )}
            {...props}
          />

          {suffix && (
            <div className="ml-2 flex shrink-0 items-center">{suffix}</div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 shrink-0 text-[var(--text-light)] transition-colors hover:text-[var(--heading)] focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {error && (
          <p
            className="mt-1.5 text-xs font-medium text-[var(--error)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
