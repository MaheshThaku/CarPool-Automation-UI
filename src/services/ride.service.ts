import { api } from '@/lib/axios';
import { describeApiError } from '@/lib/errors';
import { ApiError } from '@/types/auth.types';
import {
  CreateRideRequest,
  RidePageResponse,
  RideResponse,
  RideSearchRequest,
  RideSearchResponse,
  RideStatus
} from '@/types/ride.types';

const UNAUTHORIZED_STATUS = 401;

function getErrorStatus(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status;
}

async function safeGet<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await api.get<T>(url);
    return res.data;
  } catch (err: unknown) {
    if (getErrorStatus(err) === UNAUTHORIZED_STATUS) throw err;
    return fallback;
  }
}

class RideService {
  private handleError(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosError.response?.status;
      throw new ApiError(
        describeApiError(status, axiosError.response?.data?.message),
        status,
      );
    }
    throw new ApiError('Something went wrong.');
  }

  /** POST /v1/rider/ride/publish */
  async publishRide(payload: CreateRideRequest): Promise<RideResponse> {
    try {
      const { data } = await api.post<RideResponse>(
        '/v1/rider/ride/publish',
        payload,
      );
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /** PUT /v1/rider/ride/{rideId}/status */
  async updateRideStatus(rideId: number, status: RideStatus): Promise<void> {
    try {
      await api.put(`/v1/rider/ride/${rideId}/status?status=${status}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /** GET /v1/rider/ride/my-rides — paginated rides published by the current rider. */
  getRiderRides(page = 0, size = 5): Promise<RidePageResponse> {
    return safeGet<RidePageResponse>(
      `/v1/rider/ride/my-rides?page=${page}&size=${size}`,
      {
        content: [],
        page: {
          size,
          number: 0,
          totalElements: 0,
          totalPages: 0,
        },
      },
    );
  }

  /**
   * GET /v1/passenger/rides/search
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
      const { data } = await api.get<RideSearchResponse>(
        '/v1/passenger/rides/search',
        {
          params: {
            sourceCity: params.sourceCity,
            destinationCity: params.destinationCity,
            ...(params.departureDate
              ? { departureDate: params.departureDate }
              : {}),
            ...(params.requiredSeats
              ? { requiredSeats: params.requiredSeats }
              : {}),
          },
        },
      );
      return data;
    } catch (err: unknown) {
      if (getErrorStatus(err) === UNAUTHORIZED_STATUS) throw err;
      return EMPTY;
    }
  }
}

export const rideService = new RideService();
