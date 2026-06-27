import { loadGoogleMaps } from "./maps";
import { haversine } from "./distance";
import type { LatLng, Spot } from "./types";

/**
 * Search groups run against the (legacy) Places library Nearby Search, which is
 * enabled on this project. Each group is one nearbySearch call; we merge + dedupe.
 *
 * - `keyword` groups target dedicated smoking spots / pachinko by free text.
 * - `type` groups broadly pull smoking-capable venues (restaurants, cafes, bars).
 *   These come back as "unknown" status until users report smoking availability.
 */
interface SearchGroup {
  type?: string;
  keyword?: string;
  isSmokingArea: boolean;
}

const SEARCH_GROUPS: SearchGroup[] = [
  { keyword: "喫煙所", isSmokingArea: true },
  { keyword: "喫煙スペース", isSmokingArea: true },
  { keyword: "パチンコ", isSmokingArea: false },
  { type: "restaurant", isSmokingArea: false },
  { type: "cafe", isSmokingArea: false },
  { type: "bar", isSmokingArea: false },
];

const SEARCH_RADIUS_M = 2000;
const MAX_RESULTS = 40;

/**
 * Search nearby smoking spots / smoking-capable venues around `center`.
 * Returns de-duplicated spots sorted by distance, capped at MAX_RESULTS.
 * Report-derived fields are enriched separately from Supabase.
 */
export async function searchSmokingSpots(center: LatLng): Promise<Spot[]> {
  const google = await loadGoogleMaps();
  const { PlacesService, PlacesServiceStatus } = (await google.maps.importLibrary(
    "places"
  )) as google.maps.PlacesLibrary;

  // PlacesService needs a DOM node (or map); a detached div is sufficient.
  const service = new PlacesService(document.createElement("div"));
  const location = new google.maps.LatLng(center.lat, center.lng);

  const results = await Promise.all(
    SEARCH_GROUPS.map(
      (group) =>
        new Promise<Spot[]>((resolve) => {
          const request: google.maps.places.PlaceSearchRequest = {
            location,
            radius: SEARCH_RADIUS_M,
            ...(group.type ? { type: group.type } : {}),
            ...(group.keyword ? { keyword: group.keyword } : {}),
          };
          service.nearbySearch(request, (places, status) => {
            if (
              status === PlacesServiceStatus.OK &&
              Array.isArray(places)
            ) {
              resolve(
                places.map((p) => toSpot(p, center, group.isSmokingArea))
              );
            } else {
              if (
                status !== PlacesServiceStatus.ZERO_RESULTS &&
                status !== PlacesServiceStatus.OK
              ) {
                console.warn(
                  `[SmoSpot] nearbySearch (${group.type ?? group.keyword}) → ${status}`
                );
              }
              resolve([]);
            }
          });
        })
    )
  );

  // De-duplicate by placeId (a venue can match multiple groups).
  const byId = new Map<string, Spot>();
  for (const spot of results.flat()) {
    if (!spot.placeId) continue;
    const existing = byId.get(spot.placeId);
    if (!existing) byId.set(spot.placeId, spot);
    // Prefer marking as a dedicated smoking area if any group said so.
    else if (spot.isSmokingArea) existing.isSmokingArea = true;
  }

  return Array.from(byId.values())
    .sort((a, b) => a.distance - b.distance)
    .slice(0, MAX_RESULTS);
}

function toSpot(
  place: google.maps.places.PlaceResult,
  center: LatLng,
  isSmokingArea: boolean
): Spot {
  const loc = place.geometry?.location;
  const lat = loc?.lat() ?? center.lat;
  const lng = loc?.lng() ?? center.lng;
  return {
    placeId: place.place_id ?? "",
    name: place.name ?? "（名称不明）",
    address: place.vicinity ?? place.formatted_address ?? "",
    lat,
    lng,
    distance: haversine(center, { lat, lng }),
    businessStatus: place.business_status ?? undefined,
    isSmokingArea,
    status: isSmokingArea ? "smoking_area" : "unknown",
    lastConfirmedAt: null,
    isClosed: place.business_status === "CLOSED_PERMANENTLY",
  };
}
