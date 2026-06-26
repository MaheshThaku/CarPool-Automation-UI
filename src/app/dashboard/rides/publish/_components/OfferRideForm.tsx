'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  DollarSign,
  ChevronLeft,
  Car,
  Clock,
  AlertCircle,
  ArrowLeftRight,
} from 'lucide-react';

import { useAsyncData } from '@/hooks/useAsyncData';
import { vehicleService } from '@/services/vehicle.service';
import { rideService } from '@/services/ride.service';
import { RideResponse } from '@/types/ride.types';
import {
  offerRideSchema,
  OfferRideFormValues,
} from '@/schemas/publish-ride.schema';

import { toIso, todayMin, inputCls } from './utils';
import InputField from './InputField';
import SeatPicker from './SeatPicker';
import RidePreview from './RidePreview';
import SuccessState from './SuccessState';
import NoVehicleState from './NoVehicleState';

export default function OfferRideForm() {
  const vehicles$ = useAsyncData(() => vehicleService.getMyVehicles(), [], { cacheKey: "my-vehicles" });
  const vehicles = vehicles$.data ?? [];

  const [publishedRide, setPublishedRide] = useState<RideResponse | null>(null);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<OfferRideFormValues>({
    resolver: zodResolver(offerRideSchema),
    mode: 'onChange',
    defaultValues: {
      vehicleId: 0,
      totalSeats: 2,
      sourceCity: '',
      destinationCity: '',
      departureDate: '',
      departureTime: '',
      pricePerSeat: '',
    },
  });

  // useWatch (a proper hook backed by react-hook-form's subscription store)
  // instead of calling watch() during render — watch() returns a fresh,
  // unmemoized value on every call and isn't safe under the React Compiler.
  // useWatch's "watch everything" overload types its result as a deep-partial,
  // since fields can theoretically be unset; we fall back to the same
  // defaults passed to useForm so `values` is always a complete OfferRideFormValues.
  const watchedValues = useWatch({ control });
  const values: OfferRideFormValues = {
    sourceCity: watchedValues.sourceCity ?? '',
    destinationCity: watchedValues.destinationCity ?? '',
    departureDate: watchedValues.departureDate ?? '',
    departureTime: watchedValues.departureTime ?? '',
    pricePerSeat: watchedValues.pricePerSeat ?? '',
    totalSeats: watchedValues.totalSeats ?? 2,
  };

  const onSubmit = async (data: OfferRideFormValues) => {
    if (!vehicle) {
      setSubmitError('Please add a vehicle before publishing a ride.');
      return;
    }
    setSubmitError('');
    try {
      const ride = await rideService.publishRide({
        sourceCity: data.sourceCity.trim(),
        destinationCity: data.destinationCity.trim(),
        departureTime: toIso(data.departureDate, data.departureTime),
        pricePerSeat: Number(data.pricePerSeat),
        totalSeats: data.totalSeats,
        // vehicleId: vehicle.id,
      });
      // A freshly published ride changes the rider's ride list, the
      // upcoming-rides widget, and the dashboard stats — drop those cached
      // entries so the next visit to those pages fetches current data
      // instead of serving what was cached before this ride existed.
      invalidateAsyncCache("rider-rides-list");
      invalidateAsyncCache("rider-upcoming-rides");
      invalidateAsyncCache("rider-stats");
      setPublishedRide(ride);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setSubmitError(msg || 'Failed to publish ride. Please try again.');
    }
  };

  const handleOfferAnother = () => {
    setPublishedRide(null);
    setSubmitError('');
    reset();
  };

  if (publishedRide) {
    return (
      <div className="mx-auto max-w-2xl">
        <SuccessState
          ride={publishedRide}
          onOfferAnother={handleOfferAnother}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/overview"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-[var(--text)] hover:bg-gray-50"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[var(--heading)]">
            Offer a Ride
          </h2>
          <p className="text-sm text-[var(--text)]">
            Fill in the details to publish your ride
          </p>
        </div>
      </div>

      {vehicles$.loading ? (
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      ) : vehicles.length === 0 ? (
        <NoVehicleState />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Route */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-semibold text-[var(--heading)]">
                Route Details
              </h3>
              <p className="mt-0.5 text-xs text-[var(--text-light)]">
                Where are you starting and where are you going?
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Pickup City"
                  required
                  icon={MapPin}
                  error={errors.sourceCity?.message}
                >
                  <input
                    {...register('sourceCity')}
                    placeholder="e.g. Delhi"
                    className={inputCls(true, errors.sourceCity?.message)}
                  />
                </InputField>

                {/* Swap button */}
                <div className="hidden sm:col-span-2 sm:-my-2 sm:flex sm:justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const src = values.sourceCity;
                      const dst = values.destinationCity;
                      setValue('sourceCity', dst, { shouldValidate: true });
                      setValue('destinationCity', src, {
                        shouldValidate: true,
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <ArrowLeftRight size={13} /> Swap
                  </button>
                </div>

                <InputField
                  label="Drop City"
                  required
                  icon={MapPin}
                  error={errors.destinationCity?.message}
                >
                  <input
                    {...register('destinationCity')}
                    placeholder="e.g. Jaipur"
                    className={inputCls(true, errors.destinationCity?.message)}
                  />
                </InputField>
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-semibold text-[var(--heading)]">Schedule</h3>
              <p className="mt-0.5 text-xs text-[var(--text-light)]">
                When is your departure?
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  label="Departure Date"
                  required
                  icon={Calendar}
                  error={errors.departureDate?.message}
                >
                  <input
                    type="date"
                    min={todayMin()}
                    {...register('departureDate')}
                    className={inputCls(true, errors.departureDate?.message)}
                  />
                </InputField>

                <InputField
                  label="Departure Time"
                  required
                  icon={Clock}
                  error={errors.departureTime?.message}
                >
                  <input
                    type="time"
                    {...register('departureTime')}
                    className={inputCls(true, errors.departureTime?.message)}
                  />
                </InputField>
              </div>

              {/* Live combined summary — confirms exactly what passengers will see */}
              {departureSummary && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--primary-light)] px-3 py-2.5 text-sm font-medium text-[var(--primary)]">
                  <Clock size={14} />
                  Departing {departureSummary.date} at {departureSummary.time}
                </div>
              )}
            </div>

            {/* Seats & Price */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <h3 className="font-semibold text-[var(--heading)]">
                Seats & Pricing
              </h3>
              <p className="mt-0.5 text-xs text-[var(--text-light)]">
                How many passengers can you take and at what price?
              </p>

              <div className="mt-5 space-y-5">
                <SeatPicker
                  value={values.totalSeats}
                  onChange={(n) =>
                    setValue('totalSeats', n, { shouldValidate: true })
                  }
                />

                <InputField
                  label="Price per Seat (₹)"
                  required
                  icon={DollarSign}
                  error={errors.pricePerSeat?.message}
                >
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 500"
                    {...register('pricePerSeat')}
                    className={inputCls(true, errors.pricePerSeat?.message)}
                  />
                </InputField>
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle size={16} className="shrink-0" />
                {submitError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--primary-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Publishing…
                </>
              ) : (
                <>
                  <Car size={16} />
                  Publish Ride
                </>
              )}
            </button>
          </form>

          {/* Preview */}
          <RidePreview values={values} />
        </div>
      )}
    </div>
  );
}
