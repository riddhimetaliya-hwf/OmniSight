
export type SummaryLevel = 'brief' | 'detailed' | 'comprehensive';
export type SummaryFocus = 'trends' | 'anomalies' | 'recommendations' | 'all';

export interface SummaryOptions {
  level: SummaryLevel;
  focus: SummaryFocus;
  includeRecommendations: boolean;
  timeframe: string;
}

export interface SummarySection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'recommendation' | 'trend' | 'anomaly';
  priority: 'high' | 'medium' | 'low';
}

export interface Summary {
  id: string;
  title: string;
  timestamp: string;
  dashboardId?: string;
  reportId?: string;
  sections: SummarySection[];
  options: SummaryOptions;
}

export interface AutoSummaryContextType {
  isGenerating: boolean;
  currentSummary: Summary | null;
  summaryHistory: Summary[];
  generateSummary: (options: SummaryOptions, sourceId: string, sourceType: 'dashboard' | 'report') => Promise<void>;
  regenerateSummary: () => Promise<void>;
  editSummarySection: (sectionId: string, newContent: string) => void;
  exportSummary: (format: 'pdf' | 'docx') => Promise<void>;
  scheduleSummary: (email: string, frequency: 'daily' | 'weekly' | 'monthly') => Promise<void>;
  clearCurrentSummary: () => void;
}
