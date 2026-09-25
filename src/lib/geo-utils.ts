export interface UserLocation {
  city: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  isDetected: boolean;
}

// Calculate great-circle distance between two coordinates in kilometers using Haversine formula
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

// Reverse geocode GPS coordinates to city, district, state
export async function reverseGeocode(lat: number, lng: number): Promise<{
  city: string;
  district: string;
  state: string;
  country: string;
  displayName: string;
}> {
  try {
    // Free, no-auth, client-side reverse geocoding API
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.locality || data.city || data.principalSubdivision || "Local Area";
      const district = data.localityInfo?.administrative?.[2]?.name || data.principalSubdivision || city;
      const state = data.principalSubdivision || "Regional State";
      const country = data.countryName || "India";

      return {
        city,
        district,
        state,
        country,
        displayName: `${city}, ${state}`
      };
    }
  } catch (err) {
    console.warn("Reverse geocode failed, using coordinates fallback:", err);
  }

  return {
    city: `GPS ${lat.toFixed(2)}°`,
    district: "Local District",
    state: "Regional Area",
    country: "India",
    displayName: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`
  };
}
