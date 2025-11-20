
import { Automation, AutomationLog } from './types';

export const mockAutomations: Automation[] = [
  {
    id: 'automation-1',
    name: 'Weekly Finance Report',
    description: 'Generate and email the weekly finance report to the CFO every Friday',
    category: 'reports',
    trigger: {
      id: 'trigger-1',
      type: 'schedule',
      config: {
        frequency: 'weekly',
        time: '09:00',
        days: ['Friday'],
      },
      description: 'Every Friday at 9:00 AM',
    },
    actions: [
      {
        id: 'action-1',
        type: 'generate-report',
        params: {
          reportType: 'finance',
          timeframe: 'weekly',
        },
        description: 'Generate finance report for the past week',
      },
      {
        id: 'action-2',
        type: 'email',
        params: {
          to: 'cfo@company.com',
          subject: 'Weekly Finance Report',
          body: 'Please find attached the weekly finance report.',
        },
        description: 'Email report to CFO',
      },
    ],
    status: 'active',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
    lastRun: '2023-05-19T09:00:00Z',
    nextRun: '2023-05-26T09:00:00Z',
    createdBy: 'Admin User',
    isSystem: false,
  },
  {
    id: 'automation-2',
    name: 'Deal Closed Workflow',
    description: 'When a new deal is closed, notify accounting and start the onboarding process',
    category: 'workflows',
    trigger: {
      id: 'trigger-2',
      type: 'event',
      config: {
        event: 'deal.closed',
      },
      description: 'When a deal is closed',
    },
    actions: [
      {
        id: 'action-3',
        type: 'notification',
        params: {
          channel: 'email',
          to: 'accounting@company.com',
          subject: 'New Deal Closed',
        },
        description: 'Notify accounting team',
      },
      {
        id: 'action-4',
        type: 'workflow',
        params: {
          workflow: 'customer-onboarding',
        },
        description: 'Start customer onboarding workflow',
      },
    ],
    status: 'active',
    createdAt: '2023-06-02T14:45:00Z',
    updatedAt: '2023-06-02T14:45:00Z',
    createdBy: 'Sales Manager',
    isSystem: false,
  },
  {
    id: 'automation-3',
    name: 'Daily Inventory Alert',
    description: 'Check inventory levels daily and alert if any products are below threshold',
    category: 'notifications',
    trigger: {
      id: 'trigger-3',
      type: 'schedule',
      config: {
        frequency: 'daily',
        time: '08:00',
      },
      description: 'Every day at 8:00 AM',
    },
    actions: [
      {
        id: 'action-5',
        type: 'data-check',
        params: {
          source: 'inventory',
          condition: 'quantity < threshold',
        },
        description: 'Check inventory levels against thresholds',
      },
      {
        id: 'action-6',
        type: 'notification',
        params: {
          channel: 'slack',
          channel_id: 'inventory-alerts',
        },
        description: 'Send alert to Slack channel',
      },
    ],
    status: 'active',
    createdAt: '2023-04-10T11:20:00Z',
    updatedAt: '2023-04-10T11:20:00Z',
    lastRun: '2023-05-19T08:00:00Z',
    nextRun: '2023-05-20T08:00:00Z',
    createdBy: 'Inventory Manager',
    isSystem: false,
  },
  {
    id: 'automation-4',
    name: 'Monthly KPI Dashboard',
    description: 'Generate monthly KPI dashboard and distribute to leadership team',
    category: 'reports',
    trigger: {
      id: 'trigger-4',
      type: 'schedule',
      config: {
        frequency: 'monthly',
        time: '07:00',
        days: ['1'], // 1st day of month
      },
      description: 'Monthly on the 1st at 7:00 AM',
    },
    actions: [
      {
        id: 'action-7',
        type: 'generate-dashboard',
        params: {
          dashboardId: 'leadership-kpi',
          timeframe: 'previous-month',
        },
        description: 'Generate leadership KPI dashboard',
      },
      {
        id: 'action-8',
        type: 'distribute',
        params: {
          to: 'leadership-team',
          format: 'pdf',
          channels: ['email', 'slack'],
        },
        description: 'Distribute dashboard to leadership team',
      },
    ],
    status: 'paused',
    createdAt: '2023-01-15T09:10:00Z',
    updatedAt: '2023-04-02T16:30:00Z',
    lastRun: '2023-05-01T07:00:00Z',
    createdBy: 'CEO',
    isSystem: false,
  },
  {
    id: 'automation-5',
    name: 'Customer Feedback Analysis',
    description: 'Analyze customer feedback weekly and create summary report',
    category: 'data',
    trigger: {
      id: 'trigger-5',
      type: 'schedule',
      config: {
        frequency: 'weekly',
        time: '10:00',
        days: ['Monday'],
      },
      description: 'Every Monday at 10:00 AM',
    },
    actions: [
      {
        id: 'action-9',
        type: 'data-processing',
        params: {
          source: 'customer-feedback',
          timeframe: 'past-week',
          processing: 'sentiment-analysis',
        },
        description: 'Run sentiment analysis on customer feedback',
      },
      {
        id: 'action-10',
        type: 'generate-report',
        params: {
          reportType: 'customer-satisfaction',
          format: 'pdf',
        },
        description: 'Generate customer satisfaction report',
      },
      {
        id: 'action-11',
        type: 'email',
        params: {
          to: ['product@company.com', 'customer-success@company.com'],
          subject: 'Weekly Customer Feedback Analysis',
        },
        description: 'Email report to product and customer success teams',
      },
    ],
    status: 'error',
    createdAt: '2023-03-20T13:15:00Z',
    updatedAt: '2023-05-15T09:45:00Z',
    lastRun: '2023-05-15T10:00:00Z',
    createdBy: 'Customer Success Manager',
    isSystem: false,
  },
  {
    id: 'automation-6',
    name: 'New User Welcome Sequence',
    description: 'Automatically send welcome emails to new users',
    category: 'workflows',
    trigger: {
      id: 'trigger-6',
      type: 'event',
      config: {
        event: 'user.created',
      },
      description: 'When a new user signs up',
    },
    actions: [
      {
        id: 'action-12',
        type: 'email',
        params: {
          template: 'welcome-email',
          delay: '0h',
        },
        description: 'Send immediate welcome email',
      },
      {
        id: 'action-13',
        type: 'email',
        params: {
          template: 'getting-started',
          delay: '24h',
        },
        description: 'Send getting started guide after 24 hours',
      },
      {
        id: 'action-14',
        type: 'email',
        params: {
          template: 'feature-highlight',
          delay: '72h',
        },
        description: 'Send feature highlights after 72 hours',
      },
    ],
    status: 'active',
    createdAt: '2023-02-10T11:00:00Z',
    updatedAt: '2023-02-10T11:00:00Z',
    createdBy: 'Marketing Manager',
    isSystem: true,
  },
  {
    id: 'automation-7',
    name: 'Sales Pipeline Reminder',
    description: 'Send a daily reminder to the sales team about deals in the pipeline',
    category: 'notifications',
    trigger: {
      id: 'trigger-7',
      type: 'schedule',
      config: {
        frequency: 'daily',
        time: '17:00',
      },
      description: 'Every day at 5:00 PM',
    },
    actions: [
      {
        id: 'action-15',
        type: 'data-query',
        params: {
          source: 'sales-pipeline',
          query: 'status = "open" AND last_updated < "today - 3 days"',
        },
        description: 'Find stale deals in pipeline',
      },
      {
        id: 'action-16',
        type: 'notification',
        params: {
          channel: 'email',
          to: 'sales-team',
          template: 'pipeline-reminder',
        },
        description: 'Email reminder to sales team',
      },
    ],
    status: 'active',
    createdAt: '2023-04-25T14:00:00Z',
    updatedAt: '2023-04-25T14:00:00Z',
    lastRun: '2023-05-19T17:00:00Z',
    nextRun: '2023-05-20T17:00:00Z',
    createdBy: 'Sales Director',
    isSystem: false,
    suggestedBy: 'ai',
  }
];

