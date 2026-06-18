import { api } from "@/lib/axios";
import { describeApiError } from "@/lib/errors";
import { ApiError } from "@/types/auth.types";
import { CreateBookingRequest, RideBookingResponse } from "@/types/ride.types";

class BookingService {
  private handleError(error: unknown): never {
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError.response?.status;
      throw new ApiError(describeApiError(status, axiosError.response?.data?.message), status);
    }
    throw new ApiError("Something went wrong.");
  }

  /**
   * POST /api/v1/bookings/request
   * Passenger: request to book seats on a ride.
   */
  async createBooking(payload: CreateBookingRequest): Promise<RideBookingResponse> {
    try {
      const { data } = await api.post<RideBookingResponse>(
        "/v1/bookings/request",
        payload
      );
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * GET /api/v1/bookings/my-bookings
   * Passenger: fetch all of the current user's bookings.
   * Returns [] on non-401 errors so the UI degrades gracefully.
   */
  async getMyBookings(): Promise<RideBookingResponse[]> {
    try {
      const { data } = await api.get<RideBookingResponse[]>("/v1/bookings/my-bookings");
      return data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) throw err;
      return [];
    }
  }

  /**
   * GET /api/v1/bookings/ride/{rideId}
   * Driver: fetch all booking requests for one of their published rides.
   * Returns [] on non-401 errors so the UI degrades gracefully.
   */
  async getBookingsByRide(rideId: number): Promise<RideBookingResponse[]> {
    try {
      const { data } = await api.get<RideBookingResponse[]>(
        `/v1/bookings/ride/${rideId}`
      );
      return data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) throw err;
      return [];
    }
  }

  /**
   * PUT /api/v1/bookings/{bookingId}/approve
   * Driver: approve a pending booking request.
   */
  async approveBooking(bookingId: number): Promise<RideBookingResponse> {
    try {
      const { data } = await api.put<RideBookingResponse>(
        `/v1/bookings/${bookingId}/approve`
      );
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * PUT /api/v1/bookings/{bookingId}/reject
   * Driver: reject a pending booking request.
   */
  async rejectBooking(bookingId: number): Promise<RideBookingResponse> {
    try {
      const { data } = await api.put<RideBookingResponse>(
        `/v1/bookings/${bookingId}/reject`
      );
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const bookingService = new BookingService();
