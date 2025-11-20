
export type BriefingFrequency = 
  | 'one-time'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly';

export type BriefingType = 
  | 'kpi'
  | 'finance'
  | 'sales'
  | 'marketing'
  | 'operations'
  | 'custom';

export type CalendarType = 
  | 'google'
  | 'outlook'
  | 'apple'
  | 'none';

export interface BriefingSchedule {
  id: string;
  title: string;
  description?: string;
  frequency: BriefingFrequency;
  type: BriefingType;
  startDate: Date;
  time: string;
  calendar: CalendarType;
  recipients: string[];
  voiceEnabled: boolean;
  notificationEnabled: boolean;
  createdAt: Date;
  nextBriefing: Date;
}

export interface BriefingSummary {
  title: string;
  metrics: BriefingMetric[];
  insights: string[];
  recommendations: string[];
}

export interface BriefingMetric {
  name: string;
  value: string | number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'neutral';
}
