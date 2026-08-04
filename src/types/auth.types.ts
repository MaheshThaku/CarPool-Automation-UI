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
   SESSION USER (client cookie)
=========================== */

/**
 * The safe, non-sensitive user profile we persist in the readable `user`
 * cookie so the navbar/profile can render without an API round-trip.
 * NEVER put tokens in here — tokens live in httpOnly cookies only.
 */
export interface SessionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

/* ===========================
   LOGIN
=========================== */

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response of POST /api/auth/login (the Next.js route that proxies the
 * backend and stores the tokens in httpOnly cookies). It returns only the
 * non-sensitive user summary — the tokens themselves never reach JS.
 */
export interface LoginResponse {
  user?: Partial<SessionUser> & { role?: string };
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
   SEND OTP (registration)
=========================== */

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
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
  /** HTTP status code from the backend response, when available. */
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