export const mockLogs: AutomationLog[] = [
  {
    id: 'log-1',
    automationId: 'automation-1',
    automationName: 'Weekly Finance Report',
    timestamp: '2023-05-19T09:00:00Z',
    status: 'success',
    message: 'Automation executed successfully',
    details: {
      reportGenerated: true,
      emailSent: true,
      recipients: 1,
    },
  },
  {
    id: 'log-2',
    automationId: 'automation-3',
    automationName: 'Daily Inventory Alert',
    timestamp: '2023-05-19T08:00:00Z',
    status: 'success',
    message: 'Automation executed successfully',
    details: {
      itemsChecked: 250,
      itemsBelowThreshold: 0,
      alertsSent: 0,
    },
  },
  {
    id: 'log-3',
    automationId: 'automation-2',
    automationName: 'Deal Closed Workflow',
    timestamp: '2023-05-18T15:30:00Z',
    status: 'success',
    message: 'Automation executed successfully',
    details: {
      dealId: 'D-1234',
      notificationSent: true,
      workflowStarted: true,
    },
  },
  {
    id: 'log-4',
    automationId: 'automation-5',
    automationName: 'Customer Feedback Analysis',
    timestamp: '2023-05-15T10:00:00Z',
    status: 'error',
    message: 'Failed to connect to customer feedback database',
    details: {
      error: 'Database connection timeout',
      step: 'data-processing',
    },
  },
  {
    id: 'log-5',
    automationId: 'automation-4',
    automationName: 'Monthly KPI Dashboard',
    timestamp: '2023-05-01T07:00:00Z',
    status: 'success',
    message: 'Automation executed successfully',
    details: {
      dashboardGenerated: true,
      distributionChannels: ['email', 'slack'],
      recipients: 8,
    },
  },
  {
    id: 'log-6',
    automationId: 'automation-7',
    automationName: 'Sales Pipeline Reminder',
    timestamp: '2023-05-19T17:00:00Z',
    status: 'success',
    message: 'Automation executed successfully',
    details: {
      dealsFound: 12,
      emailsSent: 5,
    },
  },
  {
    id: 'log-7',
    automationId: 'automation-6',
    automationName: 'New User Welcome Sequence',
    timestamp: '2023-05-19T14:22:00Z',
    status: 'success',
    message: 'Welcome email sent to new user',
    details: {
      userId: 'U-5678',
      emailTemplate: 'welcome-email',
    },
  },
  {
    id: 'log-8',
    automationId: 'automation-3',
    automationName: 'Daily Inventory Alert',
    timestamp: '2023-05-18T08:00:00Z',
    status: 'warning',
    message: 'Inventory alert triggered for 3 products',
    details: {
      itemsChecked: 250,
      itemsBelowThreshold: 3,
      alertsSent: 1,
    },
  },
  {
    id: 'log-9',
    automationId: 'automation-6',
    automationName: 'New User Welcome Sequence',
    timestamp: '2023-05-18T09:15:00Z',
    status: 'success',
    message: 'Getting started guide sent to user',
    details: {
      userId: 'U-5601',
      emailTemplate: 'getting-started',
    },
  },
  {
    id: 'log-10',
    automationId: 'automation-7',
    automationName: 'Sales Pipeline Reminder',
    timestamp: '2023-05-18T17:00:00Z',
    status: 'success',
    message: 'Automation executed successfully',
    details: {
      dealsFound: 15,
      emailsSent: 5,
    },
  },
];
