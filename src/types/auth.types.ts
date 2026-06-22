export type UserRole = "ROLE_PASSENGER" | "ROLE_RIDER";

export type Gender = "MALE" | "FEMALE" | "OTHER";

/* ===========================
   REGISTER
=========================== */

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  gender: Gender;
  role: UserRole;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

/* ===========================
   LOGIN
=========================== */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;

  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
}

/* ===========================
   FORGOT PASSWORD
=========================== */

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

/* ===========================
   RESET PASSWORD
=========================== */

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/* ===========================
   VERIFY OTP
=========================== */

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

/* ===========================
   RESEND OTP
=========================== */

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}
