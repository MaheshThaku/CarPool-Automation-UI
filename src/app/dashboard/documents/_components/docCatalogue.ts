import { FileText, Upload, CheckCircle, Clock, XCircle, ShieldCheck, Car, CreditCard } from "lucide-react";

import { DocStatus } from "@/types/dashboard.types";

export interface DocConfig {
  documentType: string;
  label: string;
  description: string;
  icon: React.ElementType;
  required: boolean;
  acceptedFormats: string;
  maxSizeMB: number;
}

/** Document catalogue — shown whether or not the API returns data. */
export const DOC_CATALOGUE: DocConfig[] = [
  {
    documentType: "DRIVING_LICENSE",
    label: "Driving License",
    description: "Valid driving license issued by the government. Must be current and not expired.",
    icon: CreditCard,
    required: true,
    acceptedFormats: "JPG, PNG, PDF",
    maxSizeMB: 5,
  },
  {
    documentType: "VEHICLE_RC",
    label: "Vehicle Registration (RC)",
    description: "Registration certificate of the vehicle you'll use for rides.",
    icon: Car,
    required: true,
    acceptedFormats: "JPG, PNG, PDF",
    maxSizeMB: 5,
  },
  {
    documentType: "VEHICLE_INSURANCE",
    label: "Vehicle Insurance",
    description: "Valid comprehensive insurance policy for your vehicle.",
    icon: ShieldCheck,
    required: true,
    acceptedFormats: "JPG, PNG, PDF",
    maxSizeMB: 5,
  },
  {
    documentType: "GOVT_ID",
    label: "Government ID",
    description: "Aadhaar card, PAN card, or passport for identity verification.",
    icon: FileText,
    required: false,
    acceptedFormats: "JPG, PNG, PDF",
    maxSizeMB: 5,
  },
];

export function statusDisplay(status: DocStatus) {
  switch (status) {
    case "VERIFIED":
      return {
        label: "Verified",
        icon: CheckCircle,
        chip: "bg-green-50 text-green-700",
        border: "border-green-200",
        iconColor: "text-green-600",
      };
    case "PENDING":
      return {
        label: "Under Review",
        icon: Clock,
        chip: "bg-amber-50 text-amber-700",
        border: "border-amber-200",
        iconColor: "text-amber-500",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        icon: XCircle,
        chip: "bg-red-50 text-red-600",
        border: "border-red-200",
        iconColor: "text-red-500",
      };
    default:
      return {
        label: "Not Uploaded",
        icon: Upload,
        chip: "bg-gray-100 text-gray-600",
        border: "border-[var(--border)]",
        iconColor: "text-gray-400",
      };
  }
}
