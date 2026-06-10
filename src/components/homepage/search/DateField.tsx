"use client";

import { Calendar } from "lucide-react";

export default function DateField() {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-[var(--text-light)]
        "
      >
        Date
      </label>

      <div
        className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-4
          py-4
        "
      >
        <Calendar
          size={18}
          className="text-[var(--primary)]"
        />

        <input
          type="date"
          className="
            w-full
            bg-transparent
            text-[var(--heading)]
            outline-none
          "
        />
      </div>
    </div>
  );
}