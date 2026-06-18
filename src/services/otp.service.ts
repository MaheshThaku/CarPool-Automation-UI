import { api } from "@/lib/axios";
import { ApiError } from "@/types/auth.types";

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

class OtpService {
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

    throw new ApiError("Something went wrong. Please try again.");
  }

  async sendOtp(payload: SendOtpRequest): Promise<string> {
    try {
      const { data } = await api.post<string>(
        "/otp/send-otp",
        payload
      );
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async verifyOtp(payload: VerifyOtpRequest): Promise<string> {
    try {
      const { data } = await api.post<string>(
        "/otp/verify-otp",
        payload
      );
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const otpService = new OtpService();
