
export interface ServiceMetric {
  id: string;
  name: string;
  category: 'service_desk' | 'security' | 'infrastructure' | 'itil';
  value: number;
  unit: string;
  trend: number;
  status: 'healthy' | 'warning' | 'critical';
  slaTarget?: number;
  slaCompliance?: number;
  owner?: string;
  lastUpdated: string;
  history: Array<{ date: string; value: number }>;
}

export interface ITIssue {
  id: string;
  title: string;
  description: string;
  category: 'service_desk' | 'security' | 'infrastructure' | 'itil';
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  relatedMetric?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'anomaly' | 'trend' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  metrics: string[];
}

