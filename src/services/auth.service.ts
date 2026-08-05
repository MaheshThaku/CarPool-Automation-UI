import { api } from "@/lib/axios";
import {
  setSessionUser,
  clearSessionUser,
  clearSession,
} from "@/lib/auth.client";

import {
  ApiError,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  SessionUser,
} from "@/types/auth.types";

type UnknownRecord = Record<string, unknown>;

/**
 * Normalize a profile/me response into the safe `user` cookie shape. This
 * shapes an API response — it does NOT decode the JWT.
 */
function normalizeSessionUser(
  data: unknown,
  email: string,
  roleOverride?: string,
): SessionUser {
  const obj = (data ?? {}) as UnknownRecord;

  const role =
    roleOverride ||
    (Array.isArray(obj.roles) ? String(obj.roles[0]) : "") ||
    (Array.isArray(obj.authorities)
      ? String(
          (obj.authorities as Array<{ authority?: string }>)[0]?.authority ??
            obj.authorities[0],
        )
      : "") ||
    String(obj.role ?? "ROLE_PASSENGER");

  const avatarUrl =
    (obj.avatarUrl as string | undefined) ??
    (obj.profilePictureUrl as string | undefined);

  return {
    id: String(obj.id ?? obj.userId ?? ""),
    firstName: String(obj.firstName ?? ""),
    lastName: String(obj.lastName ?? ""),
    email: String(obj.email ?? email),
    role,
    avatarUrl,
  };
}

class AuthService {
  private handleError(error: unknown): never {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      throw new ApiError(
        axiosError.response?.data?.message ??
        "Something went wrong. Please try again.",
      );
    }

    throw new ApiError(
      "Something went wrong. Please try again.",
    );
  }

  private async post<TResponse>(
    url: string,
    payload: unknown,
  ): Promise<TResponse> {
    try {
      const { data } = await api.post<TResponse>(
        url,
        payload,
      );

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /* ===========================
     LOGIN
  =========================== */

  /**
   * Authenticate through POST /api/auth/login (which stores the tokens in
   * httpOnly cookies — they never reach JS), then fetch the profile through
   * the proxy to populate the non-sensitive `user` cookie for the navbar.
   */
  async login(email: string, password: string): Promise<SessionUser> {
    // Drop any stale readable session before starting fresh.
    clearSessionUser();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new ApiError(
        body?.message ?? "Invalid email or password.",
        res.status,
      );
    }

    const data = (await res.json()) as LoginResponse;
    const role = data.user?.role;

    const profilePath =
      role === "ROLE_RIDER" ? "/v1/rider/profile" : "/v1/passenger/profile";

    // Best-effort profile fetch for the navbar cookie. If it fails (e.g. the
    // profile row isn't provisioned yet server-side), fall back to the login
    // response so the user is still signed in.
    try {
      const { data: profile } = await api.get(profilePath);
      const user = normalizeSessionUser(profile, email.trim(), role);
      setSessionUser(user);
      return user;
    } catch {
      const user = normalizeSessionUser(data.user ?? {}, email.trim(), role);
      setSessionUser(user);
      return user;
    }
  }

  /* ===========================
     LOGOUT (current device)
  =========================== */

  /**
   * Revoke the current session server-side (POST /api/auth/logout), then
   * clear every local auth state and redirect to the home page — even if the
   * revoke call fails, the local session is always cleared.
   */
  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      clearSession(true);
    }
  }

  /* ===========================
     LOGOUT FROM ALL DEVICES
  =========================== */

  /**
   * Revoke the user's sessions on every device (POST /api/auth/logout-all),
   * then clear local auth state and redirect to the home page.
   */
  async logoutAll(): Promise<void> {
    try {
      await fetch("/api/auth/logout-all", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      clearSession(true);
    }
  }

  /* ===========================
     REGISTER
  =========================== */

  async register(
    payload: RegisterRequest,
  ): Promise<RegisterResponse> {
    return this.post<RegisterResponse>(
      "/v1/public/register",
      payload,
    );
  }

  /* ===========================
     FORGOT PASSWORD
  =========================== */

  async forgotPassword(
    payload: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    return this.post<ForgotPasswordResponse>(
      "/v1/public/forgot-password",
      payload,
    );
  }

  /* ===========================
     RESET PASSWORD
  =========================== */

  async resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    return this.post<ResetPasswordResponse>(
      "/v1/public/reset-password",
      payload,
    );
  }

  /* ===========================
     SEND OTP (registration)
  =========================== */

  async sendOtp(
    payload: SendOtpRequest,
  ): Promise<SendOtpResponse> {
    return this.post<SendOtpResponse>(
      "/v1/otp/send-otp",
      payload,
    );
  }

  /* ===========================
     VERIFY OTP (registration)
  =========================== */

  async verifyOtp(
    payload: VerifyOtpRequest,
  ): Promise<VerifyOtpResponse> {
    return this.post<VerifyOtpResponse>(
      "/v1/otp/verify-otp",
      payload,
    );
  }

  /* ===========================
     RESEND OTP
  =========================== */

  async resendOtp(
    payload: ResendOtpRequest,
  ): Promise<ResendOtpResponse> {
    // Same backend endpoint as sendOtp — resend is just a new send.
    return this.post<ResendOtpResponse>(
      "/v1/otp/send-otp",
      payload,
    );
  }
}

export const authService =
  new AuthService();
