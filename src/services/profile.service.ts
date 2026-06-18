import { api } from "@/lib/axios";
import { getCookie } from "@/lib/cookies";
import {
  ProfileData,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AvatarUploadResponse,
  Gender,
} from "@/types/profile.types";

function getUserFromCookie(): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
} | null {
  try {
    const raw = getCookie("user");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

class ProfileService {
  /**
   * GET /v1/users/me
   * Falls back to the `user` cookie when the endpoint is unavailable,
   * so the profile page always shows something meaningful.
   */
  async getProfile(): Promise<ProfileData> {
    try {
      const res = await api.get<ProfileData>("/v1/users/me");
      // Map profilePictureUrl → avatarUrl; default missing verification flags to false
      return {
        ...res.data,
        avatarUrl: res.data.profilePictureUrl ?? res.data.avatarUrl,
        emailVerified: res.data.emailVerified ?? false,
        contactVerified: res.data.contactVerified ?? false,
      };
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) throw err;

      // Endpoint not reachable — build a minimal profile from the user cookie.
      const stored = getUserFromCookie();
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
   * PUT /v1/users/profile
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<ProfileData> {
    const res = await api.put<ProfileData>("/v1/users/profile", payload);
    return res.data;
  }

  /**
   * POST /api/v1/photos/{userId}/upload-photo  (multipart/form-data)
   * Note: base URL already includes /api, so path is /v1/photos/{userId}/upload-photo
   */
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const stored = getUserFromCookie();
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
   * POST /v1/user/change-password
   * Note: this endpoint is not present in the current backend swagger spec.
   * Until the backend adds it, requests will fail with 404 — surfaced to the
   * caller as a distinct, honest error message instead of a generic one.
   */
  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    try {
      await api.post("/v1/user/change-password", payload);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404 || status === 405) {
        throw new Error("Password changes aren't supported by the server yet. Please try again later.");
      }
      if (status === 400 || status === 401) {
        throw new Error("Current password is incorrect.");
      }
      throw new Error("Failed to change password. Please try again.");
    }
  }
}

export const profileService = new ProfileService();
