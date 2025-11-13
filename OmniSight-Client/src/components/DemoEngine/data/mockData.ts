
import { DemoPersonaData } from '../types';
import { mockKPIWidgets, mockSnapshots } from '@/components/OmniCommand/data/mockData';
import { mockInsights, mockRecommendations } from '@/components/ExecCopilot/data/mockData';

// CEO Mock Data
export const ceoData: DemoPersonaData = {
  command: {
    kpis: [
      {
        id: 'revenue-kpi',
        title: 'Total Revenue',
        value: '$42.8M',
        change: '+8.5%',
        trend: 'up',
        target: '$45.0M',
        progress: 95,
        period: 'YTD'
      },
      {
        id: 'profit-kpi',
        title: 'Net Profit',
        value: '$12.3M',
        change: '+6.7%',
        trend: 'up',
        target: '$13.5M',
        progress: 91,
        period: 'YTD'
      },
      {
        id: 'market-kpi',
        title: 'Market Share',
        value: '23.5%',
        change: '+1.2%',
        trend: 'up',
        target: '25%',
        progress: 94,
        period: 'Current'
      },
      {
        id: 'customer-kpi',
        title: 'Customer NPS',
        value: '62',
        change: '+5',
        trend: 'up',
        target: '65',
        progress: 95,
        period: 'Current'
      },
      {
        id: 'growth-kpi',
        title: 'YoY Growth',
        value: '14.2%',
        change: '+2.1%',
        trend: 'up',
        target: '15.0%',
        progress: 95,
        period: 'Current'
      }
    ],
    snapshots: mockSnapshots,
    alerts: [],
    recommendations: []
  },
  insights: mockInsights,
  workflows: [],
  dashboards: []
};

// CFO Mock Data
export const cfoData: DemoPersonaData = {
  command: {
    kpis: [
      {
        id: 'cash-kpi',
        title: 'Cash Position',
        value: '$18.7M',
        change: '+5.2%',
        trend: 'up',
        target: '$20.0M',
        progress: 93,
        period: 'Current'
      },
      {
        id: 'opex-kpi',
        title: 'OPEX',
        value: '$8.4M',
        change: '-3.1%',
        trend: 'down',
        target: '$8.0M',
        progress: 95,
        period: 'This Quarter'
      },
      {
        id: 'margin-kpi',
        title: 'Gross Margin',
        value: '36.5%',
        change: '+0.8%',
        trend: 'up',
        target: '38.0%',
        progress: 96,
        period: 'This Quarter'
      },
      {
        id: 'ar-kpi',
        title: 'AR Turnover',
        value: '42 days',
        change: '-3 days',
        trend: 'down',
        target: '38 days',
        progress: 90,
        period: 'Current'
      },
      {
        id: 'tax-kpi',
        title: 'Effective Tax Rate',
        value: '22.1%',
        change: '-0.4%',
        trend: 'down',
        target: '21.5%',
        progress: 97,
        period: 'YTD'
      }
    ],
    snapshots: [
      {
        id: 'priorities-1',
        title: 'Top 3 priorities this week',
        type: 'priorities',
        items: [
          { 
            id: 'p1', 
            text: 'Review Q3 financial forecast with FP&A team', 
            status: 'in-progress',
            dueDate: '2023-10-15'
          },
          { 
            id: 'p2', 
            text: 'Finalize budget allocation for new cloud infrastructure', 
            status: 'pending',
            dueDate: '2023-10-18'
          },
          { 
            id: 'p3', 
            text: 'Prepare board presentation on capital allocation strategy', 
            status: 'pending',
            dueDate: '2023-10-20'
          }
        ]
      },
      {
        id: 'decisions-1',
        title: 'Pending decisions',
        type: 'decisions',
        items: [
          { 
            id: 'd1', 
            text: 'Approve new AP automation system', 
            status: 'pending',
            dueDate: '2023-10-14'
          },
          { 
            id: 'd2', 
            text: 'Finalize terms for new credit facility', 
            status: 'pending',
            dueDate: '2023-10-16'
          },
          { 
            id: 'd3', 
            text: 'Review and approve tax strategy for international expansion', 
            status: 'pending',
            dueDate: '2023-10-19'
          }
        ]
      },
      {
        id: 'insights-1',
        title: 'AI insights',
        type: 'insights',
        items: [
          { 
            id: 'i1', 
            text: 'Cash conversion cycle has improved by 12% after implementing new payment terms'
          },
          { 
            id: 'i2', 
            text: 'European operations showing 15% higher overhead costs compared to similar-sized NA operations'
          },
          { 
            id: 'i3', 
            text: 'Current vendor payment terms could be optimized to improve cash flow by estimated $450K per quarter'
          }
        ]
      }
    ],
    alerts: [],
    recommendations: []
  },
  insights: mockInsights,
  workflows: [],
  dashboards: []
};

