'use client';

import { memo } from 'react';
import { Car, Plus } from 'lucide-react';

interface Props {
  onAdd: () => void;
}

function EmptyVehiclesStateComponent({ onAdd }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white">
      <div className="flex flex-col items-center px-6 py-14 text-center sm:px-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Car size={28} className="text-gray-400" />
        </div>

        <h3 className="mt-5 text-xl font-semibold text-[var(--heading)]">
          No Vehicles Added Yet
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-light)]">
          Add your vehicle to start offering rides. Passengers will see your
          vehicle details when booking a trip.
        </p>

        <button
          onClick={onAdd}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>
    </div>
  );
}

const EmptyVehiclesState = memo(EmptyVehiclesStateComponent);

export default EmptyVehiclesState;
