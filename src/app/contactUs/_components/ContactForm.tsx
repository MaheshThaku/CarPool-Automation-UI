'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { contactSchema, ContactSchemaType } from './contact.schema';

import { CONTACT_DETAILS } from './contact.constants';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactSchemaType>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ContactSchemaType) => {
    try {
      setLoading(true);

      const message = `Hello ShareFare Team,

Name: ${data.name}

Email: ${data.email}

Phone: ${data.phone}

Message:
${data.message}

Thank You.`;

      const whatsappUrl = `https://wa.me/${CONTACT_DETAILS.whatsapp}?text=${encodeURIComponent(
        message,
      )}`;

      window.open(whatsappUrl, '_blank');

      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg md:p-8">
      <div>
        <h3 className="text-2xl font-bold text-[var(--heading)]">
          Send Us A Message
        </h3>

        <p className="mt-2 text-sm text-[var(--text-light)]">
          Fill out the form below and continue the conversation on WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--heading)]">
              Full Name
            </label>

            <input
              {...register('name')}
              type="text"
              placeholder="Enter your name"
              className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 transition-all outline-none focus:border-[var(--primary)]"
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--heading)]">
              Email Address
            </label>

            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 transition-all outline-none focus:border-[var(--primary)]"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-[var(--heading)]">
            Phone Number
          </label>

          <input
            {...register('phone')}
            type="tel"
            placeholder="Enter phone number"
            className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 transition-all outline-none focus:border-[var(--primary)]"
          />

          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Message */}

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-[var(--heading)]">
            Message
          </label>

          <textarea
            {...register('message')}
            rows={6}
            placeholder="Tell us how we can help..."
            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-all outline-none focus:border-[var(--primary)]"
          />

          {errors.message && (
            <p className="mt-1 text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] font-semibold text-white transition-all duration-300 hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Redirecting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
