import { api } from "@/lib/axios";
import { describeApiError } from "@/lib/errors";
import { ApiError } from "@/types/auth.types";
import { VehicleRequest, VehicleResponse } from "@/types/vehicle.types";

class VehicleService {
  private handleError(error: unknown): never {
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError.response?.status;
      throw new ApiError(describeApiError(status, axiosError.response?.data?.message), status);
    }
    throw new ApiError("Something went wrong.");
  }

  /**
   * GET /v1/vehicles
   * Returns every vehicle owned by the current rider.
   * Returns [] on non-401 errors (e.g. endpoint not reachable yet)
   * so vehicle-dependent UI can degrade gracefully instead of crashing.
   */
  async getMyVehicles(): Promise<VehicleResponse[]> {
    try {
      const { data } = await api.get<VehicleResponse[]>("/v1/vehicles");
      return data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) throw err;
      return [];
    }
  }

  /** POST /v1/vehicles */
  async addVehicle(payload: VehicleRequest): Promise<VehicleResponse> {
    try {
      const { data } = await api.post<VehicleResponse>("/v1/vehicles", payload);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /** PUT /v1/vehicles/{id} */
  async updateVehicle(id: number, payload: VehicleRequest): Promise<VehicleResponse> {
    try {
      const { data } = await api.put<VehicleResponse>(`/v1/vehicles/${id}`, payload);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /** DELETE /v1/vehicles/{id} */
  async deleteVehicle(id: number): Promise<void> {
    try {
      await api.delete(`/v1/vehicles/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const vehicleService = new VehicleService();
