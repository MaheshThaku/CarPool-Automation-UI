'use client';

import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
  password: string;
}

export default function PasswordStrength({ password }: Props) {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(rules).filter(Boolean).length;

  const getStrength = () => {
    if (score <= 2)
      return {
        label: 'Weak',
        color: 'bg-red-500',
        text: 'text-red-500',
      };

    if (score <= 4)
      return {
        label: 'Medium',
        color: 'bg-amber-500',
        text: 'text-amber-500',
      };

    return {
      label: 'Strong',
      color: 'bg-green-500',
      text: 'text-green-500',
    };
  };

  const strength = getStrength();

  const items = [
    {
      valid: rules.length,
      label: 'At least 8 characters long',
    },
    {
      valid: rules.uppercase && rules.lowercase,
      label: 'Include uppercase & lowercase letters',
    },
    {
      valid: rules.number,
      label: 'Include a number (0-9)',
    },
    {
      valid: rules.special,
      label: 'Include a special character (!@#$%^&*)',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Strength Text */}

      {/* <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--text)]">
          Password Strength:
        </span>

        <span
          className={`font-semibold ${strength.text}`}
        >
          {strength.label}
        </span>
      </div> */}

      {/* Progress Bar */}

      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={`h-1.5 rounded-full ${
              score >= segment ? strength.color : 'bg-gray-200'
            } `}
          />
        ))}
      </div>

      {/* Rules */}

      <div
        className="grid gap-2 sm:grid-cols-2"
      >
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-2"
          >
            {item.valid ? (
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-green-500"
                className="mt-0.5 shrink-0 text-green-500"
              />
            ) : (
              <Circle
                size={16}
                className="mt-0.5 shrink-0 text-gray-400"
              />
            )}

            <span
              className="text-xs text-[var(--text)]"
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
