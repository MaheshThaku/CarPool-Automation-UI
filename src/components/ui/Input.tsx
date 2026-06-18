"use client";

import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<
  HTMLInputElement,
  Props
>(
  (
    {
      label,
      icon: Icon,
      error,
      required,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-2 block text-sm font-semibold text-[var(--heading)]"
          >
            {label}

            {required && (
              <span className="ml-1 text-[var(--error)]">
                *
              </span>
            )}
          </label>
        )}

        <div
          className={cn(
            `
              flex
              h-[62px]
              items-center

              rounded-xl
              border

              bg-[var(--surface)]

              px-4

              transition-all
              duration-200

              focus-within:border-[var(--primary)]
              focus-within:ring-2
              focus-within:ring-[var(--primary)]/10
            `,
            error
              ? "border-[var(--error)]"
              : "border-[var(--border)]"
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
            className={cn(
              `
                w-full

                bg-transparent

                text-base
                text-[var(--heading)]

                outline-none

                placeholder:text-[var(--text-light)]

                disabled:cursor-not-allowed
                disabled:opacity-60
              `,
              className
            )}
            {...props}
          />
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
  }
);

Input.displayName = "Input";

export default Input;