// COO Mock Data
export const cooData: DemoPersonaData = {
  command: {
    kpis: [
      {
        id: 'production-kpi',
        title: 'Production Efficiency',
        value: '92.8%',
        change: '+1.5%',
        trend: 'up',
        target: '95.0%',
        progress: 98,
        period: 'This Month'
      },
      {
        id: 'inventory-kpi',
        title: 'Inventory Turnover',
        value: '12.3x',
        change: '+0.7x',
        trend: 'up',
        target: '13.0x',
        progress: 95,
        period: 'This Quarter'
      },
      {
        id: 'delivery-kpi',
        title: 'On-Time Delivery',
        value: '94.2%',
        change: '+2.1%',
        trend: 'up',
        target: '96.0%',
        progress: 98,
        period: 'This Month'
      },
      {
        id: 'defect-kpi',
        title: 'Defect Rate',
        value: '0.8%',
        change: '-0.3%',
        trend: 'down',
        target: '0.5%',
        progress: 85,
        period: 'This Month'
      },
      {
        id: 'utilization-kpi',
        title: 'Asset Utilization',
        value: '87.5%',
        change: '+3.2%',
        trend: 'up',
        target: '90.0%',
        progress: 97,
        period: 'This Month'
      }
    ],
    snapshots: [
      {
        id: 'priorities-1',
        title: 'Top 3 priorities this week',
        type: 'priorities',
        items: [
          { 
            id: 'p1', 
            text: 'Review production capacity plan for Q4 seasonal demand', 
            status: 'in-progress',
            dueDate: '2023-10-15'
          },
          { 
            id: 'p2', 
            text: 'Finalize logistics optimization project scope', 
            status: 'pending',
            dueDate: '2023-10-18'
          },
          { 
            id: 'p3', 
            text: 'Approve new quality control process for manufacturing', 
            status: 'pending',
            dueDate: '2023-10-20'
          }
        ]
      },
      {
        id: 'decisions-1',
        title: 'Pending decisions',
        type: 'decisions',
        items: [
          { 
            id: 'd1', 
            text: 'Select vendor for new warehouse management system', 
            status: 'pending',
            dueDate: '2023-10-14'
          },
          { 
            id: 'd2', 
            text: 'Approve new maintenance schedule for production lines', 
            status: 'pending',
            dueDate: '2023-10-16'
          },
          { 
            id: 'd3', 
            text: 'Review proposal for new distribution center in the Southwest', 
            status: 'pending',
            dueDate: '2023-10-19'
          }
        ]
      },
      {
        id: 'insights-1',
        title: 'AI insights',
        type: 'insights',
        items: [
          { 
            id: 'i1', 
            text: 'Predictive maintenance has reduced unplanned downtime by 28% in Q3'
          },
          { 
            id: 'i2', 
            text: 'New cross-docking procedure has reduced warehouse costs by 12% while improving delivery times'
          },
          { 
            id: 'i3', 
            text: 'Supplier quality issues from Vendor XYZ account for 42% of all defects - recommend review'
          }
        ]
      }
    ],
    alerts: [],
    recommendations: []
  },
  insights: mockInsights,
  workflows: [],
  dashboards: []
};

