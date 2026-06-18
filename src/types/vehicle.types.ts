/* =====================================================
   Vehicle API types
   Mirrors the Spring Boot backend VehicleRequest/VehicleResponse
   DTOs exposed under /api/v1/vehicles (see swagger).
===================================================== */

export const VEHICLE_TYPES = [
  "SEDAN",
  "SUV",
  "HATCHBACK",
  "TRUCK",
  "VAN",
  "MOTORCYCLE",
  "OTHER",
] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

/**
 * Matches the backend VehicleRequest DTO consumed by:
 *   POST /api/v1/vehicles
 *   PUT  /api/v1/vehicles/{id}
 * All fields are required by the backend.
 */
export interface VehicleRequest {
  model: string;
  registrationNumber: string;
  color: string;
  vehicleType: string;
  yearOfManufacture: number;
}

/**
 * Matches the backend VehicleResponse DTO returned by:
 *   GET  /api/v1/vehicles
 *   POST /api/v1/vehicles
 *   PUT  /api/v1/vehicles/{id}
 */
export interface VehicleResponse {
  id: number;
  model: string;
  registrationNumber: string;
  color: string;
  vehicleType: string;
  yearOfManufacture: number;
  imageUrl?: string;
}
