import { LucideIcon } from "lucide-react";

interface Props {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function StepCard({
  number,
  title,
  description,
  icon: Icon,
}: Props) {
  return (
    <div
      className="
        group
        relative

        h-full
        min-h-[210px]

        rounded-3xl

        border
        border-[var(--border)]

        bg-[var(--surface)]

        p-6

        transition-all
        duration-300

        hover:-translate-y-2
        hover:border-[var(--primary)]
        hover:shadow-xl
      "
    >
      {/* Number */}

      <div
        className="
          mb-6

          flex
          h-12
          w-12
          items-center
          justify-center

          rounded-2xl

          bg-[var(--primary)]

          text-lg
          font-bold
          text-white
        "
      >
        {number}
      </div>

      {/* Content */}

      <div className="pr-16">
        <h3
          className="
            text-2xl
            font-bold

            text-[var(--heading)]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-3

            text-base
            leading-relaxed

            text-[var(--text-light)]
          "
        >
          {description}
        </p>
      </div>

      {/* Icon */}

      <div
        className="
          absolute
          bottom-6
          right-6

          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-2xl

          bg-[var(--primary)]/10

          transition-all
          duration-300

          group-hover:bg-[var(--primary)]
        "
      >
        <Icon
          size={30}
          className="
            text-[var(--primary)]

            transition-colors
            duration-300

            group-hover:text-white
          "
        />
      </div>
    </div>
  );
}