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

export interface DocumentVerificationItem {
  documentType: 'DRIVING_LICENSE' | 'VEHICLE_RC' | 'VEHICLE_INSURANCE' | 'GOVT_ID' | string;
  verificationStatus: DocStatus;
}

export interface RiderVerificationStatusResponse {
  overallVerificationStatus: 'VERIFIED' | 'PENDING';
  emailVerified: boolean;
  phoneVerified: boolean;
  documents?: DocumentVerificationItem[];
}

export interface VehicleInfo {
  id: number;
  model: string;
  registrationNumber: string;
  color: string;
  vehicleType: string;
  yearOfManufacture: number;
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

  status: BookingStatus;

  bookingTime: string;

  driverName: string;

  departureTime: string;
  driverContactNumber?: string;
}

export interface RecentBooking {
  bookingId: number;
  rideId: number;

  sourceCity: string;
  destinationCity: string;

  seatsBooked: number;
  totalAmount: number;

  bookingTime: string;

  departureTime: string;

  status: BookingStatus;

  driverName: string;
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

  bookingTime: string;          // Keep this
  departureTime: string;        // Add this

  driverName: string;
  driverContactNumber?: string; // Add this

  seatsBooked: number;
  totalAmount: number;
  status: BookingStatus;
  vehicleModel: string;
}

export interface BookingPageResponse {
  content: BookingListItem[];

  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
// added for my bookings - passanges
// cont based on status of booking like-approved, completed and so on 
export interface BookingCountsResponse {
  total: number;
  upcoming: number;
  approved: number;
  pending: number;
  completed: number;
  rejected: number;
  cancelled: number;
}