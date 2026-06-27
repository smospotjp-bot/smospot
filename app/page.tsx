"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { MapView } from "@/components/MapView";
import { SpotList } from "@/components/SpotList";
import { Disclaimer } from "@/components/Disclaimer";
import { ReportModal } from "@/components/ReportModal";
import { loadGoogleMaps } from "@/lib/maps";
import { searchSmokingSpots } from "@/lib/places";
import { enrichWithReports } from "@/lib/reports";
import type { LatLng, Spot } from "@/lib/types";

export default function Home() {
  const [center, setCenter] = useState<LatLng | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reportSpot, setReportSpot] = useState<Spot | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const runSearch = useCallback(async (at: LatLng) => {
    setLoading(true);
    setMessage(null);
    try {
      const found = await searchSmokingSpots(at);
      const enriched = await enrichWithReports(found);
      setSpots(enriched);
      if (enriched.length === 0) setMessage("このエリアでは見つかりませんでした。");
    } catch (e) {
      console.error(e);
      setMessage("検索中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setMessage("この端末では位置情報を取得できません。");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const at = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(at);
        setLocating(false);
        runSearch(at);
      },
      (err) => {
        console.error(err);
        setLocating(false);
        setMessage("位置情報の取得が許可されませんでした。");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [runSearch]);

  // Keyword search: geocode the area, recenter, then search.
  const handleSearch = useCallback(
    async (keyword: string) => {
      if (!keyword) {
        if (center) runSearch(center);
        return;
      }
      setLoading(true);
      setMessage(null);
      try {
        const google = await loadGoogleMaps();
        const geocoder = new google.maps.Geocoder();
        const { results } = await geocoder.geocode({
          address: keyword,
          region: "jp",
        });
        const loc = results[0]?.geometry.location;
        if (!loc) {
          setMessage("エリアが見つかりませんでした。");
          setLoading(false);
          return;
        }
        const at = { lat: loc.lat(), lng: loc.lng() };
        setCenter(at);
        await runSearch(at);
      } catch (e) {
        console.error(e);
        setMessage("検索中にエラーが発生しました。");
        setLoading(false);
      }
    },
    [center, runSearch]
  );

  // Try to locate on first load.
  useEffect(() => {
    handleLocate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReportSubmitted = useCallback(() => {
    setReportSpot(null);
    setMessage("投稿ありがとうございました！");
    if (center) runSearch(center);
  }, [center, runSearch]);

  return (
    <main className="mx-auto flex h-[100dvh] max-w-md flex-col bg-canvas">
      {/* Header */}
      <header className="z-20 bg-gradient-to-b from-brand-dark to-brand px-4 pb-4 pt-5 shadow-header">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-none">
              <h1 className="text-lg font-black tracking-tight text-white">
                Smo<span className="text-brand-light">Spot</span>
              </h1>
              <p className="mt-1 text-[11px] font-medium text-brand-pale/80">
                近くの喫煙所を、すぐに。
              </p>
            </div>
          </div>
          {spots.length > 0 && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {spots.length}件
            </span>
          )}
        </div>
        <SearchBar
          onLocate={handleLocate}
          onSearch={handleSearch}
          locating={locating}
        />
      </header>

      {/* Map (40vh) */}
      <div className="relative -mt-3 h-[40vh] w-full shrink-0 overflow-hidden rounded-t-3xl bg-slate-200 shadow-[0_-8px_24px_rgba(14,42,32,0.08)]">
        <MapView
          center={center}
          spots={spots}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      {/* List */}
      <section className="no-scrollbar flex-1 overflow-y-auto">
        {message && (
          <div className="px-4 pt-3">
            <p className="rounded-xl bg-brand-pale/60 px-3 py-2 text-center text-xs font-semibold text-brand-dark">
              {message}
            </p>
          </div>
        )}
        <Disclaimer />
        <SpotList
          spots={spots}
          loading={loading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onReport={setReportSpot}
        />
      </section>

      {reportSpot && (
        <ReportModal
          spot={reportSpot}
          onClose={() => setReportSpot(null)}
          onSubmitted={handleReportSubmitted}
        />
      )}
    </main>
  );
}

/** Minimal logo mark: rounded square with a smoke/location glyph. */
function Logo() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M12 2c0 3-3 3.5-3 6"
          stroke="#D8F3DC"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect x="4" y="13" width="13" height="4" rx="1.2" fill="#52B788" />
        <rect x="18.5" y="13" width="1.5" height="4" rx="0.6" fill="#D8F3DC" />
      </svg>
    </div>
  );
}
