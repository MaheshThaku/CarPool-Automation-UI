'use client';

import { memo } from 'react';
import { Car, ShieldCheck, FileCheck } from 'lucide-react';

function VehicleInfoSectionComponent() {
  const guidelines = [
    {
      icon: Car,
      title: 'Accurate Vehicle Details',
      description:
        'Keep your vehicle model, registration number and specifications up to date.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Vehicles',
      description:
        'Verified vehicle information increases passenger trust and booking confidence.',
    },
    {
      icon: FileCheck,
      title: 'Valid Documents',
      description:
        'Ensure RC, insurance and other required documents remain active and valid.',
    },
  ];

  return (
    <section
      aria-labelledby="vehicle-guidelines"
      className="rounded-2xl border border-[var(--border)] bg-white p-5"
    >
      {/* Header */}

      <div className="mb-4">
        <h2
          id="vehicle-guidelines"
          className="font-semibold text-[var(--heading)]"
        >
          Vehicle Guidelines
        </h2>
      </div>

      {/* Guidelines */}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {guidelines.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex items-start gap-3 rounded-xl bg-[var(--background)] p-4"
            >
              <Icon
                size={18}
                className="mt-0.5 shrink-0 text-[var(--primary)]"
              />

              <div>
                <h3 className="text-sm font-semibold text-[var(--heading)]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-[var(--text-light)]">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const VehicleInfoSection = memo(VehicleInfoSectionComponent);

export default VehicleInfoSection;
