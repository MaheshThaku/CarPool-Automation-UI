import { api } from "@/lib/axios";
import {
  RiderStats, UpcomingRide, VerificationItem,
  VehicleInfo, ProfileCompletion,
  PassengerStats, UpcomingTrip, RecentBooking, ProfileVerification,
  BookingListItem,
} from "@/types/dashboard.types";

async function safeGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await api.get<T>(url);
    return res.data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401) throw err;
    return fallback;
  }
}

class DashboardService {
  /* ── Rider ────────────────────────────────────────── */

  /** GET /v1/rider/dashboard/stats */
  getRiderStats(): Promise<RiderStats | null> {
    return safeGet<RiderStats | null>("/v1/rider/dashboard/stats", null);
  }

  /** GET /v1/rider/ride/upcoming */
  getUpcomingRides(): Promise<UpcomingRide[]> {
    return safeGet<UpcomingRide[]>("/v1/rider/ride/upcoming", []);
  }

  /** GET /v1/rider/document/all */
  getVerificationStatus(): Promise<VerificationItem[]> {
    return safeGet<VerificationItem[]>("/v1/rider/document/all", []);
  }

  /** GET /v1/rider/vehicle/my-vehicle */
  getVehicleInfo(): Promise<VehicleInfo | null> {
    return safeGet<VehicleInfo | null>("/v1/rider/vehicle/my-vehicle", null);
  }

  /** GET /v1/rider/profile/completion */
  getProfileCompletion(): Promise<ProfileCompletion | null> {
    return safeGet<ProfileCompletion | null>("/v1/rider/profile/completion", null);
  }

  /* ── Passenger ────────────────────────────────────── */

  /** GET /v1/passenger/dashboard/stats */
  getPassengerStats(): Promise<PassengerStats | null> {
    return safeGet<PassengerStats | null>("/v1/passenger/dashboard/stats", null);
  }

  /** GET /v1/passenger/booking/upcoming */
  getUpcomingTrips(): Promise<UpcomingTrip[]> {
    return safeGet<UpcomingTrip[]>("/v1/passenger/booking/upcoming", []);
  }

  /** GET /v1/passenger/booking/recent */
  getRecentBookings(): Promise<RecentBooking[]> {
    return safeGet<RecentBooking[]>("/v1/passenger/booking/recent", []);
  }

  /** GET /v1/passenger/profile/verification */
  getProfileVerification(): Promise<ProfileVerification | null> {
    return safeGet<ProfileVerification | null>("/v1/passenger/profile/verification", null);
  }

  /** GET /v1/passenger/booking/all */
  getAllBookings(): Promise<BookingListItem[]> {
    return safeGet<BookingListItem[]>("/v1/passenger/booking/all", []);
  }
}

export const dashboardService = new DashboardService();