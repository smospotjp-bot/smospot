import { Loader } from "@googlemaps/js-api-loader";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

let loaderPromise: Promise<typeof google> | null = null;

/**
 * Loads the Google Maps JS API exactly once (singleton) with the libraries
 * we need: maps for rendering, places (New) for search, marker for pins.
 */
export function loadGoogleMaps(): Promise<typeof google> {
  if (!loaderPromise) {
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["maps", "places", "marker"],
      language: "ja",
      region: "JP",
    });
    loaderPromise = loader.load();
  }
  return loaderPromise;
}
