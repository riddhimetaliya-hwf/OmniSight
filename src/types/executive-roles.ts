
export type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO';

export interface ExecutiveKPI {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  priority: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  target?: string | number;
  unit?: string;
}

export interface ExecutiveInsight {
  id: string;
  title: string;
  description: string;
  type: 'strategic' | 'operational' | 'financial' | 'risk' | 'opportunity';
  priority: 'critical' | 'important' | 'informational';
  actionable: boolean;
  recommendation?: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface ExecutiveAlert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  requiresAction: boolean;
  deadline?: Date;
  assignee?: string;
}

export interface RoleConfiguration {
  role: ExecutiveRole;
  displayName: string;
  description: string;
  primaryColor: string;
  icon: string;
  kpis: ExecutiveKPI[];
  insights: ExecutiveInsight[];
  alerts: ExecutiveAlert[];
  focusAreas: string[];
}
