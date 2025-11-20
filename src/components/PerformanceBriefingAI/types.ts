
import { ReactNode } from 'react';

export type ExecutiveRole = 'CEO' | 'CIO' | 'CFO' | 'COO' | 'CHRO' | 'CTO' | 'CMO';

export type BriefingTimeframe = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export type BriefingDeliveryMethod = 'dashboard' | 'email' | 'pdf';

export interface InsightItem {
  id: string;
  headline: string;
  description: string;
  metric?: string;
  value?: number | string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  category: 'kpi' | 'risk' | 'opportunity' | 'trend';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  department: string;
  tags: string[];
}

export interface BriefingSettings {
  role: ExecutiveRole;
  timeframe: BriefingTimeframe;
  deliveryMethods: BriefingDeliveryMethod[];
  departments: string[];
  categories: ('kpi' | 'risk' | 'opportunity' | 'trend')[];
  emailRecipients?: string[];
  scheduledTime?: string;
  isScheduled: boolean;
}

export interface PerformanceBriefingContextProps {
  insights: InsightItem[];
  settings: BriefingSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<BriefingSettings>) => void;
  generateBriefing: (options?: Partial<BriefingSettings>) => Promise<void>;
  exportBriefing: (method: BriefingDeliveryMethod) => Promise<void>;
  scheduleBriefing: (schedule: Partial<BriefingSettings>) => Promise<void>;
  cancelScheduledBriefing: () => Promise<void>;
}
