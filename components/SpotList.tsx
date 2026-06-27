"use client";

import { Fragment } from "react";
import type { Spot } from "@/lib/types";
import { formatDistance } from "@/lib/distance";
import { StatusBadge, ClosedBadge } from "./StatusBadge";
import { AdSlot } from "./AdSlot";

interface Props {
  spots: Spot[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (placeId: string) => void;
  onReport: (spot: Spot) => void;
}

/** Insert an ad after every N spots. */
const AD_INTERVAL = 4;

export function SpotList({ spots, loading, selectedId, onSelect, onReport }: Props) {
  if (loading) {
    return (
      <ul className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="h-[88px] animate-pulse rounded-2xl bg-white/80" />
        ))}
      </ul>
    );
  }

  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center px-8 py-14 text-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-card">
          🚬
        </div>
        <p className="text-sm font-medium text-slate-500">
          近くの喫煙所が見つかりませんでした。
          <br />
          現在地を取得するか、別のエリアで検索してください。
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 p-4">
      {spots.map((spot, i) => (
        <Fragment key={spot.placeId}>
          <SpotCard
            spot={spot}
            index={i}
            selected={spot.placeId === selectedId}
            onSelect={() => onSelect(spot.placeId)}
            onReport={() => onReport(spot)}
          />
          {(i + 1) % AD_INTERVAL === 0 && i < spots.length - 1 && (
            <li>
              <AdSlot slotId={`list-${i}`} />
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );
}

function SpotCard({
  spot,
  index,
  selected,
  onSelect,
  onReport,
}: {
  spot: Spot;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onReport: () => void;
}) {
  return (
    <li
      onClick={onSelect}
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
      className={`group animate-fade-up cursor-pointer rounded-2xl bg-white p-3.5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${
        selected ? "ring-2 ring-brand" : "ring-1 ring-black/[0.03]"
      }`}
    >
      <div className="flex items-start gap-3">
        <DistanceChip meters={spot.distance} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-snug text-slate-800 transition group-hover:text-brand">
            {spot.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21c5-4.5 8-8 8-11a8 8 0 1 0-16 0c0 3 3 6.5 8 11z" />
            </svg>
            <span className="truncate">{spot.address || "住所情報なし"}</span>
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={spot.status} />
            {spot.isClosed && <ClosedBadge />}
            <span className="ml-0.5 text-[11px] font-medium text-slate-400">
              {formatLastConfirmed(spot.lastConfirmedAt)}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onReport();
          }}
          aria-label="情報を投稿"
          className="shrink-0 self-center rounded-xl bg-brand-pale px-3 py-2 text-xs font-bold text-brand-dark transition hover:bg-brand-light hover:text-white active:scale-95"
        >
          投稿
        </button>
      </div>
    </li>
  );
}

/** Stylish distance pill: big number + unit, brand-tinted. */
function DistanceChip({ meters }: { meters: number }) {
  const km = meters >= 1000;
  const value = km ? (meters / 1000).toFixed(1) : Math.round(meters).toString();
  const unit = km ? "km" : "m";
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-mid text-white shadow-sm">
      <span className="text-base font-black leading-none tracking-tight">
        {value}
      </span>
      <span className="mt-0.5 text-[10px] font-bold uppercase opacity-80">
        {unit}
      </span>
    </div>
  );
}

function formatLastConfirmed(iso: string | null): string {
  if (!iso) return "未確認";
  const then = new Date(iso).getTime();
  const diffMin = Math.floor((Date.now() - then) / 60000);
  let rel: string;
  if (diffMin < 1) rel = "たった今";
  else if (diffMin < 60) rel = `${diffMin}分前`;
  else if (diffMin < 1440) rel = `${Math.floor(diffMin / 60)}時間前`;
  else if (diffMin < 43200) rel = `${Math.floor(diffMin / 1440)}日前`;
  else rel = new Date(iso).toLocaleDateString("ja-JP");
  return `最終確認 ${rel}`;
}
