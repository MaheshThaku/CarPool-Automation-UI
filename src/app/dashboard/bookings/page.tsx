"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, CheckCircle, IndianRupee, Search } from "lucide-react";

import { useAsyncData } from "@/hooks/useAsyncData";
import { dashboardService } from "@/services/dashboard.service";
import { BookingStatus } from "@/types/dashboard.types";

import BookingCard from "./_components/BookingCard";
import BookingSkeleton from "./_components/BookingSkeleton";
import EmptyBookings from "./_components/EmptyBookings";
import { TABS } from "./_components/bookingUtils";

export default function MyBookingsPage() {
  const { data: bookings, loading } = useAsyncData(() => dashboardService.getAllBookings());
  const [activeTab, setActiveTab] = useState<BookingStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const all = bookings ?? [];

  const filtered = all.filter((b) => {
    const matchTab = activeTab === "ALL" || b.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
        !q ||
        b.sourceCity.toLowerCase().includes(q) ||
        b.destinationCity.toLowerCase().includes(q) ||
        b.driverName.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const countOf = (s: BookingStatus) => all.filter((b) => b.status === s).length;

  const totalSpent = all
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--heading)]">My Bookings</h2>
            <p className="mt-1 text-sm text-[var(--text)]">
              {loading ? "Loading your bookings…" : `${all.length} booking${all.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <Link
              href="/dashboard/rides"
              className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            <Search size={15} /> Find a Ride
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Bookings", value: all.length, color: "text-[var(--heading)]", bg: "bg-white", icon: BookOpen },
            { label: "Upcoming", value: countOf("APPROVED") + countOf("PENDING"), color: "text-blue-700", bg: "bg-blue-50", icon: Calendar },
            { label: "Completed", value: countOf("COMPLETED"), color: "text-green-700", bg: "bg-green-50", icon: CheckCircle },
            { label: "Total Spent", value: totalSpent > 0 ? `Rs.${totalSpent.toLocaleString("en-IN")}` : "Rs.0", color: "text-[var(--primary)]", bg: "bg-[var(--primary-light)]", icon: IndianRupee },
          ].map(({ label, value, color, bg, icon: Icon }) => (
              <div key={label} className={`flex items-center gap-3 rounded-2xl border border-[var(--border)] ${bg} p-4`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/60">
                  <Icon size={16} className={color} />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-light)]">{label}</p>
                  <p className={`mt-0.5 text-lg font-bold ${color}`}>
                    {loading ? <span className="inline-block h-6 w-10 animate-pulse rounded-lg bg-gray-200" /> : value}
                  </p>
                </div>
              </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs */}
          <div className="flex overflow-x-auto rounded-xl border border-[var(--border)] bg-white p-1">
            {TABS.map(({ key, label }) => {
              const count = key === "ALL" ? all.length : countOf(key as BookingStatus);
              return (
                  <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          activeTab === key
                              ? "bg-[var(--primary)] text-white shadow-sm"
                              : "text-[var(--text)] hover:text-[var(--heading)]"
                      }`}
                  >
                    {label}
                    {!loading && all.length > 0 && (
                        <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                            activeTab === key ? "bg-white/30 text-white" : "bg-gray-100 text-[var(--text-light)]"
                        }`}>
                    {count}
                  </span>
                    )}
                  </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]" />
            <input
                type="text"
                placeholder="Search city or driver…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-white py-2 pl-9 pr-4 text-sm text-[var(--heading)] placeholder:text-[var(--text-light)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <BookingSkeleton key={i} />)}
            </div>
        ) : filtered.length === 0 ? (
            <EmptyBookings filtered={activeTab !== "ALL" || search.length > 0} />
        ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filtered.map((b) => <BookingCard key={b.bookingId} booking={b} />)}
            </div>
        )}
      </div>
  );
}
