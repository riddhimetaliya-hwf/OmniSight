
import { InsightItem } from './types';

export const mockInsights: InsightItem[] = [
  {
    id: '1',
    headline: 'IT Service Desk Efficiency Improved 15%',
    description: 'The average resolution time for IT service desk tickets has decreased from 4.2 hours to 3.6 hours in the past week.',
    metric: 'Avg. Resolution Time',
    value: '3.6 hours',
    change: -15,
    changeDirection: 'down',
    category: 'kpi',
    priority: 'high',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    department: 'IT',
    tags: ['service desk', 'efficiency', 'response time']
  },
  {
    id: '2',
    headline: 'Server Maintenance Cost Reduced by 8%',
    description: 'Implementation of automated maintenance processes has led to an 8% reduction in server maintenance costs.',
    metric: 'Monthly Maintenance Cost',
    value: '$42,500',
    change: -8,
    changeDirection: 'down',
    category: 'kpi',
    priority: 'medium',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    department: 'IT',
    tags: ['cost reduction', 'automation', 'maintenance']
  },
  {
    id: '3',
    headline: 'Risk: Network Security Vulnerabilities in Region B',
    description: 'Security scan identified 3 critical vulnerabilities in Region B network infrastructure requiring immediate attention.',
    category: 'risk',
    priority: 'high',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    department: 'IT',
    tags: ['security', 'vulnerability', 'region b']
  },
  {
    id: '4',
    headline: 'Opportunity: Cloud Migration Cost Savings',
    description: 'Analysis shows potential 22% cost savings by migrating remaining on-premise applications to cloud infrastructure.',
    metric: 'Projected Annual Savings',
    value: '$215,000',
    category: 'opportunity',
    priority: 'high',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    department: 'IT',
    tags: ['cloud', 'migration', 'cost savings']
  },
  {
    id: '5',
    headline: 'Employee Onboarding Speed Improved by 12%',
    description: 'Average time to fully onboard new employees has decreased from 8.5 days to 7.5 days this month.',
    metric: 'Avg. Onboarding Time',
    value: '7.5 days',
    change: -12,
    changeDirection: 'down',
    category: 'kpi',
    priority: 'medium',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    department: 'HR',
    tags: ['onboarding', 'efficiency', 'new employees']
  },
  {
    id: '6',
    headline: 'Trend: Increasing Mobile Device Management Requests',
    description: 'Mobile device management requests have increased by 34% over the past quarter, reflecting workforce mobility trends.',
    category: 'trend',
    priority: 'medium',
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    department: 'IT',
    tags: ['mobile', 'device management', 'trends']
  },
  {
    id: '7',
    headline: 'Customer Support SLA Achievement Rate at 96.8%',
    description: 'Customer support team exceeded SLA targets with a 96.8% achievement rate, up from 94.2% last month.',
    metric: 'SLA Achievement',
    value: '96.8%',
    change: 2.6,
    changeDirection: 'up',
    category: 'kpi',
    priority: 'high',
    timestamp: new Date(Date.now() - 518400000).toISOString(),
    department: 'Customer Service',
    tags: ['customer support', 'sla', 'performance']
  },
  {
    id: '8',
    headline: 'Risk: Increasing Software License Compliance Issues',
    description: 'Audit identified 12 instances of potential software license compliance issues requiring review.',
    category: 'risk',
    priority: 'medium',
    timestamp: new Date(Date.now() - 604800000).toISOString(),
    department: 'IT',
    tags: ['license compliance', 'software', 'audit']
  },
  {
    id: '9',
    headline: 'Operations Process Efficiency Improved by 7%',
    description: 'Workflow optimization in the operations department has resulted in a 7% improvement in process efficiency.',
    metric: 'Process Efficiency Score',
    value: '83/100',
    change: 7,
    changeDirection: 'up',
    category: 'kpi',
    priority: 'medium',
    timestamp: new Date(Date.now() - 691200000).toISOString(),
    department: 'Operations',
    tags: ['process efficiency', 'workflow', 'optimization']
  },
  {
    id: '10',
    headline: 'Opportunity: IT Training Program Expansion',
    description: 'Analysis shows skills gap in cloud technologies that could be addressed through expanded training programs.',
    category: 'opportunity',
    priority: 'medium',
    timestamp: new Date(Date.now() - 777600000).toISOString(),
    department: 'IT',
    tags: ['training', 'skills gap', 'cloud']
  }
];
