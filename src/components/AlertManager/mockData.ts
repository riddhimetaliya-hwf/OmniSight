
import { Alert, AlertRule, AlertRecipient } from './types';

export const mockRecipients: AlertRecipient[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1234567890',
    slackId: 'U012345',
    teamsId: 'user123',
    type: 'user',
    order: 1,
  },
  {
    id: 'user-2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1987654321',
    slackId: 'U054321',
    teamsId: 'user456',
    type: 'user',
    order: 2,
  },
  {
    id: 'group-1',
    name: 'Finance Team',
    email: 'finance@example.com',
    type: 'group',
    order: 3,
  },
  {
    id: 'role-1',
    name: 'CFO',
    email: 'cfo@example.com',
    type: 'role',
    order: 4,
  },
];

export const mockAlertRules: AlertRule[] = [
  {
    id: 'rule-1',
    name: 'Monthly Revenue Threshold',
    description: 'Alert if monthly revenue drops below $50,000',
    condition: 'revenue < 50000',
    naturalLanguage: 'Alert me when monthly revenue drops below $50,000',
    threshold: 50000,
    channels: ['email', 'in-app'],
    recipients: [mockRecipients[0], mockRecipients[2]],
    department: 'finance',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
    enabled: true,
    escalationMinutes: 30,
  },
  {
    id: 'rule-2',
    name: 'Critical KPI Change',
    description: 'Notify when any critical KPI changes by more than 10%',
    condition: 'kpi_change > 10',
    naturalLanguage: 'Alert me when any critical KPI changes by more than 10%',
    threshold: 10,
    channels: ['slack', 'email', 'in-app'],
    recipients: [mockRecipients[1], mockRecipients[3]],
    department: 'all',
    createdAt: '2023-06-10T14:15:00Z',
    updatedAt: '2023-06-10T14:15:00Z',
    enabled: true,
    escalationMinutes: 15,
  },
  {
    id: 'rule-3',
    name: 'Workflow Failure',
    description: 'Alert if any automated workflow fails',
    condition: 'workflow_status == "failed"',
    naturalLanguage: 'Alert me when any workflow fails',
    channels: ['teams', 'sms', 'in-app'],
    recipients: [mockRecipients[0]],
    department: 'operations',
    createdAt: '2023-07-05T09:45:00Z',
    updatedAt: '2023-07-05T09:45:00Z',
    enabled: true,
    escalationMinutes: 5,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    ruleId: 'rule-1',
    title: 'Monthly Revenue Below Threshold',
    message: 'Monthly revenue is currently $48,500, which is below the $50,000 threshold.',
    severity: 'high',
    status: 'new',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(), // 35 minutes ago
    updatedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    source: 'kpi',
    sourceId: 'kpi-revenue-monthly',
    department: 'finance',
    metadata: {
      currentValue: 48500,
      threshold: 50000,
      trend: 'down',
    },
    suggestedActions: [
      'Review monthly expenses',
      'Schedule a meeting with the sales team',
      'Analyze price points against competitors'
    ],
  },
  {
    id: 'alert-2',
    ruleId: 'rule-2',
    title: 'Customer Satisfaction Score Dropped',
    message: 'CSAT score dropped by 12% in the last 24 hours.',
    severity: 'medium',
    status: 'acknowledged',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1.5 * 3600000).toISOString(), // 1.5 hours ago
    acknowledgedAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    acknowledgedBy: 'Jane Doe',
    source: 'anomaly',
    department: 'customer-service',
    metadata: {
      previousValue: 85,
      currentValue: 74.8,
      percentChange: -12,
    },
    suggestedActions: [
      'Review recent customer complaints',
      'Check for system outages',
      'Survey affected customers'
    ],
  },
  {
    id: 'alert-3',
    ruleId: 'rule-3',
    title: 'Order Processing Workflow Failed',
    message: 'The automated order processing workflow has failed for 3 consecutive attempts.',
    severity: 'high',
    status: 'escalated',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    escalatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    escalatedTo: 'IT Manager',
    source: 'workflow',
    sourceId: 'workflow-order-processing',
    department: 'operations',
    metadata: {
      workflowId: 'order-processing',
      failureReason: 'Database connection timeout',
      attemptsCount: 3,
    },
    suggestedActions: [
      'Check database server status',
      'Verify network connectivity',
      'Check for recent changes to workflow'
    ],
  },
  {
    id: 'alert-4',
    ruleId: 'rule-2',
    title: 'Lead Generation KPI Increased',
    message: 'Lead generation increased by 15% compared to last month.',
    severity: 'low',
    status: 'new',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    source: 'kpi',
    sourceId: 'kpi-lead-generation',
    department: 'marketing',
    metadata: {
      previousValue: 230,
      currentValue: 264.5,
      percentChange: 15,
    },
    suggestedActions: [
      'Analyze which marketing channels are performing best',
      'Consider increasing budget for successful campaigns'
    ],
  },
  {
    id: 'alert-5',
    ruleId: 'rule-1',
    title: 'Inventory Levels Low',
    message: 'Product SKU-12345 inventory is below reorder threshold.',
    severity: 'medium',
    status: 'snoozed',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 10 * 3600000).toISOString(), // 10 hours ago
    snoozedUntil: new Date(Date.now() + 2 * 3600000).toISOString(), // 2 hours from now
    source: 'system',
    department: 'inventory',
    metadata: {
      productId: 'SKU-12345',
      currentLevel: 15,
      reorderThreshold: 20,
    },
    suggestedActions: [
      'Place order with supplier',
      'Check for alternative suppliers',
      'Adjust reorder threshold'
    ],
  },
];
