import { NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const url = new URL(request.url);
  const sheetId = url.searchParams.get("sheet") || process.env.GOOGLE_SHEET_ID!;
  const gid = url.searchParams.get("gid") || "0";

  // List all tabs
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const tabs = (meta.data.sheets || []).map((s) => ({
    title: s.properties?.title,
    sheetId: s.properties?.sheetId,
  }));

  // Find target tab by gid
  const targetTab = tabs.find((t) => String(t.sheetId) === gid) || tabs[0];

  let sample: string[][] = [];
  let rowCount = 0;
  let statusDistribution: Record<string, number> = {};
  let searchResults: Record<string, number> = {};
  let totalWithKitNo = 0;
  if (targetTab?.title) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'${targetTab.title}'!A:Z`,
    });
    const rows = res.data.values || [];
    rowCount = rows.length;
    sample = rows.slice(0, 5);

    // Count status values in column O (index 14) for rows that have a kit number (col E, index 4)
    const dataRows = rows.slice(1);
    const searchTerm = url.searchParams.get("search") || "";
    for (const row of dataRows) {
      if (row[4]) {
        totalWithKitNo++;
        const status = (row[14] || "(empty)").toString().trim() || "(empty)";
        statusDistribution[status] = (statusDistribution[status] || 0) + 1;
      }
      // Search all columns for a term
      if (searchTerm) {
        for (let c = 0; c < row.length; c++) {
          const val = (row[c] || "").toString().trim();
          if (val.toLowerCase().includes(searchTerm.toLowerCase())) {
            const colLetter = String.fromCharCode(65 + c);
            const colHeader = (rows[0]?.[c] || colLetter).toString().trim();
            const key = `Col ${colLetter} (${colHeader}): "${val}"`;
            searchResults[key] = (searchResults[key] || 0) + 1;
          }
        }
      }
    }
  }

  // Cross-reference mode: compare inventory deployed vs DEPED SWIP S1-Installed
  let crossRef = null;
  const doCrossRef = url.searchParams.get("crossref") === "1";
  if (doCrossRef) {
    const inventorySheetId = "1By4rgY6b1xs5oqxtHThVtKsT1FXT6fltEzZ4zSr2ogA";
    const swipSheetId = "1XdByRZ3zYX5pfqEoufLXb3qnPTIh2rBmnfl4JzWoEbQ";

    // Get inventory kits & status (col E=index4, col O=index14)
    const invRes = await sheets.spreadsheets.values.get({
      spreadsheetId: inventorySheetId,
      range: "Sheet1!A:P",
    });
    const invRows = (invRes.data.values || []).slice(1);
    const invMap = new Map<string, string>(); // kitNo -> status
    for (const row of invRows) {
      const kit = (row[4] || "").toString().trim().toUpperCase();
      const status = (row[14] || "").toString().trim().toUpperCase();
      if (kit) invMap.set(kit, status);
    }

    // Get DEPED SWIP kits & installation status (col K=index10 kitNo, col O=index14 status)
    const swipRes = await sheets.spreadsheets.values.get({
      spreadsheetId: swipSheetId,
      range: "Master!A:T",
    });
    const swipRows = (swipRes.data.values || []).slice(1);
    const swipMap = new Map<string, string>(); // kitNo -> installation status
    for (const row of swipRows) {
      const kit = (row[10] || "").toString().trim().toUpperCase();
      const installStatus = (row[14] || "").toString().trim();
      if (kit) swipMap.set(kit, installStatus);
    }

    // Find mismatches
    const installedInSwipNotDeployed: { kit: string; swipStatus: string; invStatus: string }[] = [];
    const deployedNotInSwip: { kit: string; invStatus: string }[] = [];
    const deployedButNotInstalled: { kit: string; swipStatus: string; invStatus: string }[] = [];

    // S1-Installed in SWIP but NOT deployed in inventory
    for (const [kit, swipStatus] of swipMap) {
      if (swipStatus === "S1 - Installed (Success)") {
        const invStatus = invMap.get(kit);
        if (invStatus !== "DEPLOYED") {
          installedInSwipNotDeployed.push({ kit, swipStatus, invStatus: invStatus || "(not in inventory)" });
        }
      }
    }

    // DEPLOYED in inventory but NOT S1-Installed in SWIP
    for (const [kit, invStatus] of invMap) {
      if (invStatus === "DEPLOYED") {
        const swipStatus = swipMap.get(kit);
        if (!swipStatus) {
          deployedNotInSwip.push({ kit, invStatus });
        } else if (swipStatus !== "S1 - Installed (Success)") {
          deployedButNotInstalled.push({ kit, swipStatus, invStatus });
        }
      }
    }

    crossRef = {
      inventoryTotal: invMap.size,
      inventoryDeployed: [...invMap.values()].filter(s => s === "DEPLOYED").length,
      swipTotal: swipMap.size,
      swipS1Installed: [...swipMap.values()].filter(s => s === "S1 - Installed (Success)").length,
      installedInSwipNotDeployed: { count: installedInSwipNotDeployed.length, kits: installedInSwipNotDeployed },
      deployedNotInSwip: { count: deployedNotInSwip.length, kits: deployedNotInSwip.slice(0, 30) },
      deployedButNotInstalled: { count: deployedButNotInstalled.length, kits: deployedButNotInstalled.slice(0, 30) },
    };
  }

  return NextResponse.json({ tabs, targetTab, rowCount, totalWithKitNo, statusDistribution, searchResults, crossRef, sample });
}
