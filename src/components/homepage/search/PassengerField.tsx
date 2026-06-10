"use client";

import { Users } from "lucide-react";

export default function PassengerField() {
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
        Passengers
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
        <Users
          size={18}
          className="text-[var(--primary)]"
        />

        <select
          className="
            w-full
            bg-transparent
            text-[var(--heading)]
            outline-none
          "
        >
          <option>1 Passenger</option>
          <option>2 Passengers</option>
          <option>3 Passengers</option>
          <option>4 Passengers</option>
        </select>
      </div>
    </div>
  );
}