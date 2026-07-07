export type RideStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface CreateRideRequest {
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  pricePerSeat: number;
  totalSeats: number;
  // vehicleId: number;
}

export interface RideResponse {
  id: number;
  driverId: number;
  driverName: string;
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  pricePerSeat: number;
  availableSeats: number;
  status: RideStatus;
  vehicleId: number;
  vehicleName: string;
  vehicleLicensePlate: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

/* ===========================
   RIDE SEARCH
=========================== */

export interface RideSearchRequest {
  sourceCity: string;
  destinationCity: string;
  departureDate?: string; // ISO date YYYY-MM-DD
  requiredSeats?: number;
}

export interface RideSearchResponse {
  content: RideResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/* ===========================
   DRIVER — BOOKING MANAGEMENT
=========================== */

export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "COMPLETED";

/**
 * Matches the backend CreateBookingRequest DTO consumed by:
 *   POST /api/v1/bookings/request
 */
export interface CreateBookingRequest {
  rideId: number;
  seatsBooked: number;

  // NEW
  passengerEmail: string;
}

/**
 * Matches the backend BookingResponse DTO returned by:
 *   POST /api/v1/bookings/request
 *   GET  /api/v1/bookings/my-bookings
 *   GET  /api/v1/bookings/ride/{rideId}
 *   PUT  /api/v1/bookings/{bookingId}/approve
 *   PUT  /api/v1/bookings/{bookingId}/reject
 */
export interface RideBookingResponse {
  bookingId: number;
  rideId: number;

  // Passenger

  passengerId: number;
  passengerEmail?: string;
  passengerName: string;
  passengerProfilePic?: string;
  passengerAge?: number;
  contactNumber?: string;

  // Driver

  driverName?: string;
  driverProfilePic?: string;
  driverAge?: number;

  // Vehicle

  vehicleModel?: string;
  vehicleRegistrationNumber?: string;

  // Trip

  sourceCity: string;
  destinationCity: string;

  seatsBooked: number;

  totalAmount: number;

  status: BookingStatus;

  bookingTime: string;
}
