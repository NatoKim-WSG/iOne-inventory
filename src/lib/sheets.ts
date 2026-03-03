import { google } from "googleapis";

interface InventoryRow {
  condition: string;
  model: string;
  serviceCategory: string;
  version: string;
  kitNo: string;
  router: string;
  powerSupply: string;
  powerStation: string;
  project: string;
  province: string;
  municipality: string;
  address: string;
  deploymentDate: string;
  storageHub: string;
  status: string;
  remarks: string;
}

export interface KitInfo {
  kitNo: string;
  version: string;
  model: string;
  condition: string;
  serviceCategory: string;
  project: string;
  province: string;
  municipality: string;
  address: string;
  deploymentDate: string;
  storageHub: string;
  status: string;
  remarks: string;
}

interface HubSummary {
  hub: string;
  deployed: number;
  undeployed: number;
  total: number;
}

interface BreakdownItem {
  label: string;
  count: number;
}

export interface DashboardData {
  totalKits: number;
  totalDeployed: number;
  totalUndeployed: number;
  totalHubs: number;
  totalNew: number;
  totalUsed: number;
  hubSummaries: HubSummary[];
  deployedByGen: BreakdownItem[];
  conditionBreakdown: BreakdownItem[];
  modelBreakdown: BreakdownItem[];
  kits: KitInfo[];
  lastUpdated: string;
}

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

/**
 * Parse a coordinate value that may be decimal degrees or DMS format.
 * DMS examples: "12°46' 16.003\"", "121°16' 59.133\""
 */
function parseCoord(raw: string): number {
  const s = raw.trim();
  // Try plain number first
  const num = parseFloat(s);
  if (!isNaN(num) && !s.includes("°")) return num;
  // Try DMS: degrees°minutes' seconds"
  const dms = s.match(/(\d+)[°]\s*(\d+)[''′]\s*([\d.]+)/);
  if (dms) {
    return parseFloat(dms[1]) + parseFloat(dms[2]) / 60 + parseFloat(dms[3]) / 3600;
  }
  return NaN;
}

export async function getSWIPCoordinates(): Promise<Record<string, { lat: number; lng: number }>> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const swipSheetId = "1zchK5za6LM5aj91s4KDn-CCgNJ5vQFDsCk_ov4XsSn4";

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: swipSheetId,
      range: "Master!A2:T",
    });

    const rows = res.data.values || [];
    // Col 4 = School Name (matches inventory "DEPLOYMENT ADDRESS")
    // Col 18 = usually Longitude, Col 19 = usually Latitude
    // Some rows have lat/lng swapped — auto-detect based on Philippine bounds
    const result: Record<string, { lat: number; lng: number }> = {};

    for (const row of rows) {
      const schoolName = (row[4] || "").toString().trim();
      const v18 = parseCoord((row[18] || "").toString());
      const v19 = parseCoord((row[19] || "").toString());

      if (!schoolName || isNaN(v18) || isNaN(v19)) continue;

      let lat: number;
      let lng: number;

      // Standard: col18=lng (115-130), col19=lat (4-22)
      if (v18 >= 115 && v18 <= 130 && v19 >= 4 && v19 <= 22) {
        lng = v18;
        lat = v19;
      // Swapped: col18=lat (4-22), col19=lng (115-130)
      } else if (v18 >= 4 && v18 <= 22 && v19 >= 115 && v19 <= 130) {
        lat = v18;
        lng = v19;
      } else {
        continue; // Out of Philippines bounds either way
      }

      const key = schoolName.toLowerCase();
      result[key] = { lat, lng };
    }

    return result;
  } catch (error) {
    console.error("Error fetching SWIP coordinates:", error);
    return {};
  }
}

