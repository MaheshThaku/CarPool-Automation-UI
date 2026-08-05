const PHOTON_BASE_URL = 'https://photon.komoot.io/api';
const RESULTS_LIMIT = 5;
const REQUEST_TIMEOUT_MS = 8000;

// Restrict geocoding to India: a bounding box (minLon,minLat,maxLon,maxLat)
// hard-constrains the Photon query, and a per-result country check is the
// safety net so non-Indian places never appear in suggestions.
const INDIA_BBOX = '66.0,6.0,99.0,39.0';

// `lang=en` keeps names/addresses (and the country labels) in English —
// without it Photon can return localized names (e.g. "पाकिस्तान" for Pakistan).
// The ISO `countrycode` below is never localized, which is why it is checked first.
const INDIA_COUNTRY_KEYS = new Set(['india', 'in']);

export interface PhotonFeature {
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    postcode?: string;
    street?: string;
    district?: string;
  };
}

export interface PhotonResponse {
  features: PhotonFeature[];
}

export interface LocationResult {
  city: string;
  address: string;
  /** Primary identifier (name, or city/state fallback) — bolded in the list. */
  mainText: string;
  /** Contextual address minus mainText — dimmed in the list. */
  subText: string;
  subtitle?: string; // postcode — shown to the user instead of raw coordinates
  latitude: number;
  longitude: number;
}

/** True when the result is Indian. The ISO country code is checked first
 *  because it is never localized (Photon can return localized country names,
 *  e.g. "पाकिस्तान"); the name is a fallback. Results with no country info
 *  are trusted to the bbox (they're inside India anyway). */
function isIndianFeature(feature: PhotonFeature): boolean {
  const code = (feature.properties.countrycode ?? '').toLowerCase().trim();
  if (code) return INDIA_COUNTRY_KEYS.has(code);
  const country = (feature.properties.country ?? '').toLowerCase().trim();
  if (country) return INDIA_COUNTRY_KEYS.has(country);
  return true;
}

/** Merge exact duplicates by primary name + contextual address, so a single
 *  feature returned multiple times (different postcodes, etc.) shows once. */
function dedupeResults(results: LocationResult[]): LocationResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.mainText.toLowerCase()}::${r.subText.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<LocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const response = await fetch(
      `${PHOTON_BASE_URL}?q=${encodeURIComponent(trimmed)}&limit=${RESULTS_LIMIT}&lang=en&bbox=${INDIA_BBOX}`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`);
    }

    const data: PhotonResponse = await response.json();

    const results: LocationResult[] = data.features
      .filter(isIndianFeature)
      .map((feature) => {
        const p = feature.properties;

        // Primary identifier for the location.
        const mainText = p.name || p.city || p.state || 'Unknown Location';

        // Build the contextual address (avoiding duplicating mainText).
        const subParts: string[] = [];
        if (p.street && p.street !== mainText) subParts.push(p.street);
        if (p.district && p.district !== mainText) subParts.push(p.district);
        if (p.city && p.city !== mainText) subParts.push(p.city);
        if (p.state && p.state !== mainText) subParts.push(p.state);
        if (p.country && p.country !== mainText) subParts.push(p.country);

        const subText = subParts.filter(Boolean).join(', ');
        const address = subText ? `${mainText}, ${subText}` : mainText;

        return {
          city: p.city || p.name || '',
          address,
          mainText,
          subText,
          subtitle: p.postcode,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        };
      });

    return dedupeResults(results);
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onAbort);
  }
}
