import { api } from "@/lib/axios";
import {
  RiderStats,
  UpcomingTrip,   // keep this
  VerificationItem,
  VehicleInfo,
  ProfileCompletion,
  PassengerStats,
  RecentBooking,
  ProfileVerification,
  BookingListItem,
  RiderVerificationStatusResponse,
  // UpcomingRide
} from "@/types/dashboard.types";
import {
  BookingCountsResponse,
  BookingPageResponse,
  BookingStatus,
} from '@/types/dashboard.types';

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

/** Milliseconds since epoch; NaN when `iso` is not a valid date string. */
function toEpochMs(iso: string): number {
  return new Date(iso).getTime();
}

/** True when the departure time is strictly after `now`. Invalid times → false. */
function departsInFuture(departureTime: string, now: number): boolean {
  const t = toEpochMs(departureTime);
  return Number.isFinite(t) && t > now;
}

class DashboardService {
  /* ── Rider ────────────────────────────────────────── */

  /** GET /v1/rider/dashboard/stats */
  getRiderStats(): Promise<RiderStats | null> {
    return safeGet<RiderStats | null>("/v1/rider/dashboard/stats", null);
  }

  /** GET /v1/rider/document/verification/status */
  getRiderVerificationStatus(): Promise<RiderVerificationStatusResponse | null> {
    return safeGet<RiderVerificationStatusResponse | null>(
      "/v1/rider/document/verification/status",
      null,
    );
  }

//   /** GET /v1/rider/ride/my-rides */
// getUpcomingRides(): Promise<UpcomingRide[]> {
//   return safeGet<UpcomingRide[]>("/v1/rider/ride/my-rides", []);
// }
  /** GET /v1/rider/document/all */
  getVerificationStatus(): Promise<VerificationItem[]> {
    return safeGet<VerificationItem[]>("/v1/rider/document/all", []);
  }

  /** GET /v1/rider/vehicle/my-vehicle */
  getVehicleInfo(): Promise<VehicleInfo | null> {
    return safeGet<VehicleInfo | null>("/v1/vehicles", null);
  }


  /** GET /v1/rider/profile/completion */
  getProfileCompletion(): Promise<ProfileCompletion | null> {
    return safeGet<ProfileCompletion | null>("/v1/rider/profile/completion", null);
  }

  async uploadDocument(documentType: string, file: File) {
    const formData = new FormData();

    switch (documentType) {
      case "DRIVING_LICENSE":
        formData.append("drivingLicense", file);
        break;

      case "VEHICLE_RC":
        formData.append("vehicleRc", file);
        break;

      case "VEHICLE_INSURANCE":
        formData.append("vehicleInsurance", file);
        break;

      case "GOVT_ID":
        formData.append("govtId", file);
        break;

      default:
        throw new Error("Invalid document type");
    }

    const { data } = await api.post(
      "/v1/rider/document/upload-all",
      formData
    );

    return data;
  }

/* ───────────────── Passenger ───────────────── */

getPassengerStats(): Promise<PassengerStats | null> {
  return safeGet(
    '/v1/passenger/dashboard/stats',
    null,
  );
}

/** GET /v1/bookings/my-bookings?size=100 — all of the passenger's bookings. */
private async fetchMyBookings(): Promise<UpcomingTrip[]> {
  try {
    const res = await api.get<{ content: UpcomingTrip[] }>(
      '/v1/bookings/my-bookings?size=100',
    );
    return res.data?.content ?? [];
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401) throw err;
    return [];
  }
}

/**
 * Approved rides that have not departed yet.
 * Sorted by departure time (soonest first).
 */
async getUpcomingTrips(): Promise<UpcomingTrip[]> {
  const now = Date.now();
  const list = await this.fetchMyBookings();

  return list
    .filter((b) => b.status === 'APPROVED' && departsInFuture(b.departureTime, now))
    .sort((a, b) => toEpochMs(a.departureTime) - toEpochMs(b.departureTime));
}

/**
 * Everything that is not an upcoming ride: pending, completed, rejected,
 * cancelled, and approved rides that have already departed.
 * Sorted by booking time (newest first).
 */
async getRecentBookings(): Promise<RecentBooking[]> {
  const now = Date.now();
  const list = await this.fetchMyBookings();

  return list
    .filter((b) => !(b.status === 'APPROVED' && departsInFuture(b.departureTime, now)))
    .sort((a, b) => toEpochMs(b.bookingTime) - toEpochMs(a.bookingTime));
}

getProfileVerification(): Promise<ProfileVerification | null> {
  return safeGet(
    '/v1/passenger/profile/verification',
    null,
  );
}

// async getAllBookings(): Promise<BookingListItem[]> {
//   try {
//     const res = await api.get<{ content: BookingListItem[] }>('/v1/bookings/my-bookings?size=100');
//     return res.data?.content ?? [];
//   } catch (err: unknown) {
//     const status = (err as { response?: { status?: number } })?.response?.status;
//     if (status === 401) throw err;
//     return [];
//   }
// }

getAllBookings(
  page = 0,
  size = 5,
  status?: BookingStatus | 'UPCOMING',
): Promise<BookingPageResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (status) {
    params.append('status', status);
  }

  return safeGet<BookingPageResponse>(
    `/v1/bookings/my-bookings?${params.toString()}`,
    {
      content: [],
      page: {
        size,
        number: 0,
        totalElements: 0,
        totalPages: 0,
      },
    },
  );
}

getBookingCounts(): Promise<BookingCountsResponse | null> {
  return safeGet<BookingCountsResponse | null>(
    '/v1/bookings/my-bookings-counts',
    null
  );
}

/** PUT /v1/bookings/passenger/cancel/{bookingId} — cancel a pending or approved booking. */
async cancelBooking(bookingId: number): Promise<void> {
  const res = await api.put(`/v1/bookings/passenger/cancel/${bookingId}`);
  if (res.status !== 200) {
    throw new Error('Failed to cancel booking');
  }
}
}

export const dashboardService = new DashboardService();