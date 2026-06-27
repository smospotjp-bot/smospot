"use client";

import { useState } from "react";
import type { Spot } from "@/lib/types";

interface Props {
  spot: Spot;
  onClose: () => void;
  onSubmitted: () => void;
}

type Choice = "allowed" | "not_allowed" | "smoking_area" | "closed";

export function ReportModal({ spot, onClose, onSubmitted }: Props) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [area, setArea] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!choice) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      place_id: spot.placeId,
      smoking_allowed:
        choice === "allowed" ? true : choice === "not_allowed" ? false : null,
      smoking_area:
        choice === "smoking_area" ? area.trim() || "喫煙スペースあり" : null,
      is_closed: choice === "closed",
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "送信に失敗しました");
      }
      onSubmitted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  const options: { value: Choice; label: string }[] = [
    { value: "allowed", label: "🚬 喫煙できた" },
    { value: "smoking_area", label: "📍 喫煙スペースあり" },
    { value: "not_allowed", label: "🚭 禁煙だった" },
    { value: "closed", label: "❌ 閉鎖・なくなった" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-2">
          <h2 className="text-base font-bold text-brand-dark">情報を投稿</h2>
          <button onClick={onClose} className="text-gray-400" aria-label="閉じる">
            ✕
          </button>
        </div>
        <p className="mb-4 truncate text-sm text-gray-500">{spot.name}</p>

        <div className="grid grid-cols-2 gap-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setChoice(opt.value)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                choice === opt.value
                  ? "border-brand bg-brand-pale text-brand-dark"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {choice === "smoking_area" && (
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="場所の補足（例：2階奥 / 店外）"
            className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={submit}
          disabled={!choice || submitting}
          className="mt-4 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? "送信中…" : "この内容で投稿"}
        </button>
      </div>
    </div>
  );
}
