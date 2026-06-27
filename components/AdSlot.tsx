/**
 * Placeholder ad container styled to blend with the spot cards. Drop your
 * AdSense <ins className="adsbygoogle"> markup + push script inside the inner
 * div (or wire NEXT_PUBLIC_ADSENSE_CLIENT). The "PR" chip keeps it honest while
 * the card styling keeps it native to the scroll flow.
 */
export function AdSlot({ slotId }: { slotId: string }) {
  return (
    <div
      data-ad-slot={slotId}
      className="relative overflow-hidden rounded-2xl bg-white/70 p-4 shadow-card ring-1 ring-black/[0.03] backdrop-blur-sm"
    >
      <span className="absolute right-3 top-3 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-slate-400">
        PR
      </span>
      <div className="flex h-14 items-center justify-center rounded-xl border border-dashed border-brand/15 bg-brand-pale/30 text-xs font-medium text-slate-400">
        スポンサー広告スペース
      </div>
    </div>
  );
}
