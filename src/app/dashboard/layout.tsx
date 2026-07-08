'use client';

import { useState } from 'react';

import DashboardSidebar from './_components/DashboardSidebar';
import DashboardHeader from './_components/DashboardHeader';
import DashboardFooter from './_components/DashboardFooter';

import { useProfileBootstrap } from '@/hooks/useProfileBootstrap';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useProfileBootstrap();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Sidebar */}

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}

        <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Content Area */}

        <div className="flex min-h-0 flex-1 flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1800px] p-4 sm:p-6">
              {children}
            </div>
          </main>

          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}
