
import { BriefingSchedule, BriefingSummary } from './types';

export const mockSchedules: BriefingSchedule[] = [
  {
    id: 'brief-1',
    title: 'Weekly Sales KPIs',
    description: 'Get a summary of key sales metrics every Monday',
    frequency: 'weekly',
    type: 'sales',
    startDate: new Date('2023-06-05'),
    time: '09:00',
    calendar: 'google',
    recipients: ['alex@example.com', 'sarah@example.com'],
    voiceEnabled: true,
    notificationEnabled: true,
    createdAt: new Date('2023-06-01'),
    nextBriefing: new Date(new Date().setDate(new Date().getDate() + (8 - new Date().getDay()) % 7))
  },
  {
    id: 'brief-2',
    title: 'Monthly Finance Report',
    description: 'Monthly financial overview on the 1st of each month',
    frequency: 'monthly',
    type: 'finance',
    startDate: new Date('2023-06-01'),
    time: '10:00',
    calendar: 'outlook',
    recipients: ['finance@example.com', 'cfo@example.com'],
    voiceEnabled: false,
    notificationEnabled: true,
    createdAt: new Date('2023-05-25'),
    nextBriefing: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 10, 0)
  },
  {
    id: 'brief-3',
    title: 'Daily Operations Metrics',
    description: 'Daily summary of critical operational data',
    frequency: 'daily',
    type: 'operations',
    startDate: new Date('2023-06-01'),
    time: '17:00',
    calendar: 'none',
    recipients: ['ops@example.com'],
    voiceEnabled: false,
    notificationEnabled: true,
    createdAt: new Date('2023-05-30'),
    nextBriefing: new Date(new Date().setHours(17, 0, 0, 0))
  },
  {
    id: 'brief-4',
    title: 'Quarterly Business Review',
    description: 'Quarterly performance analysis for executive team',
    frequency: 'quarterly',
    type: 'kpi',
    startDate: new Date('2023-07-01'),
    time: '14:00',
    calendar: 'google',
    recipients: ['ceo@example.com', 'cto@example.com', 'cfo@example.com'],
    voiceEnabled: true,
    notificationEnabled: true,
    createdAt: new Date('2023-05-15'),
    nextBriefing: new Date(2023, 6, 1, 14, 0)
  }
];

export const mockBriefingSummary: BriefingSummary = {
  title: "Weekly Sales KPIs",
  metrics: [
    {
      name: "Revenue",
      value: "$125,430",
      changePercent: 12.5,
      trend: "up"
    },
    {
      name: "New Customers",
      value: 48,
      changePercent: 8.2,
      trend: "up"
    },
    {
      name: "Deal Closure Rate",
      value: "26%",
      changePercent: -2.1,
      trend: "down"
    },
    {
      name: "Average Deal Size",
      value: "$28,500",
      changePercent: 5.3,
      trend: "up"
    },
    {
      name: "Sales Pipeline",
      value: "$1.2M",
      changePercent: 3.8,
      trend: "up"
    },
    {
      name: "Lead Conversion",
      value: "18%",
      changePercent: 0.2,
      trend: "neutral"
    }
  ],
  insights: [
    "Enterprise segment showed 22% growth compared to last week",
    "The North America region continues to outperform with 15% higher deal closure rates",
    "New product features are driving 30% of new customer acquisition",
    "Deal cycle time has decreased from 28 days to 24 days on average"
  ],
  recommendations: [
    "Focus more resources on enterprise segment sales acceleration",
    "Increase sales enablement for the new product features",
    "Review underperforming deal closure rates in EMEA region",
    "Consider adjusting pricing strategy for mid-market segment"
  ]
};
