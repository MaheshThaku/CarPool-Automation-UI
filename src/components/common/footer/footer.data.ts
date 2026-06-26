import {
  FaInstagram,
  FaLinkedinIn,
//   FaYoutube,
  FaFacebook,
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
    icon: FaFacebook,
    href: "https://facebook.com",
    label: "facebook",
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
    // {
    //   label: "Popular Routes",
    //   href: "/routes",
    // },
    {
      label: "Safety",
      href: "/safety",
    },
  ],

  company: [
 {
    label: 'About Us',
    href: '/about',
  },
    {
      label: "Contact Us",
      href: "/contactUs",
    },
    {
      label: "Safety",
      href: "/safety",
    },
  ],

  support: [
    {
      label: "Contact Support",
      href: "/contactUs"
    },
    {
      label: "Community Guidelines",
      href: "/community-guidelines",
    },
    // {
    //   label: "Report Issue",
    //   href: "/report",
    // },
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
      href: "/cookies-policy",
    },
    // {
    //   label: "Refund Policy",
    //   href: "/refund-policy",
    // },
  ],
};