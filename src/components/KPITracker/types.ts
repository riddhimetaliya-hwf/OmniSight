
export type KPITimeframe = 'monthly' | 'quarterly' | 'annual';
export type KPIStatus = 'on-track' | 'at-risk' | 'behind' | 'exceeded';
export type Department = 'sales' | 'marketing' | 'finance' | 'operations' | 'hr' | 'all';
export type BusinessUnit = 'north-america' | 'europe' | 'asia-pacific' | 'latin-america' | 'global';
export type TimeRange = 'current' | 'previous' | 'ytd' | 'last12m';

export interface KPI {
  id: string;
  name: string;
  description: string;
  department: Department;
  businessUnit: BusinessUnit;
  timeframe: KPITimeframe;
  target: number;
  actual: number;
  unit: string;
  prefix?: string;
  formatDecimals?: number;
  previousPeriod?: number;
  startDate: Date;
  endDate: Date;
  status: KPIStatus;
  trend: 'up' | 'down' | 'flat';
  commentary?: string;
  alerts?: KPIAlert[];
  favorite?: boolean;
}

export interface KPIAlert {
  id: string;
  kpiId: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  read: boolean;
}

export interface KPIFiltersState {
  departments: Department[];
  businessUnits: BusinessUnit[];
  timeRange: TimeRange;
  showFavoritesOnly: boolean;
  searchQuery: string;
}
