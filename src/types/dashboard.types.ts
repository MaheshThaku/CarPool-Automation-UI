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

export interface VerificationItem {
  documentType: string; // "DRIVING_LICENSE" | "RC_CERTIFICATE" | "INSURANCE"
  label: string;
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

export interface UpcomingTrip {
  id: number;
  sourceCity: string;
  destinationCity: string;
  departureTime: string; // ISO-8601
  availableSeats: number;
  driverName: string;
  status: string;
}

export interface RecentBooking {
  id: number;
  sourceCity: string;
  destinationCity: string;
  departureTime: string; // ISO-8601
  totalAmount: number;
  status: string;
}

export interface ProfileVerification {
  email: string;
  emailVerified: boolean;
  contactNumber: string;
  contactVerified: boolean;
}

/* ---------- Bookings (full list) ---------- */

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface BookingListItem {
  id: number;
  sourceCity: string;
  destinationCity: string;
  departureTime: string; // ISO-8601
  driverName: string;
  seatsBooked: number;
  totalAmount: number;
  status: BookingStatus;
}
