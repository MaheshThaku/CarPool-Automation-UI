"use client";

import Link from "next/link";
import { Mail, Lock, Phone, User } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";

import RoleSelector from "./RoleSelector";
import GenderSelector from "./GenderSelector";
import PasswordStrength from "./PasswordStrength";

import { useState } from "react";
import { useRouter } from "next/navigation";

import NotificationModal from "@/components/ui/NotificationModal";

import { authService } from "@/services/auth.service";

import { RegisterRequest } from "@/types/auth.types";

import {
  registerSchema,
  RegisterSchemaType,
} from "@/schemas/register.schema";

export default function RegisterForm() {
const {
  register,
  handleSubmit,
  control,
  setValue,
  reset,
  formState: {
    errors,
    // isValid,
    isSubmitting,
  },
} = useForm<RegisterSchemaType>({
  resolver: zodResolver(registerSchema),
  mode: "onChange",
  defaultValues: {
    role: "ROLE_PASSENGER",
    gender: "MALE",
    acceptTerms: false,
    acceptPrivacy: false,

    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  },
});

const role = useWatch({
  control,
  name: "role",
});

const gender = useWatch({
  control,
  name: "gender",
});

const password = useWatch({
  control,
  name: "password",
});

const acceptTerms = useWatch({
  control,
  name: "acceptTerms",
});

const acceptPrivacy = useWatch({
  control,
  name: "acceptPrivacy",
});
  const router = useRouter();

  const [notification, setNotification] =
  useState({
    open: false,
    type: "success" as
      | "success"
      | "error",
    title: "",
    message: "",
  });

const onSubmit = async (
  data: RegisterSchemaType
) => {
  try {
    const payload: RegisterRequest = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email
        .trim()
        .toLowerCase(),
      contactNumber:
        data.contactNumber.trim(),
      gender: data.gender,
      role: data.role,
      password: data.password,
    };
    console.log("Payload:", payload);
    console.log(data);

    const response =
      await authService.register(
        payload
      );

    reset();

    setNotification({
      open: true,
      type: "success",
      title:
        "Registration Successful",
      message:
        response.message ||
        "Your account has been created successfully. Continue to login.",
    });

    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  } catch (error) {
    setNotification({
      open: true,
      type: "error",
      title: "Registration Failed",
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong.",
    });
  }
};

  return (
    <div
      className="
        w-full
        max-w-3xl

        bg-white

        lg:max-h-[calc(100vh-32px)]
        lg:overflow-hidden

        lg:rounded-[32px]
        lg:shadow-sm
      "
    >
      {/* Header */}
      <div
        className="
        

          sm:px-6
          sm:pt-6

          lg:px-8
          lg:pt-8
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            text-[var(--heading)]

            lg:text-[42px]
          "
        >
          Create Your Account
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-[var(--text)]
          "
        >
          Join India&apos;s premium carpooling
          community
        </p>
      </div>

      {/* Scroll Area */}
      <div
        className="
          lg:max-h-[calc(100vh-180px)]
          lg:overflow-y-auto

          px-5
          pb-5

          sm:px-6
          sm:pb-6

          lg:px-8
          lg:pb-8
        "
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
        >
        <RoleSelector
          value={role}
          onChange={(value) =>
            setValue("role", value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />

          {/* Name */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              required
              label="First Name"
              placeholder="Enter first name"
              icon={User}
              error={errors.firstName?.message}
              {...register("firstName")}
            />

            <Input
              required
              label="Last Name"
              placeholder="Enter last name"
              icon={User}
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          {/* Contact */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              required
              label="Email Address"
              placeholder="Enter email address"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              required
              label="Contact Number"
              placeholder="Enter mobile number"
              icon={Phone}
              error={errors.contactNumber?.message}
              maxLength={10}
              inputMode="numeric"
              {...register("contactNumber")}
            />
          </div>

          {/* Gender */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[var(--heading)]
              "
            >
              Gender <span className="text-red-500">*</span>
            </label>

            <GenderSelector
              value={gender}
              onChange={(value) =>
                setValue("gender", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>

          {/* Password */}
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              required
              type="password"
              label="Password"
              placeholder="Create password"
              icon={Lock}
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              required
              type="password"
              label="Confirm Password"
              placeholder="Confirm password"
              icon={Lock}
              error={
                errors.confirmPassword?.message
              }
              {...register("confirmPassword")}
            />
          </div>

          <PasswordStrength
            password={password}
          />

          {/* Agreements */}
          <div className="space-y-2">
          <Checkbox
            checked={acceptTerms}
            onChange={() =>
              setValue(
                "acceptTerms",
                !acceptTerms,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              )
            }
            label="I agree to the Terms & Conditions"
          />

            {errors.acceptTerms && (
              <p className="text-xs text-red-500">
                {errors.acceptTerms.message}
              </p>
            )}

            <Checkbox
              checked={acceptPrivacy}
              onChange={() =>
                setValue(
                  "acceptPrivacy",
                  !acceptPrivacy,
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  }
                )
              }
              label="I agree to the Privacy Policy"
            />

            {errors.acceptPrivacy && (
              <p className="text-xs text-red-500">
                {errors.acceptPrivacy.message}
              </p>
            )}
          </div>

          <Button
            // disabled={!isValid}
            isLoading={isSubmitting}
            type="submit"
            
          >
            Create Account
          </Button>

          <p
            className="
              text-center
              text-sm
              text-[var(--text)]
            "
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="
                font-semibold
                text-[var(--primary)]
                hover:underline
              "
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
      <NotificationModal
  open={notification.open}
  type={notification.type}
  title={notification.title}
  message={notification.message}
  onClose={() => {
    const isSuccess =
      notification.type ===
      "success";

    setNotification({
      open: false,
      type: "success",
      title: "",
      message: "",
    });

    if (isSuccess) {
      router.push("/auth/login");
    }
  }}
/>
    </div>
    
  );
}
