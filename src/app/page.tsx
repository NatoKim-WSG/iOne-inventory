"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import MapViewDynamic from "@/components/MapViewDynamic";
import {
  BarBreakdownCard,
  BreakdownCard,
  HubSummaryCard,
  InventoryOverviewCard,
  MetricCard,
} from "@/components/dashboard/DashboardCards";
import { KitsTable } from "@/components/dashboard/KitsTable";
import { KitDetailModal } from "@/components/dashboard/KitDetailModal";
import type { DashboardData, KitInfo } from "@/types/inventory";

const PIE_COLORS = ["#16a34a", "#0284c7"];

const SERVICE_CAT_COLORS: Record<string, string> = {
  "Manage Service": "#0ea5e9",
  Sold: "#ef4444",
  "Demo/POC": "#f59e0b",
  Unspecified: "#64748b",
};

const CONDITION_COLORS: Record<string, string> = {
  "Brand New": "#10b981",
  Used: "#f59e0b",
  Unspecified: "#64748b",
};

const MODEL_COLORS: Record<string, string> = {
  "Standard Kit": "#0ea5e9",
  "Flat High Performance": "#f97316",
  Unspecified: "#64748b",
};

function matchesSearch(kit: KitInfo, search: string) {
  const q = search.toLowerCase().trim();
  return [
    kit.kitNo,
    kit.version,
    kit.model,
    kit.condition,
    kit.serviceCategory,
    kit.project,
    kit.province,
    kit.municipality,
    kit.address,
    kit.deploymentDate,
    kit.storageHub,
    kit.status,
    kit.remarks,
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dark, setDark] = useState(false);
  const [viewMode, setViewMode] = useState<"dashboard" | "map">("dashboard");
  const [modalFilter, setModalFilter] = useState<"deployed" | "storage" | null>(null);
  const [search, setSearch] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterProject, setFilterProject] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/inventory", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      const json = (await res.json()) as DashboardData;
      setData(json);
      setError(null);
    } catch {
      setError("Failed to load data from Google Sheet");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Debounce search for performance
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const searchTerm = debouncedSearch;

  const globalSearchResults = useMemo(() => {
    if (!data || !searchTerm) {
      return [];
    }
    return data.kits.filter((kit) => matchesSearch(kit, searchTerm));
  }, [data, searchTerm]);

  const applyKitFilters = useCallback((kits: KitInfo[]) => {
    return kits.filter((kit) => {
      if (filterModel && kit.model !== filterModel) return false;
      if (filterCategory && kit.serviceCategory !== filterCategory) return false;
      if (filterProject && kit.project !== filterProject) return false;
      return true;
    });
  }, [filterModel, filterCategory, filterProject]);

  const filterOptions = useMemo(() => {
    if (!data) return { models: [] as string[], categories: [] as string[], projects: [] as string[] };
    const models = [...new Set(data.kits.map((k) => k.model).filter(Boolean))].sort();
    const categories = [...new Set(data.kits.map((k) => k.serviceCategory).filter(Boolean))].sort();
    const projects = [...new Set(data.kits.map((k) => k.project).filter(Boolean))].sort();
    return { models, categories, projects };
  }, [data]);

  const filteredKits = useMemo(() => {
    if (!data || !modalFilter) {
      return [];
    }
    const status = modalFilter === "deployed" ? "Deployed" : "In Storage";
    return applyKitFilters(data.kits.filter((kit) => kit.status === status));
  }, [data, modalFilter, applyKitFilters]);

  const hasActiveFilters = !!(filterModel || filterCategory || filterProject);
  const pieData = useMemo(() => {
    if (!data) return [];
    if (!hasActiveFilters) {
      return [
        { name: "Deployed", value: data.totalDeployed, color: PIE_COLORS[0] },
        { name: "In Storage", value: data.totalUndeployed, color: PIE_COLORS[1] },
      ].filter((s) => s.value > 0);
    }
    const all = applyKitFilters(data.kits);
    const deployed = all.filter((k) => k.status === "Deployed").length;
    const storage = all.filter((k) => k.status === "In Storage").length;
    return [
      { name: "Deployed", value: deployed, color: PIE_COLORS[0] },
      { name: "In Storage", value: storage, color: PIE_COLORS[1] },
    ].filter((s) => s.value > 0);
  }, [data, hasActiveFilters, applyKitFilters]);

  const shownKits = searchTerm ? globalSearchResults : (data?.kits ?? []);

  if (loading) {
    return (
      <div className="monitor-root" data-theme={dark ? "dark" : "light"}>
        <div className="monitor-backdrop" />
        <div className="relative z-10 flex h-screen items-center justify-center p-4">
          <div className="panel-card w-full max-w-md p-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
            <p className="mt-4 text-sm text-[var(--soft)]">Loading inventory monitor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="monitor-root" data-theme={dark ? "dark" : "light"}>
        <div className="monitor-backdrop" />
        <div className="relative z-10 flex h-screen items-center justify-center p-4">
          <div className="panel-card w-full max-w-md p-8 text-center">
            <h2 className="text-xl font-semibold text-[var(--ink)]">Data Unavailable</h2>
            <p className="mt-2 text-sm text-[var(--soft)]">{error}</p>
            <button className="action-chip action-chip-danger mx-auto mt-6" onClick={fetchData}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="monitor-root" data-theme={dark ? "dark" : "light"}>
      <div className="monitor-backdrop" />

      <div className="relative z-10 flex h-screen flex-col">
        <header className="monitor-header px-3 py-2 lg:px-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-base font-semibold tracking-tight text-[var(--ink)] lg:text-lg leading-tight">
                  iOne Starlink Inventory
                </h1>
                <p className="text-[10px] text-[var(--muted)]">Live stock, deployment & location visibility &middot; {data.lastUpdated}</p>
              </div>
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-600">Under Development</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
              <div className="input-shell min-w-[200px] flex-1 lg:max-w-xs">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search kit, location, project..."
                  className="w-full bg-transparent px-2 py-1 text-xs text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                />
              </div>

              <button className={`chip-btn ${viewMode === "dashboard" ? "chip-btn-active" : ""}`} onClick={() => setViewMode("dashboard")}>Dashboard</button>
              <button className={`chip-btn ${viewMode === "map" ? "chip-btn-active" : ""}`} onClick={() => setViewMode("map")}>Map</button>
              <button className={`chip-btn ${autoRefresh ? "chip-btn-live" : ""}`} onClick={() => setAutoRefresh((value) => !value)}>{autoRefresh ? "Live" : "Paused"}</button>
              <button className={`chip-btn ${dark ? "chip-btn-active" : ""}`} onClick={() => setDark((value) => !value)}>{dark ? "Light" : "Dark"}</button>
            </div>
          </div>
        </header>

        <section className="mt-2 px-3 pb-2 lg:px-4">
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
            <MetricCard label="Total Kits" value={data.totalKits} tone="neutral" />
            <MetricCard label="Deployed" value={data.totalDeployed} tone="success" />
            <MetricCard label="In Storage" value={data.totalUndeployed} tone="info" />
            <MetricCard label="Storage Hubs" value={data.totalHubs} tone="warning" />
            <MetricCard label="Brand New" value={data.totalNew} tone="success" />
            <MetricCard label="Used" value={data.totalUsed} tone="warning" />
          </div>
        </section>

        <main className="min-h-0 flex-1 px-3 pb-3 lg:px-4">
          {viewMode === "map" ? (
            <section className="panel-card relative h-full overflow-hidden p-0">
              <MapViewDynamic kits={shownKits} dark={dark} swipCoords={data.swipCoords} />
              {searchTerm ? (
                <div className="absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2 rounded-full border border-[var(--line)] bg-[color:color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 py-1.5 text-xs text-[var(--soft)] backdrop-blur">
                  Showing {shownKits.length.toLocaleString()} matches for "{searchTerm}".
                </div>
              ) : null}
            </section>
          ) : searchTerm ? (
            <KitsTable
              title="Search Results"
              subtitle={`Matched "${searchTerm}" across all kit fields.`}
              kits={globalSearchResults}
            />
          ) : (
            <section className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="min-h-0 lg:col-span-5">
                <HubSummaryCard hubSummaries={data.hubSummaries} />
              </div>

              <div className="flex min-h-0 flex-col gap-3 lg:col-span-3">
                <InventoryOverviewCard
                  data={pieData}
                  onShowDeployed={() => setModalFilter("deployed")}
                  onShowStorage={() => setModalFilter("storage")}
                  filters={{
                    model: filterModel,
                    category: filterCategory,
                    project: filterProject,
                  }}
                  filterOptions={filterOptions}
                  onFilterChange={(key, val) => {
                    if (key === "model") setFilterModel(val);
                    else if (key === "category") setFilterCategory(val);
                    else if (key === "project") setFilterProject(val);
                  }}
                  onClearFilters={() => { setFilterModel(""); setFilterCategory(""); setFilterProject(""); }}
                />
                <BreakdownCard title="Service Categories" items={data.serviceCategories} colorMap={SERVICE_CAT_COLORS} />
              </div>

              <div className="flex min-h-0 flex-col gap-3 lg:col-span-4">
                <BarBreakdownCard title="Kit Condition" items={data.conditionBreakdown} colorMap={CONDITION_COLORS} />
                <BreakdownCard title="Starlink Model" items={data.modelBreakdown} colorMap={MODEL_COLORS} />
              </div>
            </section>
          )}
        </main>
      </div>

      {modalFilter ? (
        <KitDetailModal
          filter={modalFilter}
          kits={filteredKits}
          onClose={() => setModalFilter(null)}
        />
      ) : null}
    </div>
  );
}