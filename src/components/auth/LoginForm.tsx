"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Lock, Mail } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { loginSchema, LoginSchemaType } from "@/schemas/login.schema";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "@/lib/axios";
import { setCookie, deleteCookie } from "@/lib/cookies";

const SOCIAL_BUTTON_CLASS =
  "flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--text)] bg-white text-sm font-medium transition-colors hover:border-[var(--primary)] text-[var(--text)]";

interface StoredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

/* Normalize the /users/me response into the shape we persist in the `user`
   cookie. This shapes an API response — it does NOT decode the JWT. */
function normalizeUser(data: unknown, email: string): StoredUser {
  const obj = (data ?? {}) as Record<string, unknown>;

  const role =
    (Array.isArray(obj.roles) ? String(obj.roles[0]) : "") ||
    (Array.isArray(obj.authorities)
      ? String(
          (obj.authorities as Array<{ authority?: string }>)[0]?.authority ??
            obj.authorities[0]
        )
      : "") ||
    String(obj.role ?? "ROLE_PASSENGER");

  return {
    id: String(obj.id ?? obj.userId ?? ""),
    firstName: String(obj.firstName ?? ""),
    lastName: String(obj.lastName ?? ""),
    email: String(obj.email ?? email),
    role,
  };
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { role: "ROLE_PASSENGER" },
  });

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setErrorMessage("");

      // Clear any stale client-readable cookies before logging in.
      deleteCookie("user");
      deleteCookie("tokenExpiry");

      // The login API route sets the httpOnly accessToken cookie for us.
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password,
        }),
      });

      if (!loginRes.ok) {
        const body = await loginRes.json().catch(() => null);
        setErrorMessage(body?.message ?? "Login failed. Please try again.");
        return;
      }

      // Token is httpOnly now, so fetch the user through the proxy (the proxy
      // attaches the cookie as the Bearer token).
      const meRes = await api.get("/v1/users/me");
      const user = normalizeUser(meRes.data, data.email.trim());

      // Persist only the safe user fields in a non-httpOnly cookie.
      setCookie("user", JSON.stringify(user));

      router.push("/dashboard/overview");
    } catch {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full bg-white p-5 sm:p-6 lg:p-8 lg:rounded-3xl lg:shadow-sm">
      <header>
        <h1 className="text-3xl font-bold text-[var(--heading)] sm:text-4xl">
          Welcome Back
        </h1>
        <p className="mt-1 text-sm text-[var(--text)]">
          Sign in to continue your journey
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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

        {errorMessage && (
          <p className="text-sm font-medium text-[var(--error)]">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
          >
            Forgot Password?
          </button>
        </div>

        <Button disabled={!isValid} isLoading={isSubmitting}>
          Continue Journey
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs font-medium text-[var(--text)]">OR</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <button type="button" className={SOCIAL_BUTTON_CLASS}>
          <Globe size={18} />
          Continue with Google
        </button>

        <p className="text-center text-sm text-[var(--text)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