export async function getInventoryData(): Promise<DashboardData> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const inventoryRes = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Sheet1!A:P",
  });

  const rows = inventoryRes.data.values || [];
  const dataRows = rows.slice(1);

  // Column mapping (0-indexed):
  // 0=CONDITION, 1=STARLINK MODEL, 2=SERVICE CATEGORIES, 3=Starlink Ver.,
  // 4=STARLINK KIT NO., 5=STARLINK ROUTER, 6=STARLINK POWER SUPPLY,
  // 7=POWER STATION, 8=PROJECT/CLIENT NAME, 9=PROVINCE, 10=MUNICIPALITY,
  // 11=DEPLOYMENT ADDRESS, 12=DEPLOYMENT DATE, 13=STORAGE HUB ADDRESS ORIGIN,
  // 14=STATUS, 15=REMARKS
  const inventory: InventoryRow[] = dataRows
    .filter((row) => row[4])
    .map((row) => ({
      condition: (row[0] || "").toString().trim(),
      model: (row[1] || "").toString().trim(),
      serviceCategory: (row[2] || "").toString().trim(),
      version: (row[3] || "").toString().trim(),
      kitNo: (row[4] || "").toString().trim(),
      router: (row[5] || "").toString().trim(),
      powerSupply: (row[6] || "").toString().trim(),
      powerStation: (row[7] || "").toString().trim(),
      project: (row[8] || "").toString().trim(),
      province: (row[9] || "").toString().trim(),
      municipality: (row[10] || "").toString().trim(),
      address: (row[11] || "").toString().trim(),
      deploymentDate: (row[12] || "").toString().trim(),
      storageHub: (row[13] || "").toString().trim(),
      status: (row[14] || "").toString().trim(),
      remarks: (row[15] || "").toString().trim(),
    }));

  const deployed = inventory.filter(
    (r) => r.status.toLowerCase() === "deployed"
  );
  const undeployed = inventory.filter(
    (r) => r.status.toLowerCase() !== "deployed"
  );

  const hubs = new Set(
    inventory
      .map((r) => (r.storageHub || "").replace(/\s*\d+\s*$/, "").trim())
      .filter((h) => h.length > 0)
  );

  // Hub breakdown
  const hubMap = new Map<string, { deployed: number; undeployed: number }>();
  for (const row of inventory) {
    const rawHub = row.storageHub || "Unassigned";
    const hub = rawHub.replace(/\s*\d+\s*$/, "").trim() || rawHub;
    if (!hubMap.has(hub)) {
      hubMap.set(hub, { deployed: 0, undeployed: 0 });
    }
    const entry = hubMap.get(hub)!;
    if (row.status.toLowerCase() === "deployed") {
      entry.deployed++;
    } else {
      entry.undeployed++;
    }
  }

  const hubSummaries: HubSummary[] = Array.from(hubMap.entries())
    .map(([hub, counts]) => ({
      hub,
      deployed: counts.deployed,
      undeployed: counts.undeployed,
      total: counts.deployed + counts.undeployed,
    }))
    .sort((a, b) => b.total - a.total);

  // Deployed by generation
  const genMap = new Map<string, number>();
  for (const row of deployed) {
    const ver = row.version.toLowerCase();
    let gen = "Other";
    if (ver.includes("gen 3") || ver.includes("gen3") || ver.includes("gen. 3") || ver === "3") {
      gen = "Gen 3";
    } else if (ver.includes("gen 2") || ver.includes("gen2") || ver.includes("gen. 2") || ver === "2") {
      gen = "Gen 2";
    } else if (ver) {
      gen = row.version;
    }
    genMap.set(gen, (genMap.get(gen) || 0) + 1);
  }
  const deployedByGen: BreakdownItem[] = Array.from(genMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  // Condition breakdown (New / Used / Unspecified)
  const condMap = new Map<string, number>();
  for (const row of inventory) {
    const cond = row.condition || "Unspecified";
    condMap.set(cond, (condMap.get(cond) || 0) + 1);
  }
  const conditionBreakdown: BreakdownItem[] = Array.from(condMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  // Model breakdown (Standard Kit / Flat High Performance / etc.)
  const modelMap = new Map<string, number>();
  for (const row of inventory) {
    const model = row.model || "Unspecified";
    modelMap.set(model, (modelMap.get(model) || 0) + 1);
  }
  const modelBreakdown: BreakdownItem[] = Array.from(modelMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  const totalNew = inventory.filter((r) => r.condition.toLowerCase() === "brand new").length;
  const totalUsed = inventory.filter((r) => r.condition.toLowerCase() === "used").length;

  // Kit-level data for detail views
  const kits: KitInfo[] = inventory.map((r) => ({
    kitNo: r.kitNo,
    version: r.version,
    model: r.model,
    condition: r.condition,
    serviceCategory: r.serviceCategory,
    project: r.project,
    province: r.province,
    municipality: r.municipality,
    address: r.address,
    deploymentDate: r.deploymentDate,
    storageHub: r.storageHub.replace(/\s*\d+\s*$/, "").trim() || r.storageHub,
    status: r.status.toLowerCase() === "deployed" ? "Deployed" : "In Storage",
    remarks: r.remarks,
  }));

  return {
    totalKits: inventory.length,
    totalDeployed: deployed.length,
    totalUndeployed: undeployed.length,
    totalHubs: hubs.size,
    totalNew,
    totalUsed,
    hubSummaries,
    deployedByGen,
    conditionBreakdown,
    modelBreakdown,
    kits,
    lastUpdated: new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    }),
  };
}
