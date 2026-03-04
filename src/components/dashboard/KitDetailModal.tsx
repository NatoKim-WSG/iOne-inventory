"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import type { KitInfo } from "@/types/inventory";
import { ConditionBadge } from "@/components/dashboard/Badges";

const ROW_HEIGHT = 32;
const OVERSCAN = 10;

export function KitDetailModal({
  filter,
  kits,
  onClose,
}: {
  filter: "deployed" | "storage";
  kits: KitInfo[];
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  const filtered = useMemo(() => {
    if (!search.trim()) return kits;
    const q = search.toLowerCase().trim();
    return kits.filter((k) =>
      [k.kitNo, k.model, k.condition, k.version, k.project, k.province, k.municipality, k.address, k.storageHub]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [kits, search]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) setContainerHeight(el.clientHeight);
  }, [filtered]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + OVERSCAN * 2;
  const endIdx = Math.min(filtered.length, startIdx + visibleCount);
  const visibleItems = filtered.slice(startIdx, endIdx);
  const totalHeight = filtered.length * ROW_HEIGHT;

  const isDeployed = filter === "deployed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-3 py-4" onClick={onClose}>
      <div className="panel-card flex h-[88vh] w-full max-w-7xl flex-col p-0" onClick={(e) => e.stopPropagation()}>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
          <div>
            <p className="section-kicker">Kit Details</p>
            <h2 className="text-xl font-semibold text-[var(--ink)]">
              {isDeployed ? "Deployed Kits" : "Kits In Storage"}
            </h2>
            <p className="section-subtitle">
              {filtered.length.toLocaleString()} matching of {kits.length.toLocaleString()} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="input-shell w-[280px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                placeholder="Search in this list..."
                className="w-full bg-transparent px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              />
            </div>
            <button className="chip-btn" onClick={onClose}>Close</button>
          </div>
        </header>

        <div className="scroll-soft min-h-0 flex-1 overflow-auto p-4" ref={containerRef} onScroll={handleScroll}>
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-[color:color-mix(in_srgb,var(--surface)_94%,transparent)] backdrop-blur">
              <tr className="border-b border-[var(--line)] text-[10px] uppercase tracking-wide text-[var(--muted)]">
                <th className="px-2 py-2 text-left w-10">#</th>
                <th className="px-2 py-2 text-left">Kit No</th>
                <th className="px-2 py-2 text-left">Model</th>
                <th className="px-2 py-2 text-left">Condition</th>
                <th className="px-2 py-2 text-left">Version</th>
                <th className="px-2 py-2 text-left">Project</th>
                {isDeployed ? (
                  <>
                    <th className="px-2 py-2 text-left">Province</th>
                    <th className="px-2 py-2 text-left">Municipality</th>
                    <th className="px-2 py-2 text-left">Address</th>
                    <th className="px-2 py-2 text-left">Deploy Date</th>
                  </>
                ) : (
                  <>
                    <th className="px-2 py-2 text-left">Storage Hub</th>
                    <th className="px-2 py-2 text-left">Province</th>
                    <th className="px-2 py-2 text-left">Municipality</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isDeployed ? 10 : 9} className="px-3 py-8 text-center text-sm text-[var(--soft)]">
                    No kits match this search.
                  </td>
                </tr>
              ) : (
                <>
                  {startIdx > 0 && (
                    <tr style={{ height: startIdx * ROW_HEIGHT }}><td colSpan={isDeployed ? 10 : 9} /></tr>
                  )}
                  {visibleItems.map((kit, i) => {
                    const idx = startIdx + i;
                    return (
                      <tr key={`${kit.kitNo}-${idx}`} className="border-b border-[var(--line)]/60 transition-colors hover:bg-[var(--surface-2)]" style={{ height: ROW_HEIGHT }}>
                        <td className="px-2 py-1 text-[var(--muted)]">{idx + 1}</td>
                        <td className="px-2 py-1 font-mono font-semibold text-[var(--ink)]">{kit.kitNo || "-"}</td>
                        <td className="px-2 py-1 text-[var(--soft)]">{kit.model || "-"}</td>
                        <td className="px-2 py-1"><ConditionBadge condition={kit.condition} /></td>
                        <td className="px-2 py-1 text-[var(--soft)]">{kit.version || "-"}</td>
                        <td className="px-2 py-1 text-[var(--soft)]">{kit.project || "-"}</td>
                        {isDeployed ? (
                          <>
                            <td className="px-2 py-1 text-[var(--soft)]">{kit.province || "-"}</td>
                            <td className="px-2 py-1 text-[var(--soft)]">{kit.municipality || "-"}</td>
                            <td className="max-w-[220px] truncate px-2 py-1 text-[var(--soft)]" title={kit.address || "-"}>{kit.address || "-"}</td>
                            <td className="px-2 py-1 text-[var(--soft)]">{kit.deploymentDate || "-"}</td>
                          </>
                        ) : (
                          <>
                            <td className="px-2 py-1 text-[var(--soft)]">{kit.storageHub || "-"}</td>
                            <td className="px-2 py-1 text-[var(--soft)]">{kit.province || "-"}</td>
                            <td className="px-2 py-1 text-[var(--soft)]">{kit.municipality || "-"}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                  {endIdx < filtered.length && (
                    <tr style={{ height: (filtered.length - endIdx) * ROW_HEIGHT }}><td colSpan={isDeployed ? 10 : 9} /></tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
