import Image from 'next/image';
import { Star } from 'lucide-react';

type Props = {
  image: string;
  name: string;
  location: string;
  review: string;
  rating: number;
};

export default function TestimonialCard({
  image,
  name,
  location,
  review,
  rating,
}: Props) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-xl">
      {/* User */}

      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>

        <div>
          <h3 className="text-base font-semibold text-[var(--heading)]">
            {name}
          </h3>

          <p className="text-sm text-[var(--text-light)]">{location}</p>
        </div>
      </div>

      {/* Rating */}

      <div className="mt-4 flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
            fill={index < rating ? 'currentColor' : 'none'}
            className={
              index < rating ? 'text-[var(--primary)]' : 'text-gray-300'
            }
          />
        ))}

        <span className="ml-2 text-xs font-medium text-[var(--text-light)]">
          {rating}.0
        </span>
      </div>

      {/* Review */}

      <p className="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-[var(--text)]">
        {review}
      </p>
    </article>
  );
}
