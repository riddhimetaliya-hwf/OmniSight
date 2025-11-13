
import { InsightData } from "../InsightsEngine/types";

export type Department = 
  | "sales" 
  | "marketing" 
  | "finance" 
  | "operations" 
  | "hr"
  | "all";

export type TimeFrame = 
  | "last24h" 
  | "last7d" 
  | "last30d" 
  | "last90d" 
  | "lastYear" 
  | "ytd" 
  | "custom";

export type Audience = 
  | "executive" 
  | "management" 
  | "technical" 
  | "all-staff";

export type ReportFormat = 
  | "pdf" 
  | "docx" 
  | "xlsx" 
  | "html";

export type ReportFrequency = 
  | "daily" 
  | "weekly" 
  | "monthly" 
  | "quarterly";

export type ReportSectionType = 
  | "summary" 
  | "chart" 
  | "table" 
  | "insight" 
  | "text";

export interface ReportSchedule {
  frequency: ReportFrequency;
  nextRun: Date;
  emails: string[];
}

export interface ReportBranding {
  useLogo: boolean;
  useWatermark: boolean;
  primaryColor: string;
  logoUrl: string;
}

export interface ReportSection {
  id: string;
  type: ReportSectionType;
  title: string;
  content: any; // Varies by type
  insights?: InsightData[];
}

export interface ReportConfig {
  id?: string;
  title: string;
  prompt: string;
  department: Department;
  timeframe: TimeFrame;
  audience: Audience;
  sections: ReportSection[];
  format: ReportFormat;
  schedule: ReportSchedule | null;
  branding: ReportBranding;
}

export interface GeneratedReport {
  title: string;
  sections: ReportSection[];
}
