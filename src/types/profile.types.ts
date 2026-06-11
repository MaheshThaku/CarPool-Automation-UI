export type Gender = "MALE" | "FEMALE" | "OTHER";
export type DocStatus = "VERIFIED" | "PENDING" | "NOT_PROVIDED" | "REJECTED";

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  gender: Gender;
  dateOfBirth?: string; // ISO date string YYYY-MM-DD
  avatarUrl?: string;
  emailVerified: boolean;
  contactVerified: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  contactNumber: string;
  gender: Gender;
  dateOfBirth?: string;
}

export interface VehicleData {
  id?: string;
  model: string;
  registrationNumber: string;
  color: string;
  vehicleType: string;
  yearOfManufacture?: number;
  imageUrl?: string;
}

export interface UpdateVehicleRequest {
  model: string;
  registrationNumber: string;
  color: string;
  vehicleType: string;
  yearOfManufacture?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
}
