'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import Container from '@/components/ui/Container';

import LocationField from './LocationField';
import DateField from './DateField';
import PassengerField from './PassengerField';

import { searchRideSchema, SearchRideSchemaType } from './search.schema';

export default function RideSearch() {
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<SearchRideSchemaType>({
    resolver: zodResolver(searchRideSchema),
    mode: 'onChange',
    defaultValues: {
      from: '',
      to: '',
      travelDate: '',
      passengers: 1,
    },
  });

  const values = watch();

  const onSubmit = (data: SearchRideSchemaType) => {
    console.log(data);

    router.push(
      `/find-ride?from=${encodeURIComponent(data.from)}&to=${encodeURIComponent(
        data.to,
      )}&date=${data.travelDate}&passengers=${data.passengers}`,
    );
  };

  return (
    <section className="relative z-20 -mt-14 pb-10">
      <Container>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <LocationField
              label="From"
              placeholder="Enter starting location"
              value={values.from}
              error={errors.from?.message}
              onChange={(e) =>
                setValue('from', e.target.value, {
                  shouldValidate: true,
                })
              }
            />

            <LocationField
              label="To"
              placeholder="Enter destination"
              value={values.to}
              error={errors.to?.message}
              onChange={(e) =>
                setValue('to', e.target.value, {
                  shouldValidate: true,
                })
              }
            />

            <DateField
              value={values.travelDate}
              error={errors.travelDate?.message}
              onChange={(e) =>
                setValue('travelDate', e.target.value, {
                  shouldValidate: true,
                })
              }
            />

            <PassengerField
              value={values.passengers}
              error={errors.passengers?.message}
              onChange={(e) =>
                setValue('passengers', Number(e.target.value), {
                  shouldValidate: true,
                })
              }
            />

            <button
              type="submit"
              disabled={!isValid}
              className="mt-auto h-[58px] rounded-xl bg-[var(--primary)] px-6 font-semibold text-white transition-all hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Search Rides
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
}
