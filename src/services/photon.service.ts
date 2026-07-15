const PHOTON_BASE_URL = "https://photon.komoot.io/api";

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
  latitude: number;
  longitude: number;
}

export async function searchLocations(
  query: string
): Promise<LocationResult[]> {
  if (!query.trim()) {
    return [];
  }

  const response = await fetch(
    `${PHOTON_BASE_URL}?q=${encodeURIComponent(query)}&limit=5`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  const data: PhotonResponse = await response.json();

  return data.features.map((feature) => ({
    city: feature.properties.city || feature.properties.name || "",

    address: [
      feature.properties.name,
      feature.properties.city,
      feature.properties.state,
      feature.properties.country,
    ]
      .filter(Boolean)
      .join(", "),

    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
  }));
}