// CMO Mock Data
export const cmoData: DemoPersonaData = {
  command: {
    kpis: [
      {
        id: 'mql-kpi',
        title: 'Marketing Qualified Leads',
        value: '2,845',
        change: '+12.3%',
        trend: 'up',
        target: '3,000',
        progress: 95,
        period: 'This Quarter'
      },
      {
        id: 'cac-kpi',
        title: 'Customer Acquisition Cost',
        value: '$285',
        change: '-8.1%',
        trend: 'down',
        target: '$250',
        progress: 88,
        period: 'This Quarter'
      },
      {
        id: 'conversion-kpi',
        title: 'Lead Conversion Rate',
        value: '3.8%',
        change: '+0.5%',
        trend: 'up',
        target: '4.0%',
        progress: 95,
        period: 'This Month'
      },
      {
        id: 'roi-kpi',
        title: 'Marketing ROI',
        value: '325%',
        change: '+45%',
        trend: 'up',
        target: '350%',
        progress: 93,
        period: 'YTD'
      },
      {
        id: 'social-kpi',
        title: 'Social Engagement',
        value: '12.4M',
        change: '+18.7%',
        trend: 'up',
        target: '15.0M',
        progress: 83,
        period: 'This Quarter'
      }
    ],
    snapshots: [
      {
        id: 'priorities-1',
        title: 'Top 3 priorities this week',
        type: 'priorities',
        items: [
          { 
            id: 'p1', 
            text: 'Finalize holiday campaign assets and messaging', 
            status: 'in-progress',
            dueDate: '2023-10-15'
          },
          { 
            id: 'p2', 
            text: 'Review Q4 digital ad spend allocation', 
            status: 'pending',
            dueDate: '2023-10-18'
          },
          { 
            id: 'p3', 
            text: 'Approve new brand positioning for enterprise segment', 
            status: 'pending',
            dueDate: '2023-10-20'
          }
        ]
      },
      {
        id: 'decisions-1',
        title: 'Pending decisions',
        type: 'decisions',
        items: [
          { 
            id: 'd1', 
            text: 'Select agency partner for rebranding project', 
            status: 'pending',
            dueDate: '2023-10-14'
          },
          { 
            id: 'd2', 
            text: 'Approve budget for new marketing automation platform', 
            status: 'pending',
            dueDate: '2023-10-16'
          },
          { 
            id: 'd3', 
            text: 'Go/no-go decision on sponsoring industry conference', 
            status: 'pending',
            dueDate: '2023-10-19'
          }
        ]
      },
      {
        id: 'insights-1',
        title: 'AI insights',
        type: 'insights',
        items: [
          { 
            id: 'i1', 
            text: 'Video content is generating 3.2x higher engagement than other content types'
          },
          { 
            id: 'i2', 
            text: 'Email campaign A/B test shows 28% higher conversion with personalized subject lines'
          },
          { 
            id: 'i3', 
            text: 'Customer segmentation analysis reveals underserved mid-market opportunity worth est. $3.5M'
          }
        ]
      }
    ],
    alerts: [],
    recommendations: []
  },
  insights: mockInsights,
  workflows: [],
  dashboards: []
};

// CHRO Mock Data
export const chroData: DemoPersonaData = {
  command: {
    kpis: [
      {
        id: 'headcount-kpi',
        title: 'Total Headcount',
        value: '1,245',
        change: '+3.5%',
        trend: 'up',
        target: '1,300',
        progress: 96,
        period: 'Current'
      },
      {
        id: 'retention-kpi',
        title: 'Employee Retention',
        value: '91.2%',
        change: '+2.4%',
        trend: 'up',
        target: '93.0%',
        progress: 98,
        period: 'This Year'
      },
      {
        id: 'time-to-hire-kpi',
        title: 'Time to Hire',
        value: '28 days',
        change: '-5 days',
        trend: 'down',
        target: '25 days',
        progress: 90,
        period: 'This Quarter'
      },
      {
        id: 'satisfaction-kpi',
        title: 'Employee Satisfaction',
        value: '4.2/5',
        change: '+0.3',
        trend: 'up',
        target: '4.5/5',
        progress: 93,
        period: 'This Quarter'
      },
      {
        id: 'diversity-kpi',
        title: 'Diversity Index',
        value: '72.5%',
        change: '+4.8%',
        trend: 'up',
        target: '80.0%',
        progress: 91,
        period: 'Current'
      }
    ],
    snapshots: [
      {
        id: 'priorities-1',
        title: 'Top 3 priorities this week',
        type: 'priorities',
        items: [
          { 
            id: 'p1', 
            text: 'Finalize annual compensation review process', 
            status: 'in-progress',
            dueDate: '2023-10-15'
          },
          { 
            id: 'p2', 
            text: 'Review Q4 hiring plan with department heads', 
            status: 'pending',
            dueDate: '2023-10-18'
          },
          { 
            id: 'p3', 
            text: 'Approve new leadership development program', 
            status: 'pending',
            dueDate: '2023-10-20'
          }
        ]
      },
      {
        id: 'decisions-1',
        title: 'Pending decisions',
        type: 'decisions',
        items: [
          { 
            id: 'd1', 
            text: 'Select new employee wellness program vendor', 
            status: 'pending',
            dueDate: '2023-10-14'
          },
          { 
            id: 'd2', 
            text: 'Finalize remote work policy updates', 
            status: 'pending',
            dueDate: '2023-10-16'
          },
          { 
            id: 'd3', 
            text: 'Approve budget for employer branding initiative', 
            status: 'pending',
            dueDate: '2023-10-19'
          }
        ]
      },
      {
        id: 'insights-1',
        title: 'AI insights',
        type: 'insights',
        items: [
          { 
            id: 'i1', 
            text: 'Engineering department shows 28% higher turnover than company average'
          },
          { 
            id: 'i2', 
            text: 'Flexible work arrangement pilot increased employee satisfaction by 18%'
          },
          { 
            id: 'i3', 
            text: 'Internal mobility program has reduced hiring costs by 22% for mid-level positions'
          }
        ]
      }
    ],
    alerts: [],
    recommendations: []
  },
  insights: mockInsights,
  workflows: [],
  dashboards: []
};
