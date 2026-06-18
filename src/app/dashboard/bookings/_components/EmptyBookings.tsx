import Link from "next/link";
import { BookOpen, Search } from "lucide-react";

interface EmptyBookingsProps {
  filtered: boolean;
}

export default function EmptyBookings({ filtered }: EmptyBookingsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
        <BookOpen size={28} className="text-[var(--primary)]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--heading)]">
        {filtered ? "No bookings found" : "No bookings yet"}
      </h3>
      <p className="mt-1.5 max-w-xs text-sm text-[var(--text)]">
        {filtered
          ? "Try adjusting your filters or search query."
          : "You haven't booked any rides yet. Find a ride and start your journey!"}
      </p>
      {!filtered && (
        <Link
          href="/dashboard/rides"
          className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          <Search size={15} /> Find a Ride
        </Link>
      )}
    </div>
  );
}
