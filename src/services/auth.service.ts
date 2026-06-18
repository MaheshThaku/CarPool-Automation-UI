import { api } from "@/lib/axios";

import {
  ApiError,
  LoginRequest,
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
} from "@/types/auth.types";

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
          "Something went wrong. Please try again."
      );
    }

    throw new ApiError(
      "Something went wrong. Please try again."
    );
  }

  private async post<TResponse>(
    url: string,
    payload: unknown
  ): Promise<TResponse> {
    try {
      const { data } = await api.post<TResponse>(
        url,
        payload
      );

      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /* ===========================
     REGISTER
  =========================== */

  async register(
    payload: RegisterRequest
  ): Promise<RegisterResponse> {
    return this.post<RegisterResponse>(
      "/v1/public/register",
      payload
    );
  }

  /* ===========================
     LOGIN
  =========================== */

  async login(
    payload: LoginRequest
  ): Promise<LoginResponse> {
    return this.post<LoginResponse>(
      "/v1/public/login",
      payload
    );
  }

  /* ===========================
     FORGOT PASSWORD
  =========================== */

  async forgotPassword(
    payload: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    return this.post<ForgotPasswordResponse>(
      "/v1/public/forgot-password",
      payload
    );
  }

  /* ===========================
     RESET PASSWORD
  =========================== */

  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    return this.post<ResetPasswordResponse>(
      "/v1/public/reset-password",
      payload
    );
  }

  /* ===========================
     SEND OTP (registration)
  =========================== */

  async sendOtp(
    payload: SendOtpRequest
  ): Promise<SendOtpResponse> {
    return this.post<SendOtpResponse>(
      "/v1/otp/send-otp",
      payload
    );
  }

  /* ===========================
     VERIFY OTP (registration)
  =========================== */

  async verifyOtp(
    payload: VerifyOtpRequest
  ): Promise<VerifyOtpResponse> {
    return this.post<VerifyOtpResponse>(
      "/v1/otp/verify-otp",
      payload
    );
  }

  /* ===========================
     RESEND OTP
  =========================== */

  async resendOtp(
    payload: ResendOtpRequest
  ): Promise<ResendOtpResponse> {
    // Same backend endpoint as sendOtp — resend is just a new send.
    return this.post<ResendOtpResponse>(
      "/v1/otp/send-otp",
      payload
    );
  }
}

export const authService =
  new AuthService();
