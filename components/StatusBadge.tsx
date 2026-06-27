import type { SmokingStatus } from "@/lib/types";

const CONFIG: Record<
  SmokingStatus,
  { icon: string; label: string; className: string }
> = {
  allowed: {
    icon: "🚬",
    label: "喫煙可",
    className: "bg-brand text-white ring-brand/20",
  },
  smoking_area: {
    icon: "📍",
    label: "喫煙所",
    className: "bg-brand-pale text-brand-dark ring-brand-light/40",
  },
  not_allowed: {
    icon: "✖️",
    label: "禁煙",
    className: "bg-slate-100 text-slate-500 ring-slate-200",
  },
  unknown: {
    icon: "❓",
    label: "情報なし",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
};

export function StatusBadge({ status }: { status: SmokingStatus }) {
  const { icon, label, className } = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${className}`}
    >
      <span className="text-[0.85em] leading-none">{icon}</span>
      {label}
    </span>
  );
}

export function ClosedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 ring-1 ring-inset ring-red-200">
      <span className="text-[0.85em] leading-none">🚧</span>
      閉鎖報告
    </span>
  );
}
