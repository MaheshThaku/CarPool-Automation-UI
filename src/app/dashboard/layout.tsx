"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  FileText,
  Search,
  BookOpen,
  User,
  LogOut,
  Bell,
  MessageCircle,
  ChevronDown,
  Menu,
  X,
  Target,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/cn";

const RIDER_NAV = [
  { href: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/rides/publish", label: "Offer Ride", icon: Car },
  { href: "/dashboard/rides", label: "My Rides", icon: CalendarCheck },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const PASSENGER_NAV = [
  { href: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/rides", label: "Find Rides", icon: Search },
  { href: "/dashboard/bookings", label: "My Bookings", icon: BookOpen },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

function SidebarContent({
  navItems,
  pathname,
  onLinkClick,
  onLogout,
}: {
  navItems: typeof RIDER_NAV;
  pathname: string;
  onLinkClick: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]">
          <Target size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold leading-tight text-[var(--heading)]">
            Ride<span className="text-[var(--primary)]">Connect</span>
          </h2>
          <p className="text-[11px] text-[var(--text-light)]">Travel Together, Better</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isOverview = item.href === "/dashboard/overview";
          const active = isOverview
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "text-[var(--text)] hover:bg-gray-50 hover:text-[var(--heading)]"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[var(--border)] p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) router.replace("/auth/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/auth/login");
  };

  const isRider = user?.role === "ROLE_RIDER";
  const navItems = isRider ? RIDER_NAV : PASSENGER_NAV;
  const notifCount = isRider ? 3 : 2;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[240px] shrink-0 border-r border-[var(--border)] lg:block">
        <SidebarContent
          navItems={navItems}
          pathname={pathname}
          onLinkClick={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[240px] border-r border-[var(--border)] shadow-xl">
            <SidebarContent
              navItems={navItems}
              pathname={pathname}
              onLinkClick={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
          <button
            className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} className="text-[var(--heading)]" />
          </button>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} className="text-[var(--heading)]" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            {/* Chat icon — passenger only */}
            {!isRider && (
              <button className="rounded-full p-2 text-[var(--text)] hover:bg-gray-50">
                <MessageCircle size={20} />
              </button>
            )}

            {/* Bell with badge */}
            <button className="relative rounded-full p-2 text-[var(--text)] hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                {notifCount}
              </span>
            </button>

            {/* Avatar + name */}
            <div className="flex cursor-pointer items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                {user?.firstName?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-tight text-[var(--heading)]">
                  {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
                </p>
                <p className="text-xs text-[var(--text-light)]">
                  {isRider ? "Rider" : "Passenger"}
                </p>
              </div>
              <ChevronDown size={15} className="hidden text-[var(--text-light)] sm:block" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
