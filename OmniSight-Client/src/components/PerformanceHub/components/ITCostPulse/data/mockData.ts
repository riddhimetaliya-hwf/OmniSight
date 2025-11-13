
import { CostItem, Department, CostSavingOpportunity, BudgetForecast } from '../types';

export const mockCostItems: CostItem[] = [
  {
    id: 'cost-001',
    serviceName: 'Cloud Compute Services',
    cost: 45000,
    budget: 40000,
    department: 'Engineering',
    category: 'infrastructure',
    trend: 7.5,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    consumptionMetrics: {
      computeHours: 12400,
      storage: 15000
    },
    history: [
      { date: '2022-08-01', cost: 36000 },
      { date: '2022-09-01', cost: 38000 },
      { date: '2022-10-01', cost: 39500 },
      { date: '2022-11-01', cost: 41000 },
      { date: '2022-12-01', cost: 42500 },
      { date: '2023-01-01', cost: 45000 }
    ]
  },
  {
    id: 'cost-002',
    serviceName: 'CRM Subscription',
    cost: 28000,
    budget: 30000,
    department: 'Sales',
    category: 'saas',
    trend: -3.2,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    consumptionMetrics: {
      licenses: 250
    },
    history: [
      { date: '2022-08-01', cost: 29500 },
      { date: '2022-09-01', cost: 29000 },
      { date: '2022-10-01', cost: 28800 },
      { date: '2022-11-01', cost: 28500 },
      { date: '2022-12-01', cost: 28200 },
      { date: '2023-01-01', cost: 28000 }
    ]
  },
  {
    id: 'cost-003',
    serviceName: 'Data Warehouse',
    cost: 62000,
    budget: 55000,
    department: 'Data Science',
    category: 'infrastructure',
    trend: 12.4,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    consumptionMetrics: {
      storage: 48000,
      computeHours: 8500
    },
    history: [
      { date: '2022-08-01', cost: 51000 },
      { date: '2022-09-01', cost: 53000 },
      { date: '2022-10-01', cost: 56000 },
      { date: '2022-11-01', cost: 58000 },
      { date: '2022-12-01', cost: 60000 },
      { date: '2023-01-01', cost: 62000 }
    ]
  },
  {
    id: 'cost-004',
    serviceName: 'Collaboration Tools',
    cost: 18000,
    budget: 20000,
    department: 'All Departments',
    category: 'saas',
    trend: -5.0,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    consumptionMetrics: {
      licenses: 850
    },
    history: [
      { date: '2022-08-01', cost: 20000 },
      { date: '2022-09-01', cost: 19800 },
      { date: '2022-10-01', cost: 19500 },
      { date: '2022-11-01', cost: 19000 },
      { date: '2022-12-01', cost: 18500 },
      { date: '2023-01-01', cost: 18000 }
    ]
  },
  {
    id: 'cost-005',
    serviceName: 'Security Services',
    cost: 35000,
    budget: 32000,
    department: 'InfoSec',
    category: 'services',
    trend: 6.8,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    history: [
      { date: '2022-08-01', cost: 30000 },
      { date: '2022-09-01', cost: 31000 },
      { date: '2022-10-01', cost: 32000 },
      { date: '2022-11-01', cost: 33000 },
      { date: '2022-12-01', cost: 34000 },
      { date: '2023-01-01', cost: 35000 }
    ]
  },
  {
    id: 'cost-006',
    serviceName: 'Development Tools',
    cost: 22000,
    budget: 25000,
    department: 'Engineering',
    category: 'saas',
    trend: -4.5,
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    consumptionMetrics: {
      licenses: 320
    },
    history: [
      { date: '2022-08-01', cost: 25000 },
      { date: '2022-09-01', cost: 24500 },
      { date: '2022-10-01', cost: 24000 },
      { date: '2022-11-01', cost: 23500 },
      { date: '2022-12-01', cost: 22800 },
      { date: '2023-01-01', cost: 22000 }
    ]
  }
];

export const mockDepartments: Department[] = [
  {
    id: 'dept-001',
    name: 'Engineering',
    budget: 95000,
    actualSpend: 97000,
    services: ['Cloud Compute Services', 'Development Tools', 'Collaboration Tools']
  },
  {
    id: 'dept-002',
    name: 'Sales',
    budget: 45000,
    actualSpend: 42000,
    services: ['CRM Subscription', 'Collaboration Tools']
  },
  {
    id: 'dept-003',
    name: 'Data Science',
    budget: 70000,
    actualSpend: 78000,
    services: ['Data Warehouse', 'Collaboration Tools', 'Development Tools']
  },
  {
    id: 'dept-004',
    name: 'InfoSec',
    budget: 50000,
    actualSpend: 53000,
    services: ['Security Services', 'Collaboration Tools']
  },
  {
    id: 'dept-005',
    name: 'Marketing',
    budget: 35000,
    actualSpend: 32000,
    services: ['CRM Subscription', 'Collaboration Tools']
  }
];

export const mockSavingOpportunities: CostSavingOpportunity[] = [
  {
    id: 'save-001',
    title: 'Consolidate CRM Licenses',
    description: 'Analysis shows 15% of CRM licenses are inactive for 90+ days. Consider reclaiming or reducing license count.',
    potentialSavings: 4200,
    difficulty: 'easy',
    timeframe: 'immediate',
    impactedServices: ['CRM Subscription'],
    actionSteps: [
      'Run license usage report',
      'Identify inactive users',
      'Reclaim licenses',
      'Adjust subscription tier'
    ]
  },
  {
    id: 'save-002',
    title: 'Optimize Cloud Storage Tiers',
    description: 'Moving rarely accessed data to lower-cost storage tiers could reduce storage costs by up to 30%.',
    potentialSavings: 15000,
    difficulty: 'medium',
    timeframe: 'short-term',
    impactedServices: ['Cloud Compute Services', 'Data Warehouse'],
    actionSteps: [
      'Analyze data access patterns',
      'Define storage tiering policy',
      'Migrate cold data to lower-cost tiers',
      'Implement lifecycle policies'
    ]
  },
  {
    id: 'save-003',
    title: 'Rightsize Compute Instances',
    description: 'Over 25% of compute instances are significantly underutilized. Downsizing them could save substantial costs.',
    potentialSavings: 9800,
    difficulty: 'medium',
    timeframe: 'immediate',
    impactedServices: ['Cloud Compute Services'],
    actionSteps: [
      'Review utilization metrics',
      'Identify candidates for downsizing',
      'Test performance on smaller instances',
      'Schedule instance modifications'
    ]
  }
];

export const mockBudgetForecast: BudgetForecast[] = [
  { month: 'Jan', projected: 210000, actual: 215000, variance: 5000 },
  { month: 'Feb', projected: 215000, actual: 220000, variance: 5000 },
  { month: 'Mar', projected: 220000, actual: 232000, variance: 12000 },
  { month: 'Apr', projected: 225000, actual: 240000, variance: 15000 },
  { month: 'May', projected: 230000, actual: 244000, variance: 14000 },
  { month: 'Jun', projected: 235000, actual: 0, variance: 0 },
  { month: 'Jul', projected: 240000, actual: 0, variance: 0 },
  { month: 'Aug', projected: 245000, actual: 0, variance: 0 }
];
