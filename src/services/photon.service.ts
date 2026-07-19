const PHOTON_BASE_URL = 'https://photon.komoot.io/api';
const RESULTS_LIMIT = 5;
const REQUEST_TIMEOUT_MS = 8000;
const DEDUPE_COORD_PRECISION = 2; // ~1.1km grouping fallback when postcode is unavailable

export interface PhotonFeature {
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export interface PhotonResponse {
  features: PhotonFeature[];
}

export interface LocationResult {
  city: string;
  address: string;
  subtitle?: string; // postcode — shown to the user instead of raw coordinates
  latitude: number;
  longitude: number;
}

function buildAddress(properties: PhotonFeature['properties']): string {
  return [
    properties.name,
    properties.city,
    properties.state,
    properties.country,
  ]
    .filter(Boolean)
    .join(', ');
}

function dedupeResults(results: LocationResult[]): LocationResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = r.subtitle
      ? `${r.address.toLowerCase()}-${r.subtitle}`
      : `${r.address.toLowerCase()}-${r.latitude.toFixed(DEDUPE_COORD_PRECISION)}-${r.longitude.toFixed(DEDUPE_COORD_PRECISION)}`;
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
  signal?.addEventListener('abort', () => controller.abort());

  try {
    const response = await fetch(
      `${PHOTON_BASE_URL}?q=${encodeURIComponent(trimmed)}&limit=${RESULTS_LIMIT}`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`);
    }

    const data: PhotonResponse = await response.json();

    const results: LocationResult[] = data.features.map((feature) => ({
      city: feature.properties.city || feature.properties.name || '',
      address: buildAddress(feature.properties),
      subtitle: feature.properties.postcode,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    }));

    return dedupeResults(results);
  } finally {
    clearTimeout(timeoutId);
  }
}
