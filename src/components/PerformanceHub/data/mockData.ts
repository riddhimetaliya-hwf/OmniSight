
import { Metric, Alert } from '../types';

// Helper to generate historic data
const generateHistoricData = (days: number, baseValue: number, volatility: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create some random fluctuation
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const value = Math.round(baseValue * randomFactor * 10) / 10;
    
    data.push({
      date: date.toISOString(),
      value
    });
  }
  
  return data;
};

// IT Services Metrics
export const mockITMetrics: Metric[] = [
  {
    id: 'it-1',
    name: 'Service Desk Response Time',
    type: 'cycle_time',
    value: 14.5,
    unit: 'min',
    trend: -8.2,
    target: 15,
    department: 'IT Service Desk',
    owner: 'Sarah Chen',
    alert: false,
    history: generateHistoricData(30, 15, 0.3)
  },
  {
    id: 'it-2',
    name: 'Incident Resolution Time',
    type: 'cycle_time',
    value: 4.8,
    unit: 'hours',
    trend: 12.5,
    target: 4,
    department: 'IT Support',
    owner: 'Michael Johnson',
    alert: true,
    history: generateHistoricData(30, 4, 0.4)
  },
  {
    id: 'it-3',
    name: 'Security Incidents',
    type: 'volume',
    value: 12,
    unit: 'count',
    trend: 33.3,
    target: 5,
    department: 'Cybersecurity',
    owner: 'Alex Williams',
    alert: true,
    history: generateHistoricData(30, 9, 0.6)
  },
  {
    id: 'it-4',
    name: 'System Uptime',
    type: 'sla',
    value: 99.92,
    unit: '%',
    trend: -0.05,
    target: 99.95,
    department: 'Infrastructure',
    owner: 'David Miller',
    alert: true,
    history: generateHistoricData(30, 99.95, 0.001)
  },
  {
    id: 'it-5',
    name: 'Open Service Requests',
    type: 'volume',
    value: 124,
    unit: 'tickets',
    trend: -5.3,
    target: 100,
    department: 'IT Service Desk',
    owner: 'Sarah Chen',
    alert: true,
    history: generateHistoricData(30, 130, 0.2)
  },
  {
    id: 'it-6',
    name: 'Change Success Rate',
    type: 'sla',
    value: 92.4,
    unit: '%',
    trend: 3.8,
    target: 95,
    department: 'Change Management',
    owner: 'Jennifer Lopez',
    alert: false,
    history: generateHistoricData(30, 90, 0.05)
  }
];

// Business Operations Metrics
export const mockBusinessMetrics: Metric[] = [
  {
    id: 'bus-1',
    name: 'Order Processing Time',
    type: 'cycle_time',
    value: 2.4,
    unit: 'days',
    trend: -12.7,
    target: 3.0,
    department: 'Order Management',
    owner: 'Robert Clark',
    alert: false,
    history: generateHistoricData(30, 2.8, 0.3)
  },
  {
    id: 'bus-2',
    name: 'Client Onboarding Duration',
    type: 'cycle_time',
    value: 18.2,
    unit: 'days',
    trend: 10.3,
    target: 15.0,
    department: 'Client Services',
    owner: 'Patricia Davis',
    alert: true,
    history: generateHistoricData(30, 16.5, 0.2)
  },
  {
    id: 'bus-3',
    name: 'SLA Compliance',
    type: 'sla',
    value: 94.7,
    unit: '%',
    trend: -2.1,
    target: 98.0,
    department: 'Client Services',
    owner: 'Patricia Davis',
    alert: true,
    history: generateHistoricData(30, 96.5, 0.03)
  },
  {
    id: 'bus-4',
    name: 'Cost per Transaction',
    type: 'cost',
    value: 42.8,
    unit: '$',
    trend: 5.4,
    target: 40.0,
    department: 'Finance',
    owner: 'Thomas Wilson',
    alert: true,
    history: generateHistoricData(30, 40.5, 0.1)
  },
  {
    id: 'bus-5',
    name: 'Client Escalations',
    type: 'escalations',
    value: 8,
    unit: 'count',
    trend: -33.3,
    target: 5,
    department: 'Client Services',
    owner: 'Patricia Davis',
    alert: true,
    history: generateHistoricData(30, 12, 0.5)
  },
  {
    id: 'bus-6',
    name: 'Process Automation Rate',
    type: 'sla',
    value: 68.5,
    unit: '%',
    trend: 12.3,
    target: 75.0,
    department: 'Operations',
    owner: 'James Anderson',
    alert: false,
    history: generateHistoricData(30, 61, 0.1)
  }
];

// Performance Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'System Uptime Below Threshold',
    description: 'Production environment experiencing intermittent availability issues affecting 3 critical applications.',
    timestamp: '25 minutes ago',
    severity: 'critical',
    source: 'Infrastructure Monitoring',
    metric: 'System Uptime',
    acknowledged: false
  },
  {
    id: 'alert-2',
    title: 'Security Incidents Spike',
    description: 'Unusual increase in security incidents detected in the last 4 hours. 80% are attempted login breaches.',
    timestamp: '2 hours ago',
    severity: 'critical',
    source: 'Security Operations',
    metric: 'Security Incidents',
    acknowledged: true
  },
  {
    id: 'alert-3',
    title: 'Client Onboarding SLA Breach',
    description: 'Average onboarding time has exceeded target by 21% for enterprise clients in the EMEA region.',
    timestamp: '3 hours ago',
    severity: 'warning',
    source: 'Client Services',
    metric: 'Client Onboarding Duration',
    acknowledged: false
  },
  {
    id: 'alert-4',
    title: 'Open Service Requests Backlog',
    description: 'IT Service Desk backlog exceeds capacity planning by 24%. Risk of additional SLA breaches.',
    timestamp: '5 hours ago',
    severity: 'warning',
    source: 'IT Service Management',
    metric: 'Open Service Requests',
    acknowledged: true
  },
  {
    id: 'alert-5',
    title: 'Incident Resolution Time Increasing',
    description: 'Average time to resolve P2 incidents has increased by 12.5% over the past week.',
    timestamp: '8 hours ago',
    severity: 'warning',
    source: 'IT Support',
    metric: 'Incident Resolution Time',
    acknowledged: false
  }
];
