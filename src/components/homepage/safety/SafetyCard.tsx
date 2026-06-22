import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

export default function SafetyCard({
  title,
  subtitle,
  icon: Icon,
}: Props) {
  return (
    <div
      className="
        group

        flex
        flex-col
        items-center
        justify-center

        rounded-2xl
        border
        border-[var(--border)]

        bg-[var(--surface)]

        p-5

        text-center

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-[var(--primary)]
        hover:shadow-lg
      "
    >
      <div
        className="
          mb-4

          flex
          h-16
          w-16
          items-center
          justify-center

          rounded-2xl

          bg-[var(--primary)]/10

          transition-all

          group-hover:bg-[var(--primary)]
        "
      >
        <Icon
          size={30}
          className="
            text-[var(--primary)]

            group-hover:text-white
          "
        />
      </div>

      <h4
        className="
          text-sm
          font-semibold
          text-[var(--heading)]
        "
      >
        {title}
      </h4>

      <p
        className="
          mt-1
          text-xs
          text-[var(--text-light)]
        "
      >
        {subtitle}
      </p>
    </div>
  );
}