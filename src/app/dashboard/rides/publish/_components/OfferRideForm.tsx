'use client';
import { Controller, useForm, useWatch } from "react-hook-form";
import LocationAutocomplete from "./LocationAutocomplete";
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  DollarSign,
  Car,
  Clock,
  AlertCircle,
  ArrowLeftRight,
  Plus,
} from 'lucide-react';


import { useAsyncData, invalidateAsyncCache } from '@/hooks/useAsyncData';
import { vehicleService } from '@/services/vehicle.service';
import { rideService } from '@/services/ride.service';
import { RideResponse, CreateRideRequest } from '@/types/ride.types';
import {
  offerRideSchema,
  OfferRideFormValues,
} from '@/schemas/publish-ride.schema';

import {
  toLocalDateTime,
  todayMin,
  dateOffset,
  inputCls,
  formatDisplayDate,
} from './utils';
import InputField from './InputField';
import SeatPicker from './SeatPicker';
import RidePreview from './RidePreview';
import SuccessState from './SuccessState';
import NoVehicleState from './NoVehicleState';

export default function OfferRideForm() {
  const vehicles$ = useAsyncData(() => vehicleService.getMyVehicles(), [], {
    cacheKey: 'my-vehicles',
  });
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

      sourceCity: "",
      sourceAddress: "",
      sourceLatitude: 0,
      sourceLongitude: 0,

      destinationCity: "",
      destinationAddress: "",
      destinationLatitude: 0,
      destinationLongitude: 0,

      totalSeats: 2,

      departureDate: "",
      departureTime: "",

      pricePerSeat: "",
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
    vehicleId: watchedValues.vehicleId ?? 0,

    sourceCity: watchedValues.sourceCity ?? "",
    sourceAddress: watchedValues.sourceAddress ?? "",
    sourceLatitude: watchedValues.sourceLatitude ?? 0,
    sourceLongitude: watchedValues.sourceLongitude ?? 0,

    destinationCity: watchedValues.destinationCity ?? "",
    destinationAddress: watchedValues.destinationAddress ?? "",
    destinationLatitude: watchedValues.destinationLatitude ?? 0,
    destinationLongitude: watchedValues.destinationLongitude ?? 0,

    departureDate: watchedValues.departureDate ?? "",
    departureTime: watchedValues.departureTime ?? "",

    pricePerSeat: watchedValues.pricePerSeat ?? "",
    totalSeats: watchedValues.totalSeats ?? 2,
  };

  // A vehicle is always pre-selected so the rider never has to choose one
  // just to publish a ride. The default is the first vehicle they added
  // (lowest id) — same rule the Manage Vehicles page uses for its "Default"
  // badge. With 2+ vehicles they can still change the selection from the
  // dropdown; this just removes the forced empty first choice.
  useEffect(() => {
    if (vehicles.length > 0 && !values.vehicleId) {
      const defaultVehicle = vehicles.reduce(
        (min, v) => (v.id < min.id ? v : min),
        vehicles[0],
      );
      setValue('vehicleId', defaultVehicle.id, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles.length]);

  const departureSummary = formatDisplayDate(
    values.departureDate,
    values.departureTime,
  );

  const onSubmit = async (data: OfferRideFormValues) => {
    setSubmitError('');
    try {
      const publishRideRequest: CreateRideRequest = {
        sourceCity: data.sourceCity,
        sourceAddress: data.sourceAddress,
        sourceLatitude: data.sourceLatitude,
        sourceLongitude: data.sourceLongitude,

        destinationCity: data.destinationCity,
        destinationAddress: data.destinationAddress,
        destinationLatitude: data.destinationLatitude,
        destinationLongitude: data.destinationLongitude,

        departureTime: toLocalDateTime(
          data.departureDate,
          data.departureTime
        ),

        pricePerSeat: Number(data.pricePerSeat),
        totalSeats: data.totalSeats,
        vehicleId: data.vehicleId,
      };

      const ride = await rideService.publishRide(publishRideRequest);
      // A freshly published ride changes the rider's ride list, the
      // upcoming-rides widget, and the dashboard stats — drop those cached
      // entries so the next visit to those pages fetches current data
      // instead of serving what was cached before this ride existed.
      invalidateAsyncCache('rider-rides-list');
      invalidateAsyncCache('rider-upcoming-rides');
      invalidateAsyncCache('rider-stats');
      setPublishedRide(ride);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setSubmitError(msg || 'Failed to publish ride. Please try again.');
    }
  };

  const handleOfferAnother = () => {
    setPublishedRide(null);
    setSubmitError("");

    reset({
      vehicleId: 0,

      sourceCity: "",
      sourceAddress: "",
      sourceLatitude: 0,
      sourceLongitude: 0,

      destinationCity: "",
      destinationAddress: "",
      destinationLatitude: 0,
      destinationLongitude: 0,

      departureDate: "",
      departureTime: "",

      totalSeats: 2,
      pricePerSeat: "",
    });
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
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">
          Offer a Ride
        </h2>
        <p className="mt-1 text-sm text-[var(--text)]">
          Fill in the details below to publish your ride. it.
        </p>
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
            {/* Vehicle */}
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--heading)]">
                    Vehicle
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--text-light)]">
                    Defaults to your primary vehicle — change it anytime.
                  </p>
                </div>
                <Link
                  href="/dashboard/vehicles"
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary-light)]"
                >
                  <Plus size={13} /> Add vehicle
                </Link>
              </div>

              <div className="mt-5">
                <InputField
                  label="Choose Vehicle"
                  required
                  icon={Car}
                  error={errors.vehicleId?.message}
                >
                  <select
                    {...register('vehicleId', { valueAsNumber: true })}
                    className={inputCls(true, errors.vehicleId?.message)}
                  >
                    <option value={0} disabled>
                      Select a vehicle…
                    </option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.model} — {v.registrationNumber}
                      </option>
                    ))}
                  </select>
                </InputField>
              </div>
            </div>

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
                  label="Pickup Location"
                  required
                  icon={MapPin}
                  error={errors.sourceCity?.message}
                >
                  <Controller
                    control={control}
                    name="sourceCity"
                    render={({ field }) => (
                      <LocationAutocomplete
                        label=""
                        placeholder="Search pickup location..."
                        value={values.sourceAddress}
                        onSelect={(location) => {
                          field.onChange(location.city);

                          setValue("destinationAddress", location.address, {
                            shouldValidate: true,
                          });

                          setValue("destinationLatitude", location.latitude, {
                            shouldValidate: true,
                          });

                          setValue("destinationLongitude", location.longitude, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    )}
                  />
                </InputField>

                {/* Swap button */}
                <div className="hidden sm:col-span-2 sm:-my-2 sm:flex sm:justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const source = {
                        city: values.sourceCity,
                        address: values.sourceAddress,
                        lat: values.sourceLatitude,
                        lng: values.sourceLongitude,
                      };

                      const destination = {
                        city: values.destinationCity,
                        address: values.destinationAddress,
                        lat: values.destinationLatitude,
                        lng: values.destinationLongitude,
                      };

                      setValue("sourceAddress", destination.address, {
                        shouldValidate: true,
                      });

                      setValue("sourceLatitude", destination.lat, {
                        shouldValidate: true,
                      });

                      setValue("sourceLongitude", destination.lng, {
                        shouldValidate: true,
                      });

                      setValue("destinationCity", source.city, {
                        shouldValidate: true,
                      });

                      setValue("destinationAddress", source.address, {
                        shouldValidate: true,
                      });

                      setValue("destinationLatitude", source.lat, {
                        shouldValidate: true,
                      });

                      setValue("destinationLongitude", source.lng, {
                        shouldValidate: true,
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <ArrowLeftRight size={13} /> Swap
                  </button>
                </div>

                <InputField

                  label="Drop Location"
                  required
                  icon={MapPin}
                  error={errors.destinationCity?.message}
                >
                  <Controller
                    control={control}
                    name="destinationCity"
                    render={({ field }) => (
                      <LocationAutocomplete
                        label=""
                        placeholder="Search destination..."
                        value={values.destinationAddress}
                        onSelect={(location) => {
                          setValue("destinationCity", location.city, {
                            shouldValidate: true,
                          });

                          field.onChange(location.city);

                          setValue("destinationAddress", location.address, {
                            shouldValidate: true,
                          });

                          setValue("destinationLatitude", location.latitude);

                          setValue("destinationLongitude", location.longitude);
                        }}
                      />
                    )}
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

              {/* Quick-pick date chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: 'Today', days: 0 },
                  { label: 'Tomorrow', days: 1 },
                  { label: 'In a Week', days: 7 },
                ].map(({ label, days }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      setValue('departureDate', dateOffset(days), {
                        shouldValidate: true,
                      })
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${values.departureDate === dateOffset(days)
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                      : 'border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
