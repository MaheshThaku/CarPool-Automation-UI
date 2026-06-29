'use client';

import { memo } from 'react';

import { HOW_IT_WORKS_STEPS } from './howItWorks.data';

function HowItWorksComponent() {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-white p-6">
      <h2 className="text-2xl font-bold text-[var(--heading)]">How it works</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map(({ icon: Icon, title, description }, index) => (
          <div key={title} className="flex items-start gap-4">
            {/* Icon */}

            <div className="relative shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                <Icon size={20} />
              </div>

              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-white text-[10px] font-semibold text-[var(--primary)] shadow-sm">
                {index + 1}
              </div>
            </div>

            {/* Content */}

            <div>
              <h3 className="text-lg font-semibold text-[var(--heading)]">
                {title}
              </h3>

              <p className="mt-1 text-sm leading-6 text-[var(--text-light)]">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(HowItWorksComponent);
