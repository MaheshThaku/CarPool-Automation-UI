import { api } from "@/lib/axios";
import {
  ProfileData,
  UpdateProfileRequest,
  VehicleData,
  UpdateVehicleRequest,
  ChangePasswordRequest,
  AvatarUploadResponse,
  Gender,
} from "@/types/profile.types";

function getUserFromStorage(): { id: string; firstName: string; lastName: string; email: string } | null {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

class ProfileService {
  /**
   * GET /v1/user/profile
   * Falls back to localStorage user data when the endpoint is not yet implemented,
   * so the profile page always shows something meaningful.
   */
  async getProfile(): Promise<ProfileData> {
    try {
      const res = await api.get<ProfileData>("/v1/user/profile");
      return res.data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) throw err;

      // Endpoint not implemented yet — build from localStorage JWT data
      const stored = getUserFromStorage();
      if (stored) {
        return {
          id: stored.id ?? "",
          firstName: stored.firstName ?? "",
          lastName: stored.lastName ?? "",
          email: stored.email ?? "",
          contactNumber: "",
          gender: "MALE" as Gender,
          emailVerified: false,
          contactVerified: false,
          avatarUrl: undefined,
          dateOfBirth: undefined,
        };
      }
      throw new Error("Could not load profile. Please try again.");
    }
  }

  /**
   * PUT /v1/user/profile
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<ProfileData> {
    const res = await api.put<ProfileData>("/v1/user/profile", payload);
    return res.data;
  }

  /**
   * POST /api/v1/photos/{userId}/upload-photo  (multipart/form-data)
   * Note: base URL already includes /api, so path is /v1/photos/{userId}/upload-photo
   */
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const stored = getUserFromStorage();
    const userId = stored?.id ?? "";

    if (!userId) {
      throw new Error("User ID not found. Please log in again.");
    }

    const form = new FormData();
    form.append("file", file);

    const res = await api.post<AvatarUploadResponse>(
      `/v1/photos/${userId}/upload-photo`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  }

  /**
   * GET /v1/rider/vehicle/my-vehicle
   * Returns null when not implemented yet (no error banner shown).
   */
  async getVehicle(): Promise<VehicleData | null> {
    try {
      const res = await api.get<VehicleData>("/v1/rider/vehicle/my-vehicle");
      return res.data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) throw err;
      return null;
    }
  }

  /**
   * POST /v1/rider/vehicle
   */
  async createVehicle(payload: UpdateVehicleRequest): Promise<VehicleData> {
    const res = await api.post<VehicleData>("/v1/rider/vehicle", payload);
    return res.data;
  }

  /**
   * PUT /v1/rider/vehicle/{id}
   */
  async updateVehicle(id: string, payload: UpdateVehicleRequest): Promise<VehicleData> {
    const res = await api.put<VehicleData>(`/v1/rider/vehicle/${id}`, payload);
    return res.data;
  }

  /**
   * POST /v1/user/change-password
   */
  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await api.post("/v1/user/change-password", payload);
  }
}

export const profileService = new ProfileService();
