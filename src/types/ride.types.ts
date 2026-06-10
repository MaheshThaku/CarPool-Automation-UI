export type RideStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface CreateRideRequest {
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  pricePerSeat: number;
  totalSeats: number;
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
}
