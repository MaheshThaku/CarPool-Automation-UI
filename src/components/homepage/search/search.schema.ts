import { z } from "zod";

export const searchRideSchema = z.object({
  from: z
    .string()
    .min(2, "Please enter departure location"),

  to: z
    .string()
    .min(2, "Please enter destination"),

  travelDate: z
    .string()
    .min(1, "Please select travel date"),

  passengers: z
    .number()
    .min(1, "Select at least 1 passenger"),
});

export type SearchRideSchemaType =
  z.infer<typeof searchRideSchema>;