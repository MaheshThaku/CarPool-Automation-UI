import { z } from 'zod';

export const rideSearchSchema =
  z.object({
    sourceCity: z
      .string()
      .min(
        2,
        'Source city is required',
      ),

    destinationCity: z
      .string()
      .min(
        2,
        'Destination city is required',
      ),

    departureDate:
      z.string().optional(),

    requiredSeats: z
      .number()
      .min(1)
      .max(8),
  });

export type RideSearchSchemaType =
  z.infer<typeof rideSearchSchema>;