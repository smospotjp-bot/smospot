"use client";

import { useState } from "react";

interface Props {
  onLocate: () => void;
  onSearch: (keyword: string) => void;
  locating: boolean;
}

export function SearchBar({ onLocate, onSearch, locating }: Props) {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onLocate}
        disabled={locating}
        aria-label="現在地を取得"
        className="group flex h-11 shrink-0 items-center gap-1.5 rounded-2xl bg-white/15 px-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-95 disabled:opacity-60"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${locating ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {locating ? (
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          ) : (
            <>
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17 17 20 13.5 20 10a8 8 0 1 0-16 0c0 3.5 3 7 8 11.7z" />
            </>
          )}
        </svg>
        現在地
      </button>

      <form
        className="flex h-11 flex-1 items-center rounded-2xl bg-white px-3.5 shadow-card focus-within:ring-2 focus-within:ring-brand-light/60"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(keyword.trim());
        }}
      >
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          inputMode="search"
          placeholder="エリア・キーワードで検索"
          className="h-full flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:font-normal placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="text-slate-400 transition hover:text-brand"
          aria-label="検索"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>
    </div>
  );
}
