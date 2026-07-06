import { StatsCardSkeleton, Skeleton } from './shared/Skeleton';

export default function DashboardLoader() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-3xl" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <StatsCardSkeleton key={item} />
        ))}
      </div>

      <Skeleton className="h-72 w-full" />

      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    </div>
  );
}
