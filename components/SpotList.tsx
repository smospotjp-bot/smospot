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
      <ul className="space-y-2 p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="h-20 animate-pulse rounded-xl bg-white/70" />
        ))}
      </ul>
    );
  }

  if (spots.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        <p className="mb-1 text-2xl">🚬</p>
        近くの喫煙所が見つかりませんでした。
        <br />
        現在地を取得するか、別のエリアで検索してください。
      </div>
    );
  }

  return (
    <ul className="space-y-2 p-3">
      {spots.map((spot, i) => (
        <Fragment key={spot.placeId}>
          <SpotCard
            spot={spot}
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
  selected,
  onSelect,
  onReport,
}: {
  spot: Spot;
  selected: boolean;
  onSelect: () => void;
  onReport: () => void;
}) {
  return (
    <li
      onClick={onSelect}
      className={`cursor-pointer rounded-xl bg-white p-3 shadow-sm transition ${
        selected ? "ring-2 ring-brand" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">{spot.name}</p>
          <p className="truncate text-xs text-gray-500">{spot.address}</p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-brand">
          {formatDistance(spot.distance)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={spot.status} />
        {spot.isClosed && <ClosedBadge />}
        <span className="text-[11px] text-gray-400">
          最終確認: {formatLastConfirmed(spot.lastConfirmedAt)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReport();
          }}
          className="ml-auto rounded-full bg-brand-pale px-3 py-1 text-xs font-semibold text-brand-dark transition active:scale-95"
        >
          投稿
        </button>
      </div>
    </li>
  );
}

function formatLastConfirmed(iso: string | null): string {
  if (!iso) return "未確認";
  const then = new Date(iso).getTime();
  const diffMin = Math.floor((Date.now() - then) / 60000);
  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}時間前`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}日前`;
  return new Date(iso).toLocaleDateString("ja-JP");
}
