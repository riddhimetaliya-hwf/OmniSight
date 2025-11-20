
export interface Metric {
  id: string;
  name: string;
  type: 'cycle_time' | 'volume' | 'sla' | 'cost' | 'escalations' | 'other';
  value: number;
  unit: string;
  trend: number; // Percentage change, positive or negative
  target: number;
  department: string;
  owner: string;
  alert: boolean; // Whether this metric has triggered an alert
  history: Array<{ date: string; value: number }>;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'warning' | 'critical';
  source: string;
  metric: string;
  acknowledged: boolean;
}
