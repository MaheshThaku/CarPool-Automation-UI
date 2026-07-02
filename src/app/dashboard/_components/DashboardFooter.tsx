'use client';

import { memo } from 'react';
import { ShieldCheck, Users, BadgeCheck } from 'lucide-react';

function DashboardFooterComponent() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}

        <div>
          <p className="text-sm font-medium text-[var(--heading)]">
            © {new Date().getFullYear()} ShareFare
          </p>

          <p className="text-xs text-[var(--text-light)]">
            All rights reserved.
          </p>
        </div>

        {/* Right */}

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 transition-colors hover:border-[var(--primary)]">
            <BadgeCheck size={14} className="text-[var(--primary)]" />
            <span className="text-xs font-medium text-[var(--text)]">
              Version 1.0.0
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 transition-colors hover:border-[var(--primary)]">
            <ShieldCheck size={14} className="text-[var(--primary)]" />
            <span className="text-xs font-medium text-[var(--text)]">
              Secure Platform
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 transition-colors hover:border-[var(--primary)]">
            <Users size={14} className="text-[var(--primary)]" />
            <span className="text-xs font-medium text-[var(--text)]">
              Verified Community
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const DashboardFooter = memo(DashboardFooterComponent);

export default DashboardFooter;
