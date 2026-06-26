import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Please enter your name'),

  email: z
    .string()
    .email('Please enter a valid email'),

  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(15),

  message: z
    .string()
    .min(
      10,
      'Please tell us how we can help'
    )
    .max(
      1000,
      'Message is too long'
    ),
});

export type ContactSchemaType =
  z.infer<typeof contactSchema>;