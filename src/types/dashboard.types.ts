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

export interface UpcomingBooking {
  bookingId: number;
  rideId: number;
  sourceCity: string;
  destinationCity: string;
  seatsBooked: number;
  totalAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  bookingTime: string;
  driverName: string;
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
  bookingId: number;
  rideId: number;
  sourceCity: string;
  destinationCity: string;
  seatsBooked: number;
  totalAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  bookingTime: string;
  driverName: string;
}

export interface RecentBooking {
  bookingId: number;
  rideId: number;
  passengerId: number;
  passengerName: string;
  passengerProfilePic?: string;
  passengerAge?: number;

  driverName: string;
  driverProfilePic?: string;
  driverAge?: number;

  vehicleModel?: string;
  vehicleRegistrationNumber?: string;

  sourceCity: string;
  destinationCity: string;
  seatsBooked: number;
  totalAmount: number;
  status: BookingStatus;
  bookingTime: string;
}

export interface ProfileVerification {
  email: string;
  emailVerified: boolean;
  contactNumber: string;
  contactVerified: boolean;
}

/* ---------- Bookings (full list) ---------- */
export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export interface BookingListItem {
  bookingId: number;
  sourceCity: string;
 destinationCity: string;
  bookingTime: string;
  driverName: string;
  seatsBooked: number;
  totalAmount: number;
  status: BookingStatus;
}

export interface UpcomingRide {
  id: string;
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
}
