export type Gender = "MALE" | "FEMALE" | "OTHER";
export type DocStatus = "VERIFIED" | "PENDING" | "NOT_PROVIDED" | "REJECTED";

export type UserRole =
  | 'ROLE_RIDER'
  | 'ROLE_PASSENGER'
  | 'ROLE_ADMIN';

export interface ProfileData {
  id: number;

  firstName: string;
  lastName: string;
  email: string;

  role: UserRole;

  avatarUrl?: string;
  profilePictureUrl?: string;

  bio?: string;

  emailVerified?: boolean;
  contactVerified?: boolean;

  contactNumber?: string;
  gender?: Gender;

  dateOfBirth?: string;

  memberSince?: string;

  age?: number;

  rating?: number;
}

/**
 * Matches the backend's UpdateUserProfileRequest exactly.
 * Note: contactNumber and gender are NOT accepted by PUT /[passenger|rider]/profile —
 * they're set at registration and shown read-only in the UI.
 */
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  dateOfBirth?: string;
}

// export interface ChangePasswordRequest {
//   currentPassword: string;
//   newPassword: string;
// }

export interface AvatarUploadResponse {
  avatarUrl: string;
  avatarVersion: number;
}