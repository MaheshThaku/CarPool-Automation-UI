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
  // UpcomingRide
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

  /* ── Passenger ────────────────────────────────────── */

  /** GET /v1/passenger/dashboard/stats */
//   getPassengerStats(): Promise<PassengerStats | null> {
//     return safeGet<PassengerStats | null>("/v1/passenger/dashboard/stats", null);
//   }

//   /** GET /v1/passenger/booking/upcoming */
// getUpcomingTrips(): Promise<UpcomingTrip[]> {
//   return safeGet<UpcomingTrip[]>("/v1/passenger/booking/upcoming", []);
// }
//   /** GET /v1/passenger/booking/recent */
//   getRecentBookings(): Promise<RecentBooking[]> {
//     return safeGet<RecentBooking[]>("/v1/passenger/booking/recent", []);
//   }

//   /** GET /v1/passenger/profile/verification */
//   getProfileVerification(): Promise<ProfileVerification | null> {
//     return safeGet<ProfileVerification | null>("/v1/passenger/profile/verification", null);
//   }

//   /** GET /v1/passenger/booking/all */
//   getAllBookings(): Promise<BookingListItem[]> {
//     return safeGet<BookingListItem[]>("/v1/passenger/booking/all", []);
//   }
// }

/* ───────────────── Passenger ───────────────── */

getPassengerStats(): Promise<PassengerStats | null> {
  return safeGet(
    '/v1/passenger/dashboard/stats',
    null,
  );
}

async getUpcomingTrips(): Promise<UpcomingTrip[]> {
  try {
    const res = await api.get<{ content: UpcomingTrip[] }>('/v1/bookings/my-bookings?size=100');
    const list = res.data?.content ?? [];
    return list.filter(b => b.status === 'PENDING' || b.status === 'APPROVED');
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401) throw err;
    return [];
  }
}

async getRecentBookings(): Promise<RecentBooking[]> {
  try {
    const res = await api.get<{ content: RecentBooking[] }>('/v1/bookings/my-bookings?size=100');
    const list = res.data?.content ?? [];
    return list.filter(b => b.status === 'COMPLETED' || b.status === 'REJECTED' || b.status === 'CANCELLED');
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401) throw err;
    return [];
  }
}

getProfileVerification(): Promise<ProfileVerification | null> {
  return safeGet(
    '/v1/passenger/profile/verification',
    null,
  );
}

async getAllBookings(): Promise<BookingListItem[]> {
  try {
    const res = await api.get<{ content: BookingListItem[] }>('/v1/bookings/my-bookings?size=100');
    return res.data?.content ?? [];
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401) throw err;
    return [];
  }
}
}

export const dashboardService = new DashboardService();