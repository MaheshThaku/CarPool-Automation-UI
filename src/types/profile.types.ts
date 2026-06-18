export type Gender = "MALE" | "FEMALE" | "OTHER";
export type DocStatus = "VERIFIED" | "PENDING" | "NOT_PROVIDED" | "REJECTED";

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  gender: Gender;
  role?: string;
  dateOfBirth?: string;       // not yet in UserProfileResponse
  avatarUrl?: string;         // mapped from profilePictureUrl
  profilePictureUrl?: string; // from UserProfileResponse
  emailVerified: boolean;     // not yet in UserProfileResponse — defaults to false
  contactVerified: boolean;   // not yet in UserProfileResponse — defaults to false
  bio?: string;
  rating?: number;
  memberSince?: string;       // ISO date-time from UserProfileResponse
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
}
