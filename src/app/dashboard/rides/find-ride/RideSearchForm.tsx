'use client';

import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, ArrowLeftRight, MapPin, Search, Users } from 'lucide-react';

import {
  rideSearchSchema,
  RideSearchSchemaType,
} from '../schemas/ride-search.schema';

interface Props {
  initialValues?: Partial<RideSearchSchemaType>;
  loading?: boolean;
  onSearch: (values: RideSearchSchemaType) => void;
}

export default function RideSearchForm({
  initialValues,
  loading = false,
  onSearch,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RideSearchSchemaType>({
    resolver: zodResolver(rideSearchSchema),
    defaultValues: {
      sourceCity: '',
      destinationCity: '',
      departureDate: '',
      requiredSeats: 1,
    },
  });

  const sourceCity = watch('sourceCity');

  const destinationCity = watch('destinationCity');

  /**
   * Autofill when user clicks Popular Route
   */
  useEffect(() => {
    if (!initialValues) return;

    reset({
      sourceCity: initialValues.sourceCity ?? '',

      destinationCity: initialValues.destinationCity ?? '',

      departureDate: initialValues.departureDate ?? '',

      requiredSeats: initialValues.requiredSeats ?? 1,
    });
  }, [initialValues, reset]);

  /**
   * Swap source & destination
   */
  const handleSwap = useCallback(() => {
    setValue('sourceCity', destinationCity ?? '', {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue('destinationCity', sourceCity ?? '', {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [sourceCity, destinationCity, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_auto_1fr_220px_120px_auto]">
        {/* Source */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--heading)]">
            <MapPin size={14} />
            From
          </label>

          <input
            {...register('sourceCity')}
            placeholder="Departure city"
            className="h-12 w-full rounded-xl border border-[var(--border)] px-4 transition-all outline-none focus:border-[var(--primary)]"
          />

          {errors.sourceCity && (
            <p className="mt-1 text-xs text-red-500">
              {errors.sourceCity.message}
            </p>
          )}
        </div>

        {/* Swap */}

        <div className="flex items-end justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        {/* Destination */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--heading)]">
            <MapPin size={14} />
            To
          </label>

          <input
            {...register('destinationCity')}
            placeholder="Arrival city"
            className="h-12 w-full rounded-xl border border-[var(--border)] px-4 transition-all outline-none focus:border-[var(--primary)]"
          />

          {errors.destinationCity && (
            <p className="mt-1 text-xs text-red-500">
              {errors.destinationCity.message}
            </p>
          )}
        </div>

        {/* Date */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--heading)]">
            <Calendar size={14} />
            Date (Optional)
          </label>

          <input
            type="date"
            {...register('departureDate')}
            className="h-12 w-full rounded-xl border border-[var(--border)] px-4 transition-all outline-none focus:border-[var(--primary)]"
          />
        </div>

        {/* Seats */}

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--heading)]">
            <Users size={14} />
            Seats
          </label>

          <div className="relative">
            <Users
              size={16}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-light)]"
            />

            <select
              {...register('requiredSeats', {
                valueAsNumber: true,
              })}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[var(--border)] bg-white pr-4 pl-11 transition-all outline-none focus:border-[var(--primary)]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((seat) => (
                <option key={seat} value={seat}>
                  {seat}
                </option>
              ))}
            </select>
          </div>

          {errors.requiredSeats && (
            <p className="mt-1 text-xs text-red-500">
              {errors.requiredSeats.message}
            </p>
          )}
        </div>

        {/* Search */}

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-semibold text-white transition-all hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search size={16} />

            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </form>
  );
}
