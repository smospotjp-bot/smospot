import type { SmokingStatus } from "@/lib/types";

const CONFIG: Record<SmokingStatus, { label: string; className: string }> = {
  allowed: { label: "喫煙可", className: "bg-brand text-white" },
  smoking_area: { label: "喫煙所", className: "bg-brand-light text-brand-dark" },
  not_allowed: { label: "禁煙", className: "bg-gray-200 text-gray-600" },
  unknown: { label: "情報なし", className: "bg-amber-100 text-amber-700" },
};

export function StatusBadge({ status }: { status: SmokingStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

export function ClosedBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
      閉鎖報告あり
    </span>
  );
}
