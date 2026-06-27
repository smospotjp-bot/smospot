/**
 * Placeholder ad container. Drop your AdSense <ins> markup + push script here
 * (or set NEXT_PUBLIC_ADSENSE_CLIENT and render <ins className="adsbygoogle">).
 * Rendered between list items so it blends into the scroll flow.
 */
export function AdSlot({ slotId }: { slotId: string }) {
  return (
    <div
      data-ad-slot={slotId}
      className="my-2 flex h-20 items-center justify-center rounded-xl border border-dashed border-brand/30 bg-white/60 text-xs text-gray-400"
    >
      広告スペース
    </div>
  );
}
