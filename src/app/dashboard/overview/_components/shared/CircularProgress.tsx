// app/dashboard/overview/_components/shared/CircularProgress.tsx

import { memo, useMemo } from 'react';

interface Props {
  percentage: number;
}

function CircularProgressComponent({ percentage }: Props) {
  const radius = 34;

  const circumference = 2 * Math.PI * radius;

  const dashOffset = useMemo(
    () => circumference - (percentage / 100) * circumference,
    [percentage, circumference],
  );

  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className="shrink-0"
      role="img"
      aria-label={`${percentage}% completed`}
    >
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="8"
      />

      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="#d89a33"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 40 40)"
      />

      <text
        x="40"
        y="45"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#111827"
      >
        {percentage}%
      </text>
    </svg>
  );
}

const CircularProgress = memo(CircularProgressComponent);

export default CircularProgress;
