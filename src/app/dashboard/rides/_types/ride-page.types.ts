import {
  RideResponse,
  RideBookingResponse,
} from '@/types/ride.types';

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
}

export interface RideResultsProps {
  rides: RideResponse[];
  loading: boolean;
  hasSearched: boolean;
  bookingLoadingRideId?: number | null;
  bookedRideIds: Set<number>;
  onBookRide: (rideId: number) => Promise<void>;
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