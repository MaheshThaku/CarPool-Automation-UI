import OfferRideForm from "./_components/OfferRideForm";

/**
 * This route previously had its own full, duplicated copy of the offer-ride
 * form with a hardcoded `vehicleId: 0`, which is what caused publish to
 * fail with a 403 from the backend (it rejects rides with no real vehicle).
 * A correct, vehicle-aware implementation already existed in
 * `_components/OfferRideForm.tsx` but was never wired into this route — the
 * route now simply renders it.
 */
export default function OfferRidePage() {
  return <OfferRideForm />;
}
