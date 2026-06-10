import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Props {
  from: string;
  to: string;
  price: number;
  image: string;
}

export default function RouteCard({
  from,
  to,
  price,
  image,
}: Props) {
  return (
    <div
      className="
        group

        overflow-hidden

        rounded-2xl

        border
        border-[var(--border)]

        bg-[var(--surface)]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-[var(--primary)]
        hover:shadow-lg
      "
    >
      <div
        className="
          relative

          h-36
          w-full
        "
      >
        <Image
          src={image}
          alt={`${from} to ${to}`}
          fill
          className="
            object-cover

            transition-transform
            duration-500

            group-hover:scale-105
          "
        />
      </div>

      <div className="p-4">
        <div
          className="
            flex
            items-center
            gap-2

            text-sm
            font-semibold

            text-[var(--heading)]
          "
        >
          <span>{from}</span>

          <ArrowRight
            size={14}
            className="
              text-[var(--primary)]
            "
          />

          <span>{to}</span>
        </div>

        <p
          className="
            mt-2

            text-sm

            text-[var(--text-light)]
          "
        >
          From ₹{price}
        </p>
      </div>
    </div>
  );
}