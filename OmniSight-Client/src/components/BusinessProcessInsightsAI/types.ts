
export type ProcessArea = 'order-flow' | 'talent-onboard' | 'client-care';
export type InsightType = 'anomaly' | 'trend' | 'explanation' | 'recommendation';
export type ImportanceLevel = 'high' | 'medium' | 'low';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface ProcessInsight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  processArea: ProcessArea;
  importance: ImportanceLevel;
  timestamp: string;
  isPinned: boolean;
  analysis?: string;
  recommendations?: string[];
  relatedMetrics?: string[];
  trend?: TrendDirection;
}
