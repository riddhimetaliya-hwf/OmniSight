
export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertStatus = 'new' | 'acknowledged' | 'resolved' | 'snoozed' | 'escalated';
export type AlertChannel = 'email' | 'teams' | 'slack' | 'sms' | 'in-app';
export type AlertSource = 'kpi' | 'workflow' | 'anomaly' | 'custom' | 'system';

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  naturalLanguage: string;
  threshold?: number;
  channels: AlertChannel[];
  recipients: AlertRecipient[];
  department: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  escalationMinutes: number;
}

export interface AlertPromptRule extends Omit<AlertRule, 'recipients'> {
  thresholdUnit?: string;
  severity: AlertSeverity;
}

export interface AlertRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  slackId?: string;
  teamsId?: string;
  type: 'user' | 'group' | 'role';
  order: number; // For escalation sequence
}

export interface Alert {
  id: string;
  ruleId: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  updatedAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  snoozedUntil?: string;
  escalatedAt?: string;
  escalatedTo?: string;
  source: AlertSource;
  sourceId?: string;
  department: string;
  metadata?: Record<string, any>;
  suggestedActions?: string[];
}

export interface AlertFilterState {
  severity: AlertSeverity[];
  status: AlertStatus[];
  departments: string[];
  timeRange: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'all';
  search: string;
}
