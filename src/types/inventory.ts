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

export interface HubSummary {
  hub: string;
  deployed: number;
  undeployed: number;
  total: number;
}

export interface BreakdownItem {
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
  swipCoords?: Record<string, { lat: number; lng: number }>;
}