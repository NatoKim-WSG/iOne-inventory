import type { KitInfo } from "@/types/inventory";

function emptyLabel(value: string) {
  return value ? value : "-";
}

export function StatusBadge({ status }: { status: KitInfo["status"] }) {
  const deployed = status === "Deployed";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        deployed
          ? "bg-emerald-100 text-emerald-700"
          : "bg-sky-100 text-sky-700"
      }`}
    >
      {emptyLabel(status)}
    </span>
  );
}

export function ConditionBadge({
  condition,
}: {
  condition: KitInfo["condition"];
}) {
  if (!condition) {
    return <span className="text-[var(--muted)]">-</span>;
  }

  const isNew = condition.toLowerCase() === "brand new";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        isNew
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {condition}
    </span>
  );
}