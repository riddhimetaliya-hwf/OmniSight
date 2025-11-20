
import { ServiceMetric, ITIssue, AIInsight } from '../types';

// Service Desk Metrics
export const serviceDesk: ServiceMetric[] = [
  {
    id: 'sd1',
    name: 'Ticket Volume',
    category: 'service_desk',
    value: 357,
    unit: 'tickets',
    trend: 12,
    status: 'warning',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 300 + Math.floor(Math.random() * 150)
    }))
  },
  {
    id: 'sd2',
    name: 'Average Resolution Time',
    category: 'service_desk',
    value: 4.2,
    unit: 'hours',
    trend: -5,
    status: 'healthy',
    slaTarget: 8,
    slaCompliance: 92,
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 3 + Math.random() * 3
    }))
  },
  {
    id: 'sd3',
    name: 'Escalation Rate',
    category: 'service_desk',
    value: 18,
    unit: '%',
    trend: 4,
    status: 'warning',
    slaTarget: 15,
    slaCompliance: 85,
    owner: 'Sarah Chen',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 12 + Math.random() * 10
    }))
  },
  {
    id: 'sd4',
    name: 'SLA Compliance',
    category: 'service_desk',
    value: 89,
    unit: '%',
    trend: -3,
    status: 'warning',
    slaTarget: 95,
    slaCompliance: 89,
    owner: 'Michael Reed',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 85 + Math.random() * 10
    }))
  }
];

// Security Metrics
export const security: ServiceMetric[] = [
  {
    id: 'sec1',
    name: 'Security Incidents',
    category: 'security',
    value: 12,
    unit: 'incidents',
    trend: 20,
    status: 'critical',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 5 + Math.floor(Math.random() * 10)
    }))
  },
  {
    id: 'sec2',
    name: 'Avg Response Time',
    category: 'security',
    value: 28,
    unit: 'minutes',
    trend: -15,
    status: 'healthy',
    slaTarget: 45,
    slaCompliance: 97,
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 20 + Math.random() * 20
    }))
  },
  {
    id: 'sec3',
    name: 'Threat Detection Rate',
    category: 'security',
    value: 94,
    unit: '%',
    trend: 2,
    status: 'healthy',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 90 + Math.random() * 8
    }))
  }
];

// Infrastructure Metrics
export const infrastructure: ServiceMetric[] = [
  {
    id: 'inf1',
    name: 'System Uptime',
    category: 'infrastructure',
    value: 99.92,
    unit: '%',
    trend: -0.05,
    status: 'healthy',
    slaTarget: 99.9,
    slaCompliance: 100,
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 99.8 + Math.random() * 0.19
    }))
  },
  {
    id: 'inf2',
    name: 'Average Latency',
    category: 'infrastructure',
    value: 185,
    unit: 'ms',
    trend: 12,
    status: 'warning',
    slaTarget: 150,
    slaCompliance: 87,
    owner: 'James Wilson',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 150 + Math.random() * 50
    }))
  },
  {
    id: 'inf3',
    name: 'Maintenance Compliance',
    category: 'infrastructure',
    value: 92,
    unit: '%',
    trend: 5,
    status: 'healthy',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 85 + Math.random() * 12
    }))
  }
];

// ITIL Process Metrics
export const itilProcesses: ServiceMetric[] = [
  {
    id: 'itil1',
    name: 'Change Success Rate',
    category: 'itil',
    value: 84,
    unit: '%',
    trend: -6,
    status: 'warning',
    slaTarget: 90,
    slaCompliance: 84,
    owner: 'Patricia Liu',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 80 + Math.random() * 15
    }))
  },
  {
    id: 'itil2',
    name: 'Incident Aging',
    category: 'itil',
    value: 3.8,
    unit: 'days',
    trend: 15,
    status: 'critical',
    slaTarget: 3,
    slaCompliance: 78,
    owner: 'Robert Johnson',
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 2.5 + Math.random() * 2
    }))
  },
  {
    id: 'itil3',
    name: 'Approval Cycle Time',
    category: 'itil',
    value: 22,
    unit: 'hours',
    trend: -10,
    status: 'healthy',
    slaTarget: 24,
    slaCompliance: 95,
    lastUpdated: '2023-06-10T14:30:00Z',
    history: Array.from({ length: 14 }, (_, i) => ({
      date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 20 + Math.random() * 8
    }))
  }
];

// Issues
export const issues: ITIssue[] = [
  {
    id: 'issue1',
    title: 'Escalation Rate Above Threshold',
    description: 'Service desk escalation rate has been above threshold for 3 consecutive days',
    category: 'service_desk',
    severity: 'medium',
    status: 'open',
    createdAt: '2023-06-09T10:23:00Z',
    updatedAt: '2023-06-10T08:15:00Z',
    assignedTo: 'Sarah Chen',
    relatedMetric: 'sd3'
  },
  {
    id: 'issue2',
    title: 'Critical Infrastructure Latency Spike',
    description: 'Database cluster latency has increased by 25% in the last 24 hours',
    category: 'infrastructure',
    severity: 'high',
    status: 'in_progress',
    createdAt: '2023-06-10T06:45:00Z',
    updatedAt: '2023-06-10T09:30:00Z',
    assignedTo: 'James Wilson',
    relatedMetric: 'inf2'
  },
  {
    id: 'issue3',
    title: 'Security Incident Surge',
    description: 'Unusual increase in security incidents detected in the last 12 hours',
    category: 'security',
    severity: 'high',
    status: 'open',
    createdAt: '2023-06-10T11:20:00Z',
    updatedAt: '2023-06-10T12:05:00Z',
    relatedMetric: 'sec1'
  },
  {
    id: 'issue4',
    title: 'Change Success Rate Declining',
    description: 'Change success rate has dropped below target for 2 weeks in a row',
    category: 'itil',
    severity: 'medium',
    status: 'open',
    createdAt: '2023-06-08T15:10:00Z',
    updatedAt: '2023-06-10T09:45:00Z',
    assignedTo: 'Patricia Liu',
    relatedMetric: 'itil1'
  },
  {
    id: 'issue5',
    title: 'SLA Compliance Trend',
    description: 'Service desk SLA compliance trending downward for 5 consecutive days',
    category: 'service_desk',
    severity: 'medium',
    status: 'in_progress',
    createdAt: '2023-06-07T13:40:00Z',
    updatedAt: '2023-06-10T11:25:00Z',
    assignedTo: 'Michael Reed',
    relatedMetric: 'sd4'
  }
];

// AI Insights
export const aiInsights: AIInsight[] = [
  {
    id: 'ai1',
    title: 'Anomaly: Unusual Ticket Pattern',
    description: 'Detected unusual pattern in network-related tickets, 150% increase from typical Monday volume',
    category: 'anomaly',
    severity: 'warning',
    timestamp: '2023-06-10T09:15:00Z',
    metrics: ['sd1', 'sd2']
  },
  {
    id: 'ai2',
    title: 'Security Threat Correlation',
    description: 'Recent security incidents show correlation with recent network maintenance window',
    category: 'trend',
    severity: 'critical',
    timestamp: '2023-06-10T07:30:00Z',
    metrics: ['sec1', 'inf3']
  },
  {
    id: 'ai3',
    title: 'ITIL Process Recommendation',
    description: 'Change approval bottlenecks identified. Recommend streamlining the CAB process for routine changes',
    category: 'recommendation',
    severity: 'info',
    timestamp: '2023-06-09T16:45:00Z',
    metrics: ['itil3']
  }
];

// All IT metrics
export const allITMetrics = [
  ...serviceDesk,
  ...security,
  ...infrastructure,
  ...itilProcesses
];

