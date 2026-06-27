import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

interface ReportBody {
  place_id: string;
  smoking_allowed?: boolean | null;
  smoking_area?: string | null;
  is_closed?: boolean;
}

/** GET /api/reports?place_id=xxx — latest reports for one place. */
export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("place_id");
  if (!placeId) {
    return NextResponse.json({ error: "place_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("smoking_reports")
    .select("*")
    .eq("place_id", placeId)
    .order("reported_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ reports: data ?? [] });
}

/** POST /api/reports — submit a smoking/closure report. */
export async function POST(req: NextRequest) {
  let body: ReportBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.place_id) {
    return NextResponse.json({ error: "place_id is required" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    null;

  const { data, error } = await supabase
    .from("smoking_reports")
    .insert({
      place_id: body.place_id,
      smoking_allowed: body.smoking_allowed ?? null,
      smoking_area: body.smoking_area ?? null,
      is_closed: body.is_closed ?? false,
      reporter_ip: ip,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ report: data }, { status: 201 });
}
