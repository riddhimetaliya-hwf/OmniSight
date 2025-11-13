
export type InsightType = 'explanation' | 'comparison' | 'anomaly' | 'trend' | 'prediction';

export interface ChartPoint {
  id: string;
  x: string | number;
  y: number;
  date?: Date;
  label?: string;
  category?: string;
}

export interface ChartDataset {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartPoint[];
  color?: string;
}

export interface ChartInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  timestamp: Date;
  chartPoints?: string[]; // IDs of the points this insight refers to
  relatedInsights?: string[]; // IDs of related insights
  confident: boolean;
}
