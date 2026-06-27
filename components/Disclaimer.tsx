/**
 * Legal/usage disclaimer shown at the very bottom of the spot list.
 * Styled in the same card tone as the list items, in small muted text.
 */
export function Disclaimer() {
  return (
    <footer className="sticky top-0 z-10 bg-canvas px-4 pb-2 pt-3">
      <div className="rounded-2xl bg-white/70 p-3.5 text-[11px] leading-relaxed text-slate-400 shadow-card ring-1 ring-black/[0.03]">
        <p className="mb-1 flex items-center gap-1 font-bold text-slate-500">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          ご利用にあたって
        </p>
        本サービスの店舗情報はGoogle
        マップを元に取得しています。喫煙可否情報はユーザー投稿によるものであり、実際の状況を保証するものではありません。最新情報は各店舗へお問い合わせください。
      </div>
    </footer>
  );
}
