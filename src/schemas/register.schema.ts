import { z } from "zod";

export const registerSchema = z
  .object({
    role: z.enum([
      "ROLE_PASSENGER",
      "ROLE_RIDER",
    ]),

    gender: z.enum([
      "MALE",
      "FEMALE",
      "OTHER",
    ]),

    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(
        50,
        "First name cannot exceed 50 characters"
      ),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(
        50,
        "Last name cannot exceed 50 characters"
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address")
      .min(
        3,
        "Email must be at least 3 characters"
      )
      .max(
        22,
        "Email must not exceed 22 characters"
      ),

    contactNumber: z
      .string()
      .trim()
      .min(
        1,
        "Contact number is required"
      )
      .regex(
        /^[0-9]{10}$/,
        "Invalid mobile number"
      ),

    password: z
      .string()
      .min(
        1,
        "Password is required"
      )
      .min(
        8,
        "Password must be at least 8 characters"
      )
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
        "Password must contain uppercase, lowercase and number"
      ),

    confirmPassword: z.string(),

    acceptTerms: z.boolean(),

    acceptPrivacy: z.boolean(),
  })

  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  )

  .refine(
    (data) => data.acceptTerms,
    {
      path: ["acceptTerms"],
      message:
        "Please accept Terms & Conditions",
    }
  )

  .refine(
    (data) => data.acceptPrivacy,
    {
      path: ["acceptPrivacy"],
      message:
        "Please accept Privacy Policy",
    }
  );

export type RegisterSchemaType =
  z.infer<typeof registerSchema>;