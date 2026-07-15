import { buildLocalDate } from "@/app/dashboard/rides/publish/_components/utils";
import { z } from "zod";

/* =====================================================================
   Zod schema — mirrors the backend CreateRideRequest constraints:
   sourceCity / destinationCity: ≥ 1 char
   departureTime: must be in the future
   pricePerSeat: positive double
   totalSeats: int 1–8
   vehicleId: required (backend now rejects publish requests without one)
===================================================================== */

export const offerRideSchema = z
  .object({
    vehicleId: z
      .number({ error: "Please select a vehicle" })
      .int()
      .positive("Please select a vehicle"),

    sourceCity: z.string().min(1, "Source city is required"),
    sourceAddress: z.string().min(1, "Source address is required"),
    sourceLatitude: z
      .number()
      .refine((v) => v !== 0, "Please select a pickup location from the list"),

    sourceLongitude: z
      .number()
      .refine((v) => v !== 0, "Please select a pickup location from the list"),

    destinationCity: z.string().min(1, "Destination city is required"),
    destinationAddress: z.string().min(1, "Destination address is required"),
    destinationLatitude: z
      .number()
      .refine((v) => v !== 0, "Please select a destination from the list"),

    destinationLongitude: z
      .number()
      .refine((v) => v !== 0, "Please select a destination from the list"),

    departureDate: z.string().min(1, "Date is required"),
    departureTime: z.string().min(1, "Time is required"),

    pricePerSeat: z
      .string()
      .min(1, "Price is required")
      .refine(
        (v) => !isNaN(Number(v)) && Number(v) > 0,
        "Must be a positive number"
      ),

    totalSeats: z.number().int().min(1).max(8),
  })
  .refine(
    (data) => {
      if (
        !data.departureDate ||
        !data.departureTime
      )
        return true;

      return (
        buildLocalDate(
          data.departureDate,
          data.departureTime,
        ) > new Date()
      );
    },
    {
      message:
        'Departure must be in the future',
      path: ['departureDate'],
    },
  )
  .refine(
    (data) => data.sourceCity.toLowerCase() !== data.destinationCity.toLowerCase(),
    { message: "Source and destination can't be the same", path: ["destinationCity"] }
  );

export type OfferRideFormValues = z.infer<typeof offerRideSchema>;