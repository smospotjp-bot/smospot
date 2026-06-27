"use client";

import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "@/lib/maps";
import type { LatLng, Spot } from "@/lib/types";

interface Props {
  center: LatLng | null;
  spots: Spot[];
  selectedId: string | null;
  onSelect: (placeId: string) => void;
}

export function MapView({ center, spots, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Initialise the map once.
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then((google) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      mapRef.current = new google.maps.Map(containerRef.current, {
        center: center ?? { lat: 35.681236, lng: 139.767125 }, // Tokyo Station fallback
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-center + draw the user location marker.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center) return;
    map.panTo(center);

    loadGoogleMaps().then((google) => {
      if (!userMarkerRef.current) {
        userMarkerRef.current = new google.maps.Marker({
          map,
          position: center,
          title: "現在地",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#1B4332",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          zIndex: 999,
        });
      } else {
        userMarkerRef.current.setPosition(center);
      }
    });
  }, [center]);

  // Sync spot markers with the current spot list.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    loadGoogleMaps().then((google) => {
      const seen = new Set(spots.map((s) => s.placeId));

      // Remove stale markers.
      for (const [id, marker] of markersRef.current) {
        if (!seen.has(id)) {
          marker.setMap(null);
          markersRef.current.delete(id);
        }
      }

      // Add / update markers.
      for (const spot of spots) {
        const existing = markersRef.current.get(spot.placeId);
        const color = spot.isClosed
          ? "#9CA3AF"
          : spot.isSmokingArea
          ? "#2D6A4F"
          : "#52B788";
        if (existing) {
          existing.setPosition({ lat: spot.lat, lng: spot.lng });
          continue;
        }
        const marker = new google.maps.Marker({
          map,
          position: { lat: spot.lat, lng: spot.lng },
          title: spot.name,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 1.5,
          },
        });
        marker.addListener("click", () => onSelectRef.current(spot.placeId));
        markersRef.current.set(spot.placeId, marker);
      }
    });
  }, [spots]);

  // Pan to a selected spot.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const spot = spots.find((s) => s.placeId === selectedId);
    if (spot) {
      map.panTo({ lat: spot.lat, lng: spot.lng });
      map.setZoom(17);
    }
  }, [selectedId, spots]);

  return <div ref={containerRef} className="h-full w-full" />;
}
