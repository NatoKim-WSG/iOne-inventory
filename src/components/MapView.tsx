"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { resolveCoordinates } from "@/lib/ph-coordinates";
import { createPieIcon, createClusterIcon } from "@/lib/map-icons";
import type { KitInfo } from "@/types/inventory";

interface MapViewProps {
  kits: KitInfo[];
  dark: boolean;
  swipCoords?: Record<string, { lat: number; lng: number }>;
}

// Tile layers
const LIGHT_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DARK_TILES =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const LIGHT_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const DARK_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

interface LocationGroup {
  key: string;
  lat: number;
  lng: number;
  deployed: number;
  stored: number;
  province: string;
  municipality: string;
  storageHub: string;
  kits: KitInfo[];
}

export default function MapView({ kits, dark, swipCoords }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<"all" | "deployed" | "storage">("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [showUnmapped, setShowUnmapped] = useState(false);

  // Get unique project names for filter dropdown
  const projectOptions = useMemo(() => {
    const projects = new Set<string>();
    for (const kit of kits) {
      const proj = (kit.project || "").trim();
      if (proj) projects.add(proj);
    }
    return Array.from(projects).sort();
  }, [kits]);

  // Apply filters to kits
  const filteredKits = useMemo(() => {
    return kits.filter((kit) => {
      if (statusFilter === "deployed" && kit.status !== "Deployed") return false;
      if (statusFilter === "storage" && kit.status === "Deployed") return false;
      if (projectFilter !== "all" && kit.project !== projectFilter) return false;
      return true;
    });
  }, [kits, statusFilter, projectFilter]);

  // Group kits by resolved coordinates
  const locationGroups = useMemo(() => {
    const groups = new Map<string, LocationGroup>();

    for (const kit of filteredKits) {
      const coords = resolveCoordinates(
        kit.province,
        kit.municipality,
        kit.storageHub,
        kit.status,
        swipCoords,
        kit.address
      );
      if (!coords) continue;

      // Round to ~100m precision to group nearby kits
      const key = `${coords.lat.toFixed(3)},${coords.lng.toFixed(3)}`;

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          lat: coords.lat,
          lng: coords.lng,
          deployed: 0,
          stored: 0,
          province: "",
          municipality: "",
          storageHub: "",
          kits: [],
        });
      }

      const group = groups.get(key)!;
      if (kit.status === "Deployed") {
        group.deployed++;
      } else {
        group.stored++;
      }
      group.kits.push(kit);

      // Use the most specific name available
      if (kit.province && !group.province) group.province = kit.province;
      if (kit.municipality && !group.municipality)
        group.municipality = kit.municipality;
      if (kit.storageHub && !group.storageHub)
        group.storageHub = kit.storageHub;
    }

    return Array.from(groups.values());
  }, [filteredKits, swipCoords]);

  // Collect unmapped kits
  const unmappedKits = useMemo(() => {
    return filteredKits.filter(
      (kit) =>
        !resolveCoordinates(
          kit.province,
          kit.municipality,
          kit.storageHub,
          kit.status,
          swipCoords,
          kit.address
        )
    );
  }, [filteredKits, swipCoords]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [12.8797, 121.774],
      zoom: 6,
      zoomControl: true,
      attributionControl: true,
    });

    const tile = L.tileLayer(dark ? DARK_TILES : LIGHT_TILES, {
      attribution: dark ? DARK_ATTR : LIGHT_ATTR,
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;
    tileRef.current = tile;

    return () => {
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update tiles on dark mode change
  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    tileRef.current.setUrl(dark ? DARK_TILES : LIGHT_TILES);
    tileRef.current.options.attribution = dark ? DARK_ATTR : LIGHT_ATTR;
  }, [dark]);

  // Update markers when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old cluster layer
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      iconCreateFunction: (cluster: any) => {
        const markers = cluster.getAllChildMarkers();
        let totalDeployed = 0;
        let totalStored = 0;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const marker of markers as any[]) {
          const d = marker._kitData;
          if (d) {
            totalDeployed += d.deployed;
            totalStored += d.stored;
          }
        }

        return createClusterIcon(
          totalDeployed,
          totalStored,
          markers.length
        );
      },
    });

    for (const group of locationGroups) {
      const marker = L.marker([group.lat, group.lng], {
        icon: createPieIcon(group.deployed, group.stored, 36),
      });

      // Attach kit data for cluster icon aggregation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (marker as any)._kitData = {
        deployed: group.deployed,
        stored: group.stored,
      };

      // Build popup content
      const total = group.deployed + group.stored;
      const isHubGroup = group.deployed === 0 && group.stored > 0;
      const locationParts = [group.municipality, group.province].filter(Boolean);
      const locationName =
        locationParts.length > 0
          ? locationParts.join(", ")
          : group.storageHub || "Unknown Location";

      let popupHtml: string;

      if (isHubGroup) {
        // Storage hub popup — show hub name, stock count
        const hubName = group.storageHub || locationName;
        popupHtml = `
          <div style="min-width:200px;font-family:Sora,Segoe UI,sans-serif;font-size:12px;">
            <div style="font-weight:700;font-size:13px;margin-bottom:2px;color:#1f2937;">
              ${hubName}
            </div>
            <div style="color:#6b7280;font-size:10px;margin-bottom:6px;">Storage Hub</div>
            <div style="display:flex;gap:12px;margin-bottom:6px;">
              <div>
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:4px;"></span>
                Deployed Out: <strong>${group.deployed.toLocaleString()}</strong>
              </div>
            </div>
            <div style="display:flex;gap:12px;margin-bottom:6px;">
              <div>
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3b82f6;margin-right:4px;"></span>
                In Stock: <strong>${group.stored.toLocaleString()}</strong>
              </div>
            </div>
            <div style="border-top:1px solid #e5e7eb;padding-top:4px;margin-top:4px;color:#6b7280;font-size:11px;">
              Total: <strong style="color:#1f2937;">${total.toLocaleString()}</strong> kits
            </div>
          </div>
        `;
      } else {
        // Deployed / mixed popup
        const deployedPct =
          total > 0 ? ((group.deployed / total) * 100).toFixed(1) : "0";
        const storedPct =
          total > 0 ? ((group.stored / total) * 100).toFixed(1) : "0";

        popupHtml = `
          <div style="min-width:200px;font-family:Sora,Segoe UI,sans-serif;font-size:12px;">
            <div style="font-weight:700;font-size:13px;margin-bottom:6px;color:#1f2937;">
              ${locationName}
            </div>
            <div style="display:flex;gap:12px;margin-bottom:6px;">
              <div>
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:4px;"></span>
                Deployed: <strong>${group.deployed.toLocaleString()}</strong>
                <span style="color:#6b7280;"> (${deployedPct}%)</span>
              </div>
            </div>
            <div style="display:flex;gap:12px;margin-bottom:6px;">
              <div>
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3b82f6;margin-right:4px;"></span>
                In Storage: <strong>${group.stored.toLocaleString()}</strong>
                <span style="color:#6b7280;"> (${storedPct}%)</span>
              </div>
            </div>
            <div style="border-top:1px solid #e5e7eb;padding-top:4px;margin-top:4px;color:#6b7280;font-size:11px;">
              Total: <strong style="color:#1f2937;">${total.toLocaleString()}</strong> kits
              &middot; ${group.lat.toFixed(4)}, ${group.lng.toFixed(4)}
            </div>
          </div>
        `;
      }

      marker.bindPopup(popupHtml, { maxWidth: 300, className: "kit-popup" });
      clusterGroup.addLayer(marker);
    }

    map.addLayer(clusterGroup);
    clusterRef.current = clusterGroup;
  }, [locationGroups]);

  const btnBase = "px-2.5 py-1 rounded text-[11px] font-medium transition-colors";
  const btnActive = dark
    ? "bg-blue-500/25 text-blue-400 border border-blue-500/40"
    : "bg-blue-100 text-blue-700 border border-blue-300";
  const btnInactive = dark
    ? "bg-[#2e2e45]/80 text-gray-400 border border-[#3e3e55] hover:bg-[#3e3e55]"
    : "bg-white/80 text-gray-600 border border-gray-300 hover:bg-gray-100";

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full rounded-lg" />

      {/* ── Filter controls (top-left) ── */}
      <div
        className={`absolute top-3 left-3 z-[1000] flex flex-col gap-2 px-3 py-2.5 rounded-lg shadow-lg ${
          dark
            ? "bg-[#242438]/95 border border-[#2e2e45]"
            : "bg-white/95 border border-gray-200"
        }`}
      >
        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold uppercase tracking-wide w-10 ${dark ? "text-gray-500" : "text-gray-400"}`}>
            Show
          </span>
          <button
            onClick={() => setStatusFilter("all")}
            className={`${btnBase} ${statusFilter === "all" ? btnActive : btnInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("deployed")}
            className={`${btnBase} ${statusFilter === "deployed" ? btnActive : btnInactive}`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
            Deployed
          </button>
          <button
            onClick={() => setStatusFilter("storage")}
            className={`${btnBase} ${statusFilter === "storage" ? btnActive : btnInactive}`}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
            Storage Hubs
          </button>
        </div>

        {/* Project filter */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold uppercase tracking-wide w-10 ${dark ? "text-gray-500" : "text-gray-400"}`}>
            Project
          </span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className={`text-[11px] rounded px-2 py-1 border max-w-[200px] ${
              dark
                ? "bg-[#2e2e45] border-[#3e3e55] text-gray-300"
                : "bg-white border-gray-300 text-gray-700"
            } focus:outline-none focus:ring-1 focus:ring-blue-500/50`}
          >
            <option value="all">All Projects</option>
            {projectOptions.map((proj) => (
              <option key={proj} value={proj}>
                {proj}
              </option>
            ))}
          </select>
          {(statusFilter !== "all" || projectFilter !== "all") && (
            <button
              onClick={() => { setStatusFilter("all"); setProjectFilter("all"); }}
              className={`text-[10px] underline ${dark ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"}`}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Stats overlay (top-right) ── */}
      <div
        className={`absolute top-3 right-3 z-[1000] px-3 py-2 rounded-lg text-xs shadow-lg ${
          dark
            ? "bg-[#242438]/90 border border-[#2e2e45] text-gray-300"
            : "bg-white/90 border border-gray-200 text-gray-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span>
              Deployed:{" "}
              <strong>
                {locationGroups
                  .reduce((s, g) => s + g.deployed, 0)
                  .toLocaleString()}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>
              In Storage:{" "}
              <strong>
                {locationGroups
                  .reduce((s, g) => s + g.stored, 0)
                  .toLocaleString()}
              </strong>
            </span>
          </div>
          <div
            className={`border-l pl-3 ${
              dark ? "border-[#3e3e55]" : "border-gray-300"
            }`}
          >
            {locationGroups.length} locations
            {unmappedKits.length > 0 && (
              <button
                onClick={() => setShowUnmapped(!showUnmapped)}
                className={`ml-1 cursor-pointer underline decoration-dashed underline-offset-2 ${
                  dark ? "text-yellow-400 hover:text-yellow-300" : "text-amber-600 hover:text-amber-700"
                }`}
                title="Click to see unmapped kits"
              >
                ({unmappedKits.length} unmapped)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Unmapped kits panel ── */}
      {showUnmapped && unmappedKits.length > 0 && (
        <div
          className={`absolute top-0 right-0 z-[1001] h-full flex flex-col shadow-2xl ${
            dark
              ? "bg-[#1e1e32] border-l border-[#2e2e45] text-gray-300"
              : "bg-white border-l border-gray-200 text-gray-700"
          }`}
          style={{ width: "380px" }}
        >
          {/* Panel header */}
          <div
            className={`px-4 py-3 border-b shrink-0 flex items-center justify-between ${
              dark ? "border-[#2e2e45]" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className={`text-sm font-bold ${dark ? "text-gray-100" : "text-gray-900"}`}>
                Unmapped Kits
              </h3>
              <span className={`text-[11px] ${dark ? "text-gray-500" : "text-gray-400"}`}>
                ({unmappedKits.length})
              </span>
            </div>
            <button
              onClick={() => setShowUnmapped(false)}
              className={`p-1 rounded ${dark ? "hover:bg-[#2e2e45] text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Hint */}
          <div
            className={`px-4 py-2 text-[11px] border-b shrink-0 ${
              dark ? "bg-amber-900/20 border-[#2e2e45] text-amber-400/80" : "bg-amber-50 border-amber-100 text-amber-700"
            }`}
          >
            Deployed kits need a matching school name in the SWIP sheet to appear on the map. In-storage kits need a recognized storage hub address.
          </div>

          {/* Table */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <table className="w-full">
              <thead className={`sticky top-0 z-10 ${dark ? "bg-[#1a1a2e]" : "bg-gray-50"}`}>
                <tr>
                  <th className={`px-3 py-1.5 text-left text-[10px] font-semibold uppercase ${dark ? "text-gray-500" : "text-gray-400"}`}>#</th>
                  <th className={`px-3 py-1.5 text-left text-[10px] font-semibold uppercase ${dark ? "text-gray-500" : "text-gray-400"}`}>Kit No</th>
                  <th className={`px-3 py-1.5 text-left text-[10px] font-semibold uppercase ${dark ? "text-gray-500" : "text-gray-400"}`}>Status</th>
                  <th className={`px-3 py-1.5 text-left text-[10px] font-semibold uppercase ${dark ? "text-gray-500" : "text-gray-400"}`}>Address / School</th>
                  <th className={`px-3 py-1.5 text-left text-[10px] font-semibold uppercase ${dark ? "text-gray-500" : "text-gray-400"}`}>Project</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? "divide-[#2e2e45]" : "divide-gray-50"}`}>
                {unmappedKits.map((kit, i) => (
                  <tr key={`${kit.kitNo}-${i}`} className={dark ? "hover:bg-[#2a2a42]" : "hover:bg-amber-50"}>
                    <td className={`px-3 py-1.5 text-[11px] ${dark ? "text-gray-500" : "text-gray-400"}`}>{i + 1}</td>
                    <td className={`px-3 py-1.5 text-[11px] font-mono font-medium ${dark ? "text-gray-200" : "text-gray-900"}`}>{kit.kitNo}</td>
                    <td className="px-3 py-1.5 text-[11px]">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        kit.status === "Deployed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {kit.status}
                      </span>
                    </td>
                    <td className={`px-3 py-1.5 text-[11px] max-w-[140px] truncate ${
                      kit.address
                        ? (dark ? "text-gray-300" : "text-gray-700")
                        : (dark ? "text-red-400" : "text-red-500")
                    }`} title={kit.address || "Missing"}>
                      {kit.address || "Missing"}
                    </td>
                    <td className={`px-3 py-1.5 text-[11px] max-w-[100px] truncate ${dark ? "text-gray-400" : "text-gray-500"}`} title={kit.project}>
                      {kit.project || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
