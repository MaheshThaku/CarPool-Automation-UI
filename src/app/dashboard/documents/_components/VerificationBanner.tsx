import { ShieldCheck } from "lucide-react";

import { VerificationItem } from "@/types/dashboard.types";

import { DOC_CATALOGUE } from "./docCatalogue";

interface VerificationBannerProps {
  items: VerificationItem[];
}

export default function VerificationBanner({ items }: VerificationBannerProps) {
  const total = DOC_CATALOGUE.filter((d) => d.required).length;
  const verified = items.filter(
    (i) => i.status === "VERIFIED" && DOC_CATALOGUE.find((d) => d.documentType === i.documentType)
  ).length;
  const pct = total > 0 ? Math.round((verified / total) * 100) : 0;
  const allDone = verified >= total;

  return (
    <div className={`rounded-2xl p-5 ${allDone ? "bg-green-50 border border-green-200" : "border border-[var(--border)] bg-white"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${allDone ? "bg-green-100" : "bg-[var(--primary-light)]"}`}>
          <ShieldCheck size={20} className={allDone ? "text-green-600" : "text-[var(--primary)]"} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--heading)]">
            {allDone ? "Fully Verified!" : "Complete Your Verification"}
          </h3>
          <p className="text-xs text-[var(--text-light)]">
            {allDone
              ? "All required documents verified. Passengers trust you more now."
              : `${verified} of ${total} required documents verified`}
          </p>
        </div>
        {!allDone && (
          <span className="text-lg font-bold text-[var(--primary)]">{pct}%</span>
        )}
      </div>
      {!allDone && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
