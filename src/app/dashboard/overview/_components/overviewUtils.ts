import { CurrentUser } from "@/hooks/useCurrentUser";
import { DocStatus } from "@/types/dashboard.types";

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function formatDisplayName(user: CurrentUser): string {
  if (user.firstName && user.firstName !== user.email.split("@")[0]) {
    return user.firstName;
  }
  // Fall back to capitalising the email prefix
  const prefix = user.email.split("@")[0];
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

export function parseDeparture(iso: string) {
  try {
    const d = new Date(iso);
    return {
      date: d.getDate(),
      month: d.toLocaleString("en-IN", { month: "short" }),
      day: d.toLocaleString("en-IN", { weekday: "short" }),
      time: d
        .toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
        .toUpperCase(),
    };
  } catch {
    return { date: "--", month: "---", day: "---", time: "--:--" };
  }
}

export function docStatusLabel(status: DocStatus) {
  switch (status) {
    case "VERIFIED": return { text: "Verified", color: "text-green-600" };
    case "PENDING": return { text: "Pending", color: "text-amber-500" };
    case "REJECTED": return { text: "Rejected", color: "text-red-500" };
    default: return { text: "Not Provided", color: "text-amber-500" };
  }
}
