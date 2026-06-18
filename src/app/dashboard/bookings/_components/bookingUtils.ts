import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

import { BookingStatus } from "@/types/dashboard.types";

export function parseBookedOn(iso: string) {
  try {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase(),
      day: d.toLocaleDateString("en-IN", { weekday: "long" }),
    };
  } catch {
    return { date: "—", time: "—", day: "—" };
  }
}

export function statusConfig(status: BookingStatus) {
  switch (status) {
    case "APPROVED":
      return { label: "Approved", bg: "bg-blue-50", text: "text-blue-700", icon: CheckCircle, dot: "bg-blue-500" };
    case "PENDING":
      return { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", icon: Clock, dot: "bg-amber-500" };
    case "COMPLETED":
      return { label: "Completed", bg: "bg-green-50", text: "text-green-700", icon: CheckCircle, dot: "bg-green-500" };
    case "REJECTED":
      return { label: "Rejected", bg: "bg-red-50", text: "text-red-500", icon: XCircle, dot: "bg-red-400" };
    case "CANCELLED":
      return { label: "Cancelled", bg: "bg-red-50", text: "text-red-500", icon: XCircle, dot: "bg-red-400" };
    default:
      return { label: status, bg: "bg-gray-100", text: "text-gray-600", icon: AlertCircle, dot: "bg-gray-400" };
  }
}

export const TABS: { key: BookingStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "APPROVED", label: "Approved" },
  { key: "PENDING", label: "Pending" },
  { key: "COMPLETED", label: "Completed" },
  { key: "REJECTED", label: "Rejected" },
  { key: "CANCELLED", label: "Cancelled" },
];
