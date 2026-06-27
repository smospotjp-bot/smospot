"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { MapView } from "@/components/MapView";
import { SpotList } from "@/components/SpotList";
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
    <main className="mx-auto flex h-[100dvh] max-w-md flex-col bg-brand-pale">
      {/* Header */}
      <header className="z-10 bg-brand px-3 pb-3 pt-4 shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">
            Smo<span className="text-brand-light">Spot</span>
          </h1>
          <span className="text-xs text-brand-pale">近くの喫煙所を探す</span>
        </div>
        <SearchBar
          onLocate={handleLocate}
          onSearch={handleSearch}
          locating={locating}
        />
      </header>

      {/* Map (40vh) */}
      <div className="h-[40vh] w-full shrink-0 bg-gray-200">
        <MapView
          center={center}
          spots={spots}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* List */}
      <section className="no-scrollbar flex-1 overflow-y-auto">
        {message && (
          <p className="px-4 pt-3 text-center text-xs text-brand-dark">{message}</p>
        )}
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
