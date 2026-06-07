"use client";

import {
  Car,
  CircleCheckBig,
  User,
} from "lucide-react";

import { UserRole } from "@/types/auth.types";

interface RoleSelectorProps {
  value?: UserRole;
  onChange: (value: UserRole) => void;
}

const roles = [
  {
    value: "ROLE_PASSENGER" as const,
    title: "Passenger",
    description:
      "Book rides and travel affordably",
    icon: User,
  },
  {
    value: "ROLE_RIDER" as const,
    title: "Rider",
    description:
      "Offer rides and earn money",
    icon: Car,
  },
];

export default function RoleSelector({
  value,
  onChange,
}: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map((role) => {
        const Icon = role.icon;
        const active =
          value === role.value;

        return (
          <button
            key={role.value}
            type="button"
            onClick={() =>
              onChange(role.value)
            }
            className={`
              relative

              flex
              items-center
              gap-4

              rounded-2xl
              border

              p-5

              text-left

              transition-all

              ${
                active
                  ? "border-[var(--primary)] bg-[var(--primary-light)]"
                  : "border-[var(--border)] bg-white"
              }
            `}
          >
            {active && (
              <CircleCheckBig
                size={20}
                className="
                  absolute
                  right-4
                  top-4

                  text-[var(--primary)]
                "
              />
            )}

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-full

                bg-white
              "
            >
              <Icon
                size={24}
                className={
                  active
                    ? "text-[var(--primary)]"
                    : "text-[var(--text)]"
                }
              />
            </div>

            <div>
              <h3
                className="
                  text-lg
                  font-semibold
                  text-[var(--heading)]
                "
              >
                {role.title}
              </h3>

              <p
                className="
                  mt-1
                  max-w-[150px]

                  text-sm
                  text-[var(--text)]
                "
              >
                {role.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}