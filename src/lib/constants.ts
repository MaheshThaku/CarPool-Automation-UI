export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

export const USER_ROLES = {
  PASSENGER: "PASSENGER",
  RIDER: "RIDER",
} as const;

export const GENDERS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export const AUTH_STATS = [
  {
    value: "500K+",
    label: "Verified Riders",
  },
  {
    value: "50K+",
    label: "Monthly Trips",
  },
  {
    value: "4.9★",
    label: "Community Rating",
  },
];

export const AUTH_FEATURES = [
  {
    title: "Secure & Safe",
    description: "Your safety is our priority",
  },
  {
    title: "Privacy First",
    description: "Your data is always protected",
  },
  {
    title: "24/7 Support",
    description: "We're here to help anytime",
  },
  {
    title: "Verified Users",
    description: "Trusted community of travelers",
  },
];