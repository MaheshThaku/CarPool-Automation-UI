'use client';
import { Controller, useForm, useWatch } from "react-hook-form";
import LocationAutocomplete from "./LocationAutocomplete";
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  IndianRupee,
  Car,
  Clock,
  AlertCircle,
  ArrowUpDown,
  Plus,
  ShieldAlert,
  Info,
  CheckCircle,
} from 'lucide-react';

import { useAsyncData, invalidateAsyncCache } from '@/hooks/useAsyncData';
import { vehicleService } from '@/services/vehicle.service';
import { rideService } from '@/services/ride.service';
import { dashboardService } from '@/services/dashboard.service';
import { RideResponse, CreateRideRequest } from '@/types/ride.types';
import {
  offerRideSchema,
  OfferRideFormValues,
} from '@/schemas/publish-ride.schema';
import { LocationResult } from '@/services/photon.service';

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

import UnverifiedRiderState from './UnverifiedRiderState';

const REQUIRED_DOCS = [
  { key: 'DRIVING_LICENSE', label: 'Driving License' },
  { key: 'VEHICLE_RC', label: 'Vehicle RC (Registration)' },
  { key: 'VEHICLE_INSURANCE', label: 'Vehicle Insurance' },
  { key: 'GOVT_ID', label: 'Government ID (Aadhaar/PAN)' },
];

const QUICK_PICK_DATES = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In a Week', days: 7 },
] as const;

const DEFAULT_FORM_VALUES: OfferRideFormValues = {
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
};

export default function OfferRideForm() {
  const vehicles$ = useAsyncData(() => vehicleService.getMyVehicles(), [], {
    cacheKey: 'my-vehicles',
  });
  const vehicles = vehicles$.data ?? [];

  // Fetch rider verification status
  const verification$ = useAsyncData(dashboardService.getRiderVerificationStatus, [], {
    cacheKey: 'rider-verification-status',
  });
  const verificationData = verification$.data;
  const isOverallVerified = verificationData?.overallVerificationStatus === 'VERIFIED';

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
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const watchedValues = useWatch({ control });
  const values: OfferRideFormValues = {
    vehicleId: watchedValues.vehicleId ?? DEFAULT_FORM_VALUES.vehicleId,

    sourceCity: watchedValues.sourceCity ?? DEFAULT_FORM_VALUES.sourceCity,
    sourceAddress: watchedValues.sourceAddress ?? DEFAULT_FORM_VALUES.sourceAddress,
    sourceLatitude: watchedValues.sourceLatitude ?? DEFAULT_FORM_VALUES.sourceLatitude,
    sourceLongitude: watchedValues.sourceLongitude ?? DEFAULT_FORM_VALUES.sourceLongitude,

    destinationCity: watchedValues.destinationCity ?? DEFAULT_FORM_VALUES.destinationCity,
    destinationAddress: watchedValues.destinationAddress ?? DEFAULT_FORM_VALUES.destinationAddress,
    destinationLatitude: watchedValues.destinationLatitude ?? DEFAULT_FORM_VALUES.destinationLatitude,
    destinationLongitude: watchedValues.destinationLongitude ?? DEFAULT_FORM_VALUES.destinationLongitude,

    departureDate: watchedValues.departureDate ?? DEFAULT_FORM_VALUES.departureDate,
    departureTime: watchedValues.departureTime ?? DEFAULT_FORM_VALUES.departureTime,

    pricePerSeat: watchedValues.pricePerSeat ?? DEFAULT_FORM_VALUES.pricePerSeat,
    totalSeats: watchedValues.totalSeats ?? DEFAULT_FORM_VALUES.totalSeats,
  };

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

  function handlePickupSelect(location: LocationResult, onCityChange: (city: string) => void) {
    onCityChange(location.city);
    setValue("sourceAddress", location.address, { shouldValidate: true });
    setValue("sourceLatitude", location.latitude, { shouldValidate: true });
    setValue("sourceLongitude", location.longitude, { shouldValidate: true });
  }

  function handleDestinationSelect(location: LocationResult, onCityChange: (city: string) => void) {
    onCityChange(location.city);
    setValue("destinationAddress", location.address, { shouldValidate: true });
    setValue("destinationLatitude", location.latitude, { shouldValidate: true });
    setValue("destinationLongitude", location.longitude, { shouldValidate: true });
  }

  function handleSwapLocations() {
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

    setValue("sourceCity", destination.city, { shouldValidate: true });
    setValue("sourceAddress", destination.address, { shouldValidate: true });
    setValue("sourceLatitude", destination.lat, { shouldValidate: true });
    setValue("sourceLongitude", destination.lng, { shouldValidate: true });

    setValue("destinationCity", source.city, { shouldValidate: true });
    setValue("destinationAddress", source.address, { shouldValidate: true });
    setValue("destinationLatitude", source.lat, { shouldValidate: true });
    setValue("destinationLongitude", source.lng, { shouldValidate: true });
  }

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
    reset(DEFAULT_FORM_VALUES);
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

  if (verification$.loading) {
    return (
      <div className="space-y-4 py-6">
        <div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  // Strict check: if overall verification is incomplete, render UnverifiedRiderState instead of the form
  if (!isOverallVerified) {
    return <UnverifiedRiderState verificationData={verificationData} />;
  }

  let content;

  if (vehicles$.loading) {
    content = (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  } else if (vehicles.length === 0) {
    content = <NoVehicleState />;
  } else {
    content = (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Vehicle */}
          <div className="rounded-2xl border border-(--border) bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-(--heading)">Vehicle</h3>
                <p className="mt-0.5 text-xs text-(--text-light)">
                  Defaults to your primary vehicle — change it anytime.
                </p>
              </div>
              <Link
                href="/dashboard/vehicles"
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-(--primary) hover:bg-(--primary-light)"
              >
                <Plus size={13} /> Add vehicle
              </Link>
            </div>

            <div className="mt-5 max-w-lg">
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
          <div className="rounded-2xl border border-(--border) bg-white p-6">
            <h3 className="font-semibold text-(--heading)">Route Details</h3>
            <p className="mt-0.5 text-xs text-(--text-light)">
              Where are you starting and where are you going?
            </p>

            <div className="mt-5 max-w-sm">
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
                      inputClassName={inputCls(
                        true,
                        errors.sourceCity?.message,
                      )}
                      onSelect={(location) =>
                        handlePickupSelect(location, field.onChange)
                      }
                    />
                  )}
                />
              </InputField>

              {/* Floating Swap Button */}
              <div className="relative z-10 h-0 w-full">
                <div className="absolute right-0 translate-x-1/2 sm:-right-12 sm:translate-x-0">
                  {/* 'group' class added here to detect hover */}
                  <div className="group relative flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      // Native fallback for browsers/screen-readers
                      title="Swap starting point and Destination"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:text-(--primary) active:scale-95"
                      aria-label="Swap locations"
                    >
                      <ArrowUpDown size={16} strokeWidth={2.5} />
                    </button>

                    {/* Premium Tailwind Tooltip */}
                    <span className="pointer-events-none absolute top-1/2 right-full z-50 mr-2 -translate-y-1/2 rounded-lg bg-gray-800 px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 sm:right-auto sm:left-full sm:mr-0 sm:ml-2">
                      Swap Starting point and Destination point
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
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
                        inputClassName={inputCls(
                          true,
                          errors.destinationCity?.message,
                        )}
                        onSelect={(location) =>
                          handleDestinationSelect(location, field.onChange)
                        }
                      />
                    )}
                  />
                </InputField>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border border-(--border) bg-white p-6">
            <h3 className="font-semibold text-(--heading)">Schedule</h3>
            <p className="mt-0.5 text-xs text-(--text-light)">
              When is your departure?
            </p>

            {/* Quick-pick date chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_PICK_DATES.map(({ label, days }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    setValue('departureDate', dateOffset(days), {
                      shouldValidate: true,
                    })
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    values.departureDate === dateOffset(days)
                      ? 'border-(--primary) bg-(--primary-light) text-(--primary)'
                      : 'border-(--border) bg-white text-(--text) hover:border-(--primary) hover:text-(--primary)'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Note: I added max-w-lg here too so it aligns beautifully with the Route inputs */}
            <div className="mt-4 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
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
              <div className="mt-4 flex max-w-lg items-center gap-2 rounded-xl bg-(--primary-light) px-3 py-2.5 text-sm font-medium text-(--primary)">
                <Clock size={14} />
                Departing {departureSummary.date} at {departureSummary.time}
              </div>
            )}
          </div>

          {/* Seats & Price */}
          <div className="rounded-2xl border border-(--border) bg-white p-6">
            <h3 className="font-semibold text-(--heading)">Seats & Pricing</h3>
            <p className="mt-0.5 text-xs text-(--text-light)">
              How many passengers can you take and at what price?
            </p>

            {/* Added max-w-lg for visual consistency across the whole form */}
            <div className="mt-5 max-w-lg space-y-5">
              <SeatPicker
                value={values.totalSeats}
                onChange={(n) =>
                  setValue('totalSeats', n, { shouldValidate: true })
                }
              />

              <InputField
                label="Price per Seat (₹)"
                required
                icon={IndianRupee}
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-(--primary-hover) active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{' '}
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-(--heading)">Offer a Ride</h2>
        <p className="mt-1 text-sm text-(--text)">
          Fill in the details below to publish your ride.
        </p>
      </div>

      {/* Main Content Injection */}
      {content}
    </div>
  );
}