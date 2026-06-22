import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { BsTwitterX } from "react-icons/bs";

export const socialLinks = [
  {
    icon: FaInstagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: FaLinkedinIn,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: BsTwitterX,
    href: "https://x.com",
    label: "X",
  },
  {
    icon: FaYoutube,
    href: "https://youtube.com",
    label: "YouTube",
  },
];
export const footerLinks = {
  product: [
    {
      label: "Find Ride",
      href: "/find-ride",
    },
    {
      label: "Offer Ride",
      href: "/offer-ride",
    },
    {
      label: "Popular Routes",
      href: "/routes",
    },
    {
      label: "Safety",
      href: "/safety",
    },
  ],

  company: [
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Contact Us",
      href: "#faq",
    },
    {
      label: "FAQs",
      href: "#faq",
    },
  ],

  support: [
    {
      label: "Help Center",
      href: "/help-center",
    },
    {
      label: "Contact Support",
      href:
        "mailto:manavraju12@gmail.com",
    },
    {
      label: "Community Guidelines",
      href: "/community",
    },
    {
      label: "Report Issue",
      href: "/report",
    },
  ],

  legal: [
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Terms & Conditions",
      href: "/terms-and-conditions",
    },
    {
      label: "Cookie Policy",
      href: "/cookie-policy",
    },
    {
      label: "Refund Policy",
      href: "/refund-policy",
    },
  ],
};