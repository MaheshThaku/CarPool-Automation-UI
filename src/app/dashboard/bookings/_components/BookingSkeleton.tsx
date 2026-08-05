export default function BookingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      <div className="h-1 bg-gray-200" />
      <div className="space-y-3 p-4">
        {/* Header: icon + route lines + status pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-gray-100" />
            <div className="space-y-2">
              <div className="h-4 w-44 rounded-lg bg-gray-100" />
              <div className="h-3 w-28 rounded-lg bg-gray-100" />
            </div>
          </div>
          <div className="h-6 w-20 shrink-0 rounded-full bg-gray-100" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-gray-100" />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-100" />

        {/* Driver + vehicle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gray-100" />
            <div className="space-y-2">
              <div className="h-3 w-24 rounded-lg bg-gray-100" />
              <div className="h-3 w-32 rounded-lg bg-gray-100" />
            </div>
          </div>
          <div className="h-8 w-28 rounded-lg bg-gray-100" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="h-3 w-24 rounded-lg bg-gray-100" />
          <div className="h-8 w-24 rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
