"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
    <article className="panel-card flex items-center gap-2 px-3 py-2">
      <span className={`h-2 w-2 shrink-0 rounded-full ${toneClass[tone]}`} />
      <div>
        <p className="text-[9px] uppercase tracking-[0.08em] text-[var(--muted)]">{label}</p>
        <p className="text-lg font-semibold leading-tight text-[var(--ink)]">{value.toLocaleString()}</p>
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
    <section className="panel-card flex flex-[2] flex-col p-3">
      <header className="mb-1 flex items-start justify-between gap-2">
        <div>
          <p className="section-kicker">Core Snapshot</p>
          <h3 className="text-sm font-semibold text-[var(--ink)]">Inventory Overview</h3>
        </div>
      </header>

      <div className="mb-1 flex flex-wrap gap-x-3 gap-y-0.5">
        {data.map((segment) => (
          <p key={segment.name} className="inline-flex items-center gap-1.5 text-[11px] text-[var(--soft)]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
            {segment.name}
            <strong className="ml-0.5 text-[var(--ink)]">{segment.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>

      <div className="min-h-0 flex-1" style={{ minHeight: 130 }}>
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

      <footer className="mt-2 grid grid-cols-2 gap-2">
        <button className="action-chip action-chip-success text-[11px]" onClick={onShowDeployed}>
          View Deployed
        </button>
        <button className="action-chip action-chip-info text-[11px]" onClick={onShowStorage}>
          View In-Storage
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
    <section className="panel-card flex flex-1 flex-col p-3">
      <header className="mb-1">
        <h3 className="text-sm font-semibold text-[var(--ink)]">{title}</h3>
      </header>

      <div className="mb-1 flex flex-wrap gap-x-3 gap-y-0.5">
        {items.map((item) => {
          const percent = total ? ((item.count / total) * 100).toFixed(1) : "0.0";
          return (
            <p key={item.label} className="inline-flex items-center gap-1 text-[10px] text-[var(--soft)]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colorMap[item.label] || "#94a3b8" }}
              />
              {item.label}
              <strong className="text-[var(--ink)]">{item.count.toLocaleString()}</strong>
              <span className="text-[var(--muted)]">({percent}%)</span>
            </p>
          );
        })}
      </div>

      <div className="min-h-0 flex-1" style={{ minHeight: 100 }}>
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

export function BarBreakdownCard({
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
    <section className="panel-card flex flex-1 flex-col p-3">
      <header className="mb-1">
        <h3 className="text-sm font-semibold text-[var(--ink)]">{title}</h3>
      </header>

      <div className="min-h-0 flex-1" style={{ minHeight: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={items} layout="vertical" margin={{ top: 4, right: 8, bottom: 4, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              width={75}
              tick={{ fontSize: 10, fill: "var(--soft)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number | undefined) => {
                const v = value ?? 0;
                const pct = total ? ((v / total) * 100).toFixed(1) : "0";
                return [`${v.toLocaleString()} (${pct}%)`, "Count"];
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
              {items.map((item) => (
                <Cell
                  key={item.label}
                  fill={colorMap[item.label] || "#94a3b8"}
                  fillOpacity={0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function HubSummaryCard({ hubSummaries }: { hubSummaries: HubSummary[] }) {
  return (
    <section className="panel-card flex h-full flex-col p-3">
      <header className="mb-2 shrink-0">
        <p className="section-kicker">Distribution</p>
        <h3 className="text-sm font-semibold text-[var(--ink)]">Stock by Storage Hub</h3>
      </header>

      <div className="scroll-soft min-h-0 flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead className="sticky top-0 z-10 bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur">
            <tr className="border-b border-[var(--line)] text-[9px] uppercase tracking-wide text-[var(--muted)]">
              <th className="px-2 py-1.5 text-left">Hub</th>
              <th className="px-2 py-1.5 text-center">Total</th>
              <th className="px-2 py-1.5 text-center text-emerald-600">New</th>
              <th className="px-2 py-1.5 text-center text-amber-600">Used</th>
              <th className="px-2 py-1.5 text-center text-slate-500">N/A</th>
            </tr>
          </thead>
          <tbody>
            {hubSummaries.map((hub) => (
              <tr key={hub.hub} className="border-b border-[var(--line)]/60 transition-colors hover:bg-[var(--surface-2)]">
                <td className="max-w-[200px] truncate px-2 py-1.5 font-medium text-[var(--ink)]" title={hub.hub}>
                  {hub.hub}
                </td>
                <td className="px-2 py-1.5 text-center font-semibold text-[var(--ink)]">{hub.total}</td>
                <td className="px-2 py-1.5 text-center font-semibold text-emerald-600">{hub.brandNew || <span className="text-[var(--muted)]">-</span>}</td>
                <td className="px-2 py-1.5 text-center font-semibold text-amber-600">{hub.used || <span className="text-[var(--muted)]">-</span>}</td>
                <td className="px-2 py-1.5 text-center font-semibold text-slate-500">{hub.unspecified || <span className="text-[var(--muted)]">-</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}