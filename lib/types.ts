export type SmokingStatus = "allowed" | "not_allowed" | "smoking_area" | "unknown";

export interface SmokingReport {
  id: string;
  place_id: string;
  smoking_allowed: boolean | null;
  smoking_area: string | null;
  reported_at: string;
  reporter_ip: string | null;
  is_closed: boolean;
}

export interface Spot {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  /** meters from search center */
  distance: number;
  /** Google business status, e.g. OPERATIONAL / CLOSED_PERMANENTLY */
  businessStatus?: string;
  /** is this a dedicated smoking area vs. a venue */
  isSmokingArea: boolean;
  /** aggregated from user reports */
  status: SmokingStatus;
  lastConfirmedAt: string | null;
  isClosed: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}
