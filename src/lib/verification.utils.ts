/**
 * verification.utils.ts
 *
 * Pure-function helpers for rider verification status.
 *
 * Why this file exists:
 *  The backend's GET /v1/rider/document/verification/status now returns ALL
 *  four required documents with their actual VerificationStatus (VERIFIED,
 *  PENDING, REJECTED, NOT_SUBMITTED).  Several components previously used an
 *  "inverted" check — `!item` — that was written when the API only returned
 *  *non-verified* documents.  That assumption is no longer valid.
 *
 *  This module is the single source of truth for all verification logic so
 *  the same bug cannot silently reappear in multiple components.
 */

import type { DocStatus, RiderVerificationStatusResponse } from '@/types/dashboard.types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const REQUIRED_DOCUMENT_TYPES = [
  'DRIVING_LICENSE',
  'VEHICLE_RC',
  'VEHICLE_INSURANCE',
  'GOVT_ID',
] as const;

export type RequiredDocumentType = (typeof REQUIRED_DOCUMENT_TYPES)[number];

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Returns the actual verification status of a single document.
 *
 * If the document is absent from the API response (the rider has never
 * uploaded it), we treat it as NOT_PROVIDED — the same sentinel used by the
 * existing DocStatus type.
 */
export function getDocStatus(
  riderVerification: RiderVerificationStatusResponse | null,
  docType: string,
): DocStatus {
  if (!riderVerification) return 'NOT_PROVIDED';

  // Short-circuit: if the rider is overall VERIFIED, every doc is VERIFIED.
  if (riderVerification.overallVerificationStatus === 'VERIFIED') return 'VERIFIED';

  const doc = riderVerification.documents?.find(
    (d) => d.documentType === docType,
  );

  if (!doc) return 'NOT_PROVIDED';

  // Map backend VerificationStatus enum values → frontend DocStatus union.
  // NOT_SUBMITTED is returned by the backend when the rider has never uploaded.
  const raw = doc.verificationStatus as string;
  if (raw === 'NOT_SUBMITTED' || raw === 'NOT_PROVIDED') return 'NOT_PROVIDED';
  if (raw === 'VERIFIED') return 'VERIFIED';
  if (raw === 'REJECTED') return 'REJECTED';
  return 'PENDING';
}

/**
 * Returns true only when a document has the VERIFIED status.
 * Use this instead of the old `!item` pattern.
 */
export function isDocVerified(
  riderVerification: RiderVerificationStatusResponse | null,
  docType: string,
): boolean {
  return getDocStatus(riderVerification, docType) === 'VERIFIED';
}

// ---------------------------------------------------------------------------
// Aggregate helpers
// ---------------------------------------------------------------------------

export interface VerificationSummary {
  /** true when overallVerificationStatus === 'VERIFIED' */
  isOverallVerified: boolean;

  emailVerified: boolean;
  phoneVerified: boolean;

  /** Number of required documents with VERIFIED status (0–4). */
  verifiedDocsCount: number;

  /** Always 4 (DRIVING_LICENSE, VEHICLE_RC, VEHICLE_INSURANCE, GOVT_ID). */
  totalDocsCount: number;

  /** Verified criteria count across email (1), phone (1) and docs (4). */
  completedCount: number;

  /** Always 6. */
  totalCount: number;

  /**
   * Percentage (0–100, integer) of the six rider verification criteria
   * that have been completed.
   */
  percentage: number;
}

/**
 * Derives all aggregate verification numbers from the API response in one
 * place.  Components can destructure exactly what they need.
 */
export function getVerificationSummary(
  riderVerification: RiderVerificationStatusResponse | null,
): VerificationSummary {
  const isOverallVerified =
    riderVerification?.overallVerificationStatus === 'VERIFIED';

  const emailVerified = riderVerification?.emailVerified ?? false;
  const phoneVerified = riderVerification?.phoneVerified ?? false;

  const verifiedDocsCount = REQUIRED_DOCUMENT_TYPES.filter((docType) =>
    isDocVerified(riderVerification, docType),
  ).length;

  const totalDocsCount = REQUIRED_DOCUMENT_TYPES.length; // 4

  const completedCount =
    (emailVerified ? 1 : 0) + (phoneVerified ? 1 : 0) + verifiedDocsCount;

  const totalCount = 2 + totalDocsCount; // 6

  const percentage = Math.round((completedCount / totalCount) * 100);

  return {
    isOverallVerified,
    emailVerified,
    phoneVerified,
    verifiedDocsCount,
    totalDocsCount,
    completedCount,
    totalCount,
    percentage,
  };
}
