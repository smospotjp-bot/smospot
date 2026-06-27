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
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-brand shadow-sm transition active:scale-95 disabled:opacity-60"
        aria-label="現在地を取得"
      >
        <span className={locating ? "animate-spin" : ""}>📍</span>
        現在地
      </button>

      <form
        className="flex flex-1 items-center rounded-full bg-white px-3 shadow-sm"
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
          className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        <button type="submit" className="text-brand" aria-label="検索">
          🔍
        </button>
      </form>
    </div>
  );
}
