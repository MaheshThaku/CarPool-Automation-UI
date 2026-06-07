"use client";

import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Globe,
    Lock,
    Mail,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
    loginSchema,
    LoginSchemaType,
} from "@/schemas/login.schema";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authService } from "@/services/auth.service";
import {
  LoginRequest,
  ApiError,
} from "@/types/auth.types";

const SOCIAL_BUTTON_CLASS =
    "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--text)] bg-white text-sm font-medium transition-colors hover:border-[var(--primary)] text-[var(--text)]";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
      isSubmitting,
    },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      role: "ROLE_PASSENGER",
    },
  });

  const router = useRouter();

const [errorMessage, setErrorMessage] =
  useState("");


const onSubmit = async (
  data: LoginSchemaType
) => {
  try {
    setErrorMessage("");

    const payload: LoginRequest = {
      email: data.email.trim(),
      password: data.password,
    };

    const response =
      await authService.login(
        payload
      );

    localStorage.setItem(
      "accessToken",
      response.accessToken
    );

    localStorage.setItem(
      "refreshToken",
      response.refreshToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );

    router.push("/dashboard/d");
  } catch (error) {
    if (error instanceof ApiError) {
      setErrorMessage(error.message);
      return;
    }

    setErrorMessage(
      "Login failed. Please try again."
    );
  }
};

    return (
        <div
            className="
        w-full
        

        bg-white

        p-5
        sm:p-6
        lg:p-8

        lg:rounded-3xl
        lg:shadow-sm
      "
        >
            <header>
                <h1
                    className="
            text-3xl
            font-bold

            text-[var(--heading)]

            sm:text-4xl
          "
                >
                    Welcome Back
                </h1>

                <p
                    className="
            mt-1
            text-sm

            text-[var(--text)]
          "
                >
                    Sign in to continue your journey
                </p>
            </header>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
            >
                <Input
                    required
                    label="Email Address"
                    placeholder="Enter your email address"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    required
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    icon={Lock}
                    error={errors.password?.message}
                    {...register("password")}
                />

                <div className="flex justify-end">
                    <button
                        type="button"
                        className="
              text-sm
              font-medium

              text-[var(--primary)]

              transition-colors
              hover:text-[var(--primary-hover)]
            "
                    >
                        Forgot Password?
                    </button>
                </div>

                <Button
                    disabled={!isValid}
                    isLoading={isSubmitting}
                >
                    Continue Journey
                </Button>

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-[var(--text)]"/>

                    <span
                        className="
              text-xs
              font-medium

              text-[var(--text)]
            "
                    >
            OR
          </span>

                    <div className="h-px flex-1 bg-[var(--text)]"/>
                </div>

                <button
                    type="button"
                    className={SOCIAL_BUTTON_CLASS}
                >
                    <Globe size={18}/>

                    Continue with Google
                </button>
                <p
                    className="
            text-center
            text-sm

            text-[var(--text)]
          "
                >
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/auth/register"
                        className="
              font-semibold

              text-[var(--primary)]

              hover:underline
            "
                    >
                        Create Account
                    </Link>
                </p>
            </form>
        </div>
    );
}