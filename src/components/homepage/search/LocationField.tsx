"use client";

import { MapPin } from "lucide-react";

interface Props {
  label: string;
  placeholder: string;
}

export default function LocationField({
  label,
  placeholder,
}: Props) {
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
        {label}
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
        <MapPin
          size={18}
          className="text-[var(--primary)]"
        />

        <input
          type="text"
          placeholder={placeholder}
          className="
            w-full
            bg-transparent
            text-[var(--heading)]
            outline-none
            placeholder:text-[var(--text-light)]
          "
        />
      </div>
    </div>
  );
}