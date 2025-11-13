
export type InsightType = 
  | "anomaly" 
  | "trend" 
  | "forecast" 
  | "root-cause" 
  | "correlation";

export type InsightSeverity = 
  | "critical" 
  | "high" 
  | "medium" 
  | "low" 
  | "info";

export type Department = 
  | "sales" 
  | "marketing" 
  | "finance" 
  | "operations" 
  | "hr"
  | "all";

export type MetricCategory = 
  | "revenue" 
  | "costs" 
  | "conversion" 
  | "engagement" 
  | "retention" 
  | "productivity"
  | "all";

export type TimeRange = 
  | "last24h" 
  | "last7d" 
  | "last30d" 
  | "last90d" 
  | "lastYear" 
  | "ytd" 
  | "custom";

export interface InsightData {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  severity: InsightSeverity;
  department: Department;
  metricCategory: MetricCategory;
  timestamp: string;
  confidence: number; // 0-100
  chartData?: any; // For visualization
  recommendations?: string[];
  relatedMetrics?: string[];
}

export interface InsightsFilterState {
  departments: Department[];
  metricCategories: MetricCategory[];
  types: InsightType[];
  severities: InsightSeverity[];
  timeRange: TimeRange;
  startDate?: Date;
  endDate?: Date;
}
