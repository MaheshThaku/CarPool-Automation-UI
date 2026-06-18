import { api } from "@/lib/axios";
import { describeApiError } from "@/lib/errors";
import { ApiError } from "@/types/auth.types";
import {
  CreateRideRequest,
  RideResponse,
  RideSearchRequest,
  RideSearchResponse,
} from "@/types/ride.types";

async function safeGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await api.get<T>(url);
    return res.data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401) throw err;
    return fallback;
  }
}

class RideService {
  private handleError(error: unknown): never {
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError.response?.status;
      throw new ApiError(describeApiError(status, axiosError.response?.data?.message), status);
    }
    throw new ApiError("Something went wrong.");
  }

  /** POST /v1/rider/ride/publish */
  async publishRide(payload: CreateRideRequest): Promise<RideResponse> {
    try {
      const { data } = await api.post<RideResponse>("/v1/rider/ride/publish", payload);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /** GET /v1/rider/ride/my-rides — rides published by the current rider. */
  getRiderRides(): Promise<RideResponse[]> {
    return safeGet<RideResponse[]>("/v1/rider/ride/my-rides", []);
  }

  /**
   * GET /v1/passenger/rides/search
   * Requires PASSENGER role. Returns paginated ride results.
   * 401 is re-thrown; other errors fall back to an empty page.
   */
  async searchRides(params: RideSearchRequest): Promise<RideSearchResponse> {
    const EMPTY: RideSearchResponse = {
      content: [],
      pageNumber: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };
    try {
      const { data } = await api.get<RideSearchResponse>("/v1/passenger/rides/search", {
        params: {
          sourceCity: params.sourceCity,
          destinationCity: params.destinationCity,
          ...(params.departureDate ? { departureDate: params.departureDate } : {}),
          ...(params.requiredSeats ? { requiredSeats: params.requiredSeats } : {}),
        },
      });
      return data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) throw err;
      return EMPTY;
    }
  }
}

export const rideService = new RideService();
