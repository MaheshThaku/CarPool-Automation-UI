import { z } from "zod";

export const loginSchema = z.object({
  role: z.enum(["PASSENGER", "RIDER"], {
    message: "Please select a role",
  }),

  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginSchemaType =
  z.infer<typeof loginSchema>;