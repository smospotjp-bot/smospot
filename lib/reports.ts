import { supabase } from "./supabase";
import type { SmokingReport, SmokingStatus, Spot } from "./types";

/**
 * Fetch all reports for the given place IDs, then fold the most recent report
 * per place into the spot list (status badge, last-confirmed time, closed flag).
 */
export async function enrichWithReports(spots: Spot[]): Promise<Spot[]> {
  const placeIds = spots.map((s) => s.placeId);
  if (placeIds.length === 0) return spots;

  const { data, error } = await supabase
    .from("smoking_reports")
    .select("*")
    .in("place_id", placeIds)
    .order("reported_at", { ascending: false });

  if (error) {
    console.error("[SmoSpot] failed to load reports:", error.message);
    return spots;
  }

  // Latest report wins (query is already sorted desc).
  const latest = new Map<string, SmokingReport>();
  for (const r of (data ?? []) as SmokingReport[]) {
    if (!latest.has(r.place_id)) latest.set(r.place_id, r);
  }

  return spots.map((spot) => {
    const report = latest.get(spot.placeId);
    if (!report) return spot;
    return {
      ...spot,
      status: deriveStatus(spot, report),
      lastConfirmedAt: report.reported_at,
      isClosed: spot.isClosed || report.is_closed,
    };
  });
}

function deriveStatus(spot: Spot, report: SmokingReport): SmokingStatus {
  if (report.is_closed) return spot.status;
  if (report.smoking_allowed === true) return "allowed";
  if (report.smoking_allowed === false) return "not_allowed";
  if (report.smoking_area) return "smoking_area";
  return spot.status;
}
