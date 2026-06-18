export default function BookingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
      <div className="h-1 bg-gray-200" />
      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-44 rounded-lg bg-gray-100" />
            <div className="h-3 w-24 rounded-lg bg-gray-100" />
          </div>
          <div className="h-6 w-20 rounded-full bg-gray-100 shrink-0" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gray-100" />
            <div className="h-3 w-20 rounded-lg bg-gray-100" />
          </div>
          <div className="h-7 w-24 rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
