'use client';

import { memo } from 'react';

import { Shield, MapPin, Phone } from 'lucide-react';

import DashboardCard from '../shared/DashboardCard';

function SafetySectionComponent() {
  const items = [
    {
      icon: Shield,
      title: 'Verified Drivers',
      description: 'All our drivers are verified and trusted',
    },

    {
      icon: MapPin,
      title: 'Live Trip Tracking',
      description: 'Share your trip with family and friends',
    },

    {
      icon: Phone,
      title: 'Emergency Support',
      description: '24/7 support for any travel assistance',
    },
  ];

  return (
    <DashboardCard className="h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-[var(--heading)]">
          Safety First, Always
        </h3>
      </div>

      <div className="space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)]">
                <Icon size={18} className="text-[var(--primary)]" />
              </div>

              <div>
                <h4 className="text-base font-semibold text-[var(--heading)]">
                  {item.title}
                </h4>

                <p className="mt-1 text-sm text-[var(--text-light)]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}

const SafetySection = memo(SafetySectionComponent);

export default SafetySection;
