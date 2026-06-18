import { CheckCircle, Mail, Phone, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/cn";
import { ProfileData } from "@/types/profile.types";

interface VerificationCardProps {
  profile: ProfileData;
}

export default function VerificationCard({ profile }: VerificationCardProps) {
  const items = [
    { label: "Email Address", verified: profile.emailVerified, icon: Mail },
    { label: "Phone Number", verified: profile.contactVerified, icon: Phone },
  ];
  const allVerified = items.every((i) => i.verified);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", allVerified ? "bg-green-50" : "bg-amber-50")}>
          <ShieldCheck size={20} className={allVerified ? "text-green-600" : "text-amber-500"} />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--heading)]">Account Verification</h3>
          <p className="text-xs text-[var(--text-light)]">{allVerified ? "Your account is fully verified" : "Complete verification to build trust"}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {items.map(({ label, verified, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
                <Icon size={13} className="text-[var(--text-light)]" />
              </div>
              <span className="text-sm text-[var(--text)]">{label}</span>
            </div>
            {verified ? (
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <CheckCircle size={11} /> Verified
              </span>
            ) : (
              <button className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-100">
                Verify Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
