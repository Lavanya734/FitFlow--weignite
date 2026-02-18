

export interface Restaurant {
  name: string;
  rating?: number;
  address?: string;
  distance?: string;
  lat: number;
  lng: number;
  cuisine?: string;
  opening_hours?: string;
  image?: string;
  mapsUrl?: string;
}
 
const GEOAPIFY_KEY = "18296eea673f471b86ea07c3ba81c028" ;

const DEFAULT_COORDS = {
  lat: 28.7041,
  lng: 77.1025,
};

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}


function getRandomRestaurantImage(
  name: string,
  lat: number,
  lng: number
): string {
  // unique seed per restaurant
  const seed = Math.abs(
    [...(name + lat + lng)]
      .map((c) => c.charCodeAt(0))
      .reduce((a, b) => a + b, 0)
  );

  // pick different restaurant-related topic
  const topics = [
    "restaurant",
    "cafe",
    "food",
    "dining",
    "meal",
    "kitchen",
    "pizza",
    "burger",
    "salad",
    "coffee",
    "indian-food",
    "restaurant-interior",
  ];

  const topic = topics[seed % topics.length];

  // IMPORTANT → cache buster prevents same image
  return `https://source.unsplash.com/800x600/?${topic}&sig=${seed}&t=${seed}`;
}
let cache: Restaurant[] | null = null;
let lastFetch = 0;
const CACHE_TIME = 60 * 1000;


export async function fetchHealthyRestaurants(
  lat: number = DEFAULT_COORDS.lat,
  lng: number = DEFAULT_COORDS.lng,
  radiusKm: number = 2
): Promise<Restaurant[]> {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  try {
    const radiusMeters = radiusKm * 1000;

    const url = `https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.cafe&filter=circle:${lng},${lat},${radiusMeters}&limit=20&apiKey=${GEOAPIFY_KEY}`;

    const res = await fetch(url);
    if (!res.ok) return cache ?? [];

    const data = await res.json();
    if (!data.features) return [];

    const restaurants: Restaurant[] = data.features
      .map((f: any) => {
        const p = f.properties;
        const lat2 = p.lat;
        const lng2 = p.lon;
        if (!lat2 || !lng2) return null;

        const name = p.name || "Restaurant";
        const distance = calculateDistance(lat, lng, lat2, lng2).toFixed(1);

        return {
          name,
          lat: lat2,
          lng: lng2,
          distance,
          address: p.formatted || "Address not available",
          cuisine: p.catering?.cuisine || "Restaurant",
          opening_hours: p.opening_hours,
          rating: p.rating,

          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${name} ${p.formatted || ""}`
          )}`,

          image: getRandomRestaurantImage(name, lat2, lng2),
        };
      })
      .filter(Boolean) as Restaurant[];

    const sorted = restaurants
      .sort(
        (a, b) =>
          parseFloat(a.distance || "999") -
          parseFloat(b.distance || "999")
      )
      .slice(0, 12);

    cache = sorted;
    lastFetch = now;

    return sorted;
  } catch (err) {
    console.error("Restaurant fetch error:", err);
    return cache ?? [];
  }
}


export async function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => resolve(DEFAULT_COORDS),
      { timeout: 10000 }
    );
  });
}