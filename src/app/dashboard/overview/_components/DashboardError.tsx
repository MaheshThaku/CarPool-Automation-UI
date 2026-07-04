// app/dashboard/overview/_components/DashboardError.tsx

import SectionError from './shared/SectionError';

interface Props {
  message: string;
  onRetry?: () => void;
}

export default function DashboardError({ message, onRetry }: Props) {
  return <SectionError message={message} onRetry={onRetry} />;
}
