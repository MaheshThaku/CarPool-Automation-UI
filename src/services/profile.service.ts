/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { getCookie } from "@/lib/cookies";
import {
  ProfileData,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AvatarUploadResponse,
  Gender,
  UserRole,
} from "@/types/profile.types";

function isUserRole(value: unknown): value is UserRole {
  return value === "ROLE_RIDER" || value === "ROLE_PASSENGER";
}

function getUserFromCookie(): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
  avatarUrl?: string;
} | null {
  try {
    const raw = getCookie("user");
    if (!raw || raw === "undefined") return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      role: isUserRole(parsed?.role) ? parsed.role : undefined,
      avatarUrl: parsed?.avatarUrl,
    };
  } catch {
    return null;
  }
}

class ProfileService {
  /**
   * GET /v1/passenger/profile or /v1/rider/profile
   * Falls back to the `user` cookie when the endpoint is unavailable,
   * so the profile page always shows something meaningful.
   */
async getProfile(): Promise<ProfileData> {
  try {
    const stored = getUserFromCookie() as any;

    const role = stored?.role;

    const endpoint =
      role === 'ROLE_RIDER'
        ? '/v1/rider/profile'
        : '/v1/passenger/profile';

    const { data } = await api.get<ProfileData>(endpoint);

    return {
      ...data,

      id: Number(data.id),

      avatarUrl:
        data.profilePictureUrl ??
        data.avatarUrl,

      profilePictureUrl:
        data.profilePictureUrl ??
        data.avatarUrl,

      role:
        data.role ??
        stored?.role ??
        'ROLE_PASSENGER',

      emailVerified:
        data.emailVerified ?? false,

      contactVerified:
        data.contactVerified ?? false,
    };
  } catch (err: unknown) {
    const status = (
      err as {
        response?: {
          status?: number;
        };
      }
    )?.response?.status;

    if (status === 401) {
      throw err;
    }

    const stored = getUserFromCookie();

    if (stored) {
      return {
        id: Number(stored.id ?? 0),

        firstName:
          stored.firstName ?? '',

        lastName:
          stored.lastName ?? '',

        email:
          stored.email ?? '',

        role:
          stored.role ??
          'ROLE_PASSENGER',

        avatarUrl:
          stored.avatarUrl,

        profilePictureUrl:
          stored.avatarUrl,

        bio: '',

        contactNumber: '',

        gender:
          'MALE' as Gender,

        emailVerified: false,

        contactVerified: false,

        dateOfBirth: undefined,

        memberSince: undefined,

        age: undefined,

        rating: 0,
      };
    }

    throw new Error(
      'Could not load profile. Please try again.',
    );
  }
}

  /**
   * PUT /v1/passenger/profile or /v1/rider/profile
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<ProfileData> {
    const stored = getUserFromCookie() as any;
    const role = stored?.role;
    const endpoint = role === "ROLE_RIDER" ? "/v1/rider/update/profile" : "/v1/passenger/update/profile";
    const res = await api.put<ProfileData>(endpoint, payload);
    return res.data;
  }

  /**
   * POST /api/v1/photos/{userId}/upload-photo  (multipart/form-data)
   * Note: base URL already includes /api, so path is /v1/photos/{userId}/upload-photo
   */
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<AvatarUploadResponse>(
      "/v1/photos/profile",
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );

    return response.data;
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