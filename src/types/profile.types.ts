export type Gender = "MALE" | "FEMALE" | "OTHER";
export type DocStatus = "VERIFIED" | "PENDING" | "NOT_PROVIDED" | "REJECTED";

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  avatarUrl?: string;
  profilePictureUrl?: string; // ✅ ADD THIS
   bio?: string;
  emailVerified: boolean;
  contactVerified: boolean;

  contactNumber?: string;
  gender?: Gender;
  dateOfBirth?: string;

  memberSince?: string;
}

/**
 * Matches the backend's UpdateUserProfileRequest exactly.
 * Note: contactNumber and gender are NOT accepted by PUT /v1/users/profile —
 * they're set at registration and shown read-only in the UI.
 */
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  dateOfBirth?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
  avatarVersion: number;
}
