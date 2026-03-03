"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { BreakdownItem, HubSummary } from "@/types/inventory";

interface PieSegment {
  name: string;
  value: number;
  color: string;
}

const tooltipStyle = {
  borderRadius: "10px",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  backgroundColor: "rgba(15, 23, 42, 0.96)",
  color: "#f8fafc",
  fontSize: "12px",
};

export function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "success" | "info" | "warning";
}) {
  const toneClass: Record<typeof tone, string> = {
    neutral: "bg-slate-500",
    success: "bg-emerald-500",
    info: "bg-sky-500",
    warning: "bg-amber-500",
  };

  return (
    <article className="panel-card flex items-center gap-3 px-4 py-3">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneClass[tone]}`} />
      <div>
        <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--muted)]">{label}</p>
        <p className="text-2xl font-semibold leading-tight text-[var(--ink)]">{value.toLocaleString()}</p>
      </div>
    </article>
  );
}

export function InventoryOverviewCard({
  data,
  onShowDeployed,
  onShowStorage,
}: {
  data: PieSegment[];
  onShowDeployed: () => void;
  onShowStorage: () => void;
}) {
  return (
    <section className="panel-card flex min-h-[340px] flex-col p-4">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="section-kicker">Core Snapshot</p>
          <h3 className="section-title">Inventory Overview</h3>
        </div>
      </header>

      <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
        {data.map((segment) => (
          <p key={segment.name} className="inline-flex items-center gap-2 text-xs text-[var(--soft)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
            {segment.name}
            <strong className="ml-1 text-[var(--ink)]">{segment.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>

      <div className="h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="82%"
              strokeWidth={2.5}
            >
              {data.map((segment) => (
                <Cell
                  key={segment.name}
                  fill={segment.color}
                  fillOpacity={0.3}
                  stroke={segment.color}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <footer className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button className="action-chip action-chip-success" onClick={onShowDeployed}>
          View Deployed Kits
        </button>
        <button className="action-chip action-chip-info" onClick={onShowStorage}>
          View In-Storage Kits
        </button>
      </footer>
    </section>
  );
}

export function BreakdownCard({
  title,
  items,
  colorMap,
}: {
  title: string;
  items: BreakdownItem[];
  colorMap: Record<string, string>;
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="panel-card flex min-h-[255px] flex-col p-4">
      <header className="mb-3">
        <h3 className="section-title">{title}</h3>
      </header>

      <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
        {items.map((item) => {
          const percent = total ? ((item.count / total) * 100).toFixed(1) : "0.0";
          return (
            <p key={item.label} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--soft)]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colorMap[item.label] || "#94a3b8" }}
              />
              {item.label}
              <strong className="text-[var(--ink)]">{item.count.toLocaleString()}</strong>
              <span className="text-[var(--muted)]">({percent}%)</span>
            </p>
          );
        })}
      </div>

      <div className="h-[165px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              strokeWidth={2.5}
            >
              {items.map((item) => (
                <Cell
                  key={item.label}
                  fill={colorMap[item.label] || "#94a3b8"}
                  fillOpacity={0.3}
                  stroke={colorMap[item.label] || "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function HubSummaryCard({ hubSummaries }: { hubSummaries: HubSummary[] }) {
  return (
    <section className="panel-card flex min-h-[340px] flex-col p-4">
      <header className="mb-3">
        <p className="section-kicker">Distribution</p>
        <h3 className="section-title">Stock by Storage Hub</h3>
      </header>

      <div className="scroll-soft flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur">
            <tr className="border-b border-[var(--line)] text-[10px] uppercase tracking-wide text-[var(--muted)]">
              <th className="px-2 py-2 text-left">Hub</th>
              <th className="px-2 py-2 text-center">Total</th>
              <th className="px-2 py-2 text-center text-emerald-600">Out</th>
              <th className="px-2 py-2 text-center text-sky-600">In</th>
            </tr>
          </thead>
          <tbody>
            {hubSummaries.map((hub) => (
              <tr key={hub.hub} className="border-b border-[var(--line)]/60 transition-colors hover:bg-[var(--surface-2)]">
                <td className="max-w-[220px] truncate px-2 py-2 font-medium text-[var(--ink)]" title={hub.hub}>
                  {hub.hub}
                </td>
                <td className="px-2 py-2 text-center font-semibold text-[var(--ink)]">{hub.total}</td>
                <td className="px-2 py-2 text-center font-semibold text-emerald-600">{hub.deployed}</td>
                <td className="px-2 py-2 text-center font-semibold text-sky-600">{hub.undeployed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}