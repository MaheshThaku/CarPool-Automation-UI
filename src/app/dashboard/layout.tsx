'use client';

import { useState } from 'react';

import DashboardSidebar from './_components/DashboardSidebar';
import DashboardHeader from './_components/DashboardHeader';
import DashboardFooter from './_components/DashboardFooter';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Fixed Header */}
        <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Only content scrolls */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">{children}</div>
          </main>

          {/* Footer never scrolls */}
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}
