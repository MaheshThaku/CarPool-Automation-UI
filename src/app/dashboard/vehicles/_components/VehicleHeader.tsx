'use client';

import { Plus } from 'lucide-react';

interface Props {
  atLimit: boolean;
  onAdd: () => void;
}

export default function VehiclesHeader({ atLimit, onAdd }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--heading)]">
            Manage Vehicles
          </h2>

          <p className="mt-1 text-sm text-[var(--text)]">
            Add and manage the vehicles you drive for rides.
          </p>
        </div>

        {!atLimit && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            <Plus size={16} />
            Add Vehicle
          </button>
        )}
      </div>
    </>
  );
}
