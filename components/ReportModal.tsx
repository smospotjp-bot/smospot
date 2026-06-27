"use client";

import { useState } from "react";
import type { Spot } from "@/lib/types";

interface Props {
  spot: Spot;
  onClose: () => void;
  onSubmitted: () => void;
}

type Choice = "allowed" | "not_allowed" | "smoking_area" | "closed";

const OPTIONS: { value: Choice; icon: string; label: string }[] = [
  { value: "allowed", icon: "🚬", label: "喫煙できた" },
  { value: "smoking_area", icon: "📍", label: "喫煙スペースあり" },
  { value: "not_allowed", icon: "✖️", label: "禁煙だった" },
  { value: "closed", icon: "🚧", label: "閉鎖・なくなった" },
];

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-dark/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-sheet-up rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />

        <div className="mb-1 flex items-start justify-between gap-2">
          <h2 className="text-base font-black text-brand-dark">情報を投稿</h2>
          <button
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-full p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
            aria-label="閉じる"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <p className="mb-4 truncate text-sm font-medium text-slate-400">
          {spot.name}
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setChoice(opt.value)}
              className={`flex flex-col items-start gap-1 rounded-2xl border px-3.5 py-3 text-left text-sm font-bold transition ${
                choice === opt.value
                  ? "border-brand bg-brand-pale/60 text-brand-dark ring-2 ring-brand/15"
                  : "border-slate-200 text-slate-600 hover:border-brand-light hover:bg-slate-50"
              }`}
            >
              <span className="text-lg leading-none">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        {choice === "smoking_area" && (
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="場所の補足（例：2階奥 / 店外）"
            className="mt-3 w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-light/40"
          />
        )}

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={!choice || submitting}
          className="mt-4 w-full rounded-2xl bg-brand py-3.5 text-sm font-bold text-white shadow-card transition hover:bg-brand-mid active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "送信中…" : "この内容で投稿する"}
        </button>
      </div>
    </div>
  );
}
