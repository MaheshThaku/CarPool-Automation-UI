import Link from "next/link";
import { Car } from "lucide-react";

export default function NoVehicleState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-[var(--border)] bg-white p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
        <Car size={26} className="text-amber-500" />
      </div>
      <h3 className="mt-4 font-semibold text-[var(--heading)]">Add a vehicle first</h3>
      <p className="mt-1.5 text-sm text-[var(--text-light)]">
        You need to add your vehicle details before you can publish a ride, so passengers know what
        they&apos;re riding in.
      </p>
      <Link
        href="/dashboard/vehicles"
        className="mt-5 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
      >
        Add a Vehicle
      </Link>
    </div>
  );
}
