/* =====================================================
   Dashboard API response types
   These mirror the Spring Boot backend response shapes.
   Update field names here if the backend contract changes.
===================================================== */

/* ---------- Shared ---------- */

export type DocStatus = "VERIFIED" | "PENDING" | "NOT_PROVIDED" | "REJECTED";

/* ---------- Rider ---------- */

export interface RiderStats {
  totalRides: number;
  upcomingRides: number;
  verificationStatus: DocStatus;
}

export interface UpcomingRide {
  id: number;
  sourceCity: string;
  destinationCity: string;
  departureTime: string; // ISO-8601
  availableSeats: number;
  pricePerSeat: number;
  status: string;
}

/**
 * Matches the backend's VerificationItemResponse exactly: documentType,
 * status, documentUrl, uploadedAt. There is no `label` field — display
 * labels are derived client-side from DOC_CATALOGUE in documents/page.tsx.
 */
export interface VerificationItem {
  documentType: string; // "DRIVING_LICENSE" | "RC_CERTIFICATE" | "INSURANCE"
  status: DocStatus;
  documentUrl?: string;
  uploadedAt?: string; // ISO-8601
}

/** Matches the backend's DocumentUploadResponse (POST /v1/rider/document/upload). */
export interface DocumentUploadResponse {
  documentType: string;
  message: string;
  status: DocStatus;
}

export interface VehicleInfo {
  id: number;
  model: string;
  registrationNumber: string;
  color: string;
  vehicleType: string;
  imageUrl?: string;
}

export interface ProfileCompletion {
  percentage: number;
  steps: Array<{
    key: string;
    label: string;
    completed: boolean;
  }>;
}

/* ---------- Passenger ---------- */

export interface PassengerStats {
  totalBookings: number;
  upcomingTrips: number;
  profileVerified: boolean;
}

/**
 * Matches the backend's BookingResponse exactly (GET /v1/passenger/booking/upcoming).
 * Note: the backend does NOT return the ride's departure time on this endpoint —
 * only `bookingTime` (when the booking was made) is available.
 */
export interface UpcomingTrip {
  bookingId: number;
  rideId: number;
  sourceCity: string;
  destinationCity: string;
  driverName: string;
  seatsBooked: number;
  status: BookingStatus;
  bookingTime: string; // ISO-8601
}

/**
 * Matches the backend's BookingResponse exactly (GET /v1/passenger/booking/recent).
 */
export interface RecentBooking {
  bookingId: number;
  sourceCity: string;
  destinationCity: string;
  totalAmount: number;
  status: BookingStatus;
  bookingTime: string; // ISO-8601
}

export interface ProfileVerification {
  email: string;
  emailVerified: boolean;
  contactNumber: string;
  contactVerified: boolean;
}

/* ---------- Bookings (full list) ---------- */

/** Matches the backend BookingResponse.status enum exactly. */
export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";

/**
 * Matches the backend's BookingResponse exactly (GET /v1/passenger/booking/all).
 * Note: no `departureTime` field exists on this response — only `bookingTime`.
 */
export interface BookingListItem {
  bookingId: number;
  rideId: number;
  sourceCity: string;
  destinationCity: string;
  driverName: string;
  seatsBooked: number;
  totalAmount: number;
  status: BookingStatus;
  bookingTime: string; // ISO-8601
}
