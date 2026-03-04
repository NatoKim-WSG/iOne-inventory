"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { KitInfo } from "@/types/inventory";
import { ConditionBadge, StatusBadge } from "@/components/dashboard/Badges";

const ROW_HEIGHT = 32;
const OVERSCAN = 10;

export function KitsTable({
  title,
  subtitle,
  kits,
}: {
  title: string;
  subtitle?: string;
  kits: KitInfo[];
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (el) setContainerHeight(el.clientHeight);
  }, [kits]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + OVERSCAN * 2;
  const endIdx = Math.min(kits.length, startIdx + visibleCount);
  const visibleItems = kits.slice(startIdx, endIdx);

  return (
    <section className="panel-card flex h-full min-h-[420px] flex-col p-4">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="section-title">{title}</h3>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>
        <p className="text-xs text-[var(--muted)]">{kits.length.toLocaleString()} kits</p>
      </header>

      <div className="scroll-soft flex-1 overflow-auto" ref={containerRef} onScroll={handleScroll}>
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-[color:color-mix(in_srgb,var(--surface)_93%,transparent)] backdrop-blur">
            <tr className="border-b border-[var(--line)] text-[10px] uppercase tracking-wide text-[var(--muted)]">
              <th className="px-2 py-2 text-left w-10">#</th>
              <th className="px-2 py-2 text-left">Kit No</th>
              <th className="px-2 py-2 text-left">Model</th>
              <th className="px-2 py-2 text-left">Condition</th>
              <th className="px-2 py-2 text-left">Status</th>
              <th className="px-2 py-2 text-left">Project</th>
              <th className="px-2 py-2 text-left">Province</th>
              <th className="px-2 py-2 text-left">Municipality</th>
              <th className="px-2 py-2 text-left">Storage Hub</th>
            </tr>
          </thead>
          <tbody>
            {kits.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-sm text-[var(--soft)]">
                  No kits match the current filter.
                </td>
              </tr>
            ) : (
              <>
                {startIdx > 0 && (
                  <tr style={{ height: startIdx * ROW_HEIGHT }}><td colSpan={9} /></tr>
                )}
                {visibleItems.map((kit, i) => {
                  const idx = startIdx + i;
                  return (
                    <tr key={`${kit.kitNo}-${idx}`} className="border-b border-[var(--line)]/60 transition-colors hover:bg-[var(--surface-2)]" style={{ height: ROW_HEIGHT }}>
                      <td className="px-2 py-1 text-[var(--muted)]">{idx + 1}</td>
                      <td className="px-2 py-1 font-mono font-semibold text-[var(--ink)]">{kit.kitNo || "-"}</td>
                      <td className="px-2 py-1 text-[var(--soft)]">{kit.model || "-"}</td>
                      <td className="px-2 py-1"><ConditionBadge condition={kit.condition} /></td>
                      <td className="px-2 py-1"><StatusBadge status={kit.status} /></td>
                      <td className="px-2 py-1 text-[var(--soft)]">{kit.project || "-"}</td>
                      <td className="px-2 py-1 text-[var(--soft)]">{kit.province || "-"}</td>
                      <td className="px-2 py-1 text-[var(--soft)]">{kit.municipality || "-"}</td>
                      <td className="px-2 py-1 text-[var(--soft)]">{kit.storageHub || "-"}</td>
                    </tr>
                  );
                })}
                {endIdx < kits.length && (
                  <tr style={{ height: (kits.length - endIdx) * ROW_HEIGHT }}><td colSpan={9} /></tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
