import { api } from "@/lib/axios";
import { ApiError } from "@/types/auth.types";
import { CreateRideRequest, RideResponse } from "@/types/ride.types";

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
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new ApiError(axiosError.response?.data?.message ?? "Something went wrong.");
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

  /** GET /v1/rider/ride/all — returns [] when endpoint not yet implemented */
  getRiderRides(): Promise<RideResponse[]> {
    return safeGet<RideResponse[]>("/v1/rider/ride/all", []);
  }
}

export const rideService = new RideService();
