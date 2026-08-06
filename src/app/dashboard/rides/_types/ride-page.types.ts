import {
  RideResponse,
  RideBookingResponse,
  RideStatus,
} from '@/types/ride.types';

/** Shared across the My Rides stat cards, tabs, and page state. */
export type RideFilterTab = 'ALL' | RideStatus;

export interface RideSearchFormData {
  sourceCity: string;
  destinationCity: string;
  departureDate?: string;
  requiredSeats?: number;
}

export interface RideCardProps {
  ride: RideResponse;
  onBook?: (rideId: number) => Promise<void>;
  bookingLoading?: boolean;
  booked?: boolean;
  requiredSeats?: number;
}

export interface RideResultsProps {
  rides: RideResponse[];
  loading: boolean;
  hasSearched: boolean;
  bookingLoadingRideId?: number | null;
  bookedRideIds: Set<number>;
  onBookRide: (rideId: number) => Promise<void>;
  requiredSeats?: number;
  /** Total matching rides (page metadata). Used to surface "Showing X of Y". */
  totalElements?: number;
}

export interface RideTableProps {
  rides: RideResponse[];
}

export interface RideTableRowProps {
  ride: RideResponse;
}

export interface BookingRowProps {
  booking: RideBookingResponse;
}

export interface BookingsPanelProps {
  rideId: number;
}

export interface PopularRoute {
  source: string;
  destination: string;
}

export interface RideStat {
  label: string;
  value: number;
}