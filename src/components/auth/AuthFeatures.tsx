import {
  BadgeCheck,
  Headphones,
  Lock,
  Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Your safety is our priority",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is always protected",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help anytime",
  },
  {
    icon: BadgeCheck,
    title: "Verified Users",
    description: "Trusted community of travelers",
  },
];

export default function AuthFeatures() {
  return (
    <div
      className="
        hidden lg:grid

        grid-cols-4

        overflow-hidden

        rounded-2xl

        bg-black/70
        backdrop-blur-lg

        shadow-lg
      "
    >
      {FEATURES.map(
        (
          { icon: Icon, title, description },
          index
        ) => (
          <div
            key={title}
            className={`
              flex
              flex-col
              items-center
              justify-center

              px-4
              py-4

              text-center

              ${
                index !== FEATURES.length - 1
                  ? "border-r border-white/10"
                  : ""
              }
            `}
          >
            <Icon
              size={22}
              className="
                mb-2
                text-[var(--primary)]
              "
            />

            <h4
              className="
                text-xs
                font-semibold
                text-white
              "
            >
              {title}
            </h4>

            <p
              className="
                mt-1

                max-w-[140px]

                text-[11px]
                leading-4

                text-white/70
              "
            >
              {description}
            </p>
          </div>
        )
      )}
    </div>
  );
}