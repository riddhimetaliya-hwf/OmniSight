import { Snapshot, KPIWidget } from '../types';

export const mockSnapshots: Snapshot[] = [
  {
    id: 'priorities-1',
    title: 'Top 3 priorities this week',
    type: 'priorities',
    items: [
      { 
        id: 'p1', 
        text: 'Review Q3 financial results and prepare Board presentation', 
        status: 'in-progress',
        dueDate: '2023-10-15'
      },
      { 
        id: 'p2', 
        text: 'Finalize strategic partnership with TechGlobal', 
        status: 'pending',
        dueDate: '2023-10-18'
      },
      { 
        id: 'p3', 
        text: 'Approve new headcount requests for engineering teams', 
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
        text: 'Pricing strategy for enterprise customers in APAC region', 
        status: 'pending',
        dueDate: '2023-10-14'
      },
      { 
        id: 'd2', 
        text: 'Resource allocation for new product development initiative', 
        status: 'pending',
        dueDate: '2023-10-16'
      },
      { 
        id: 'd3', 
        text: 'Data center expansion proposal from Infrastructure team', 
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
        text: 'Customer retention rates have improved by 15% following the latest product update'
      },
      { 
        id: 'i2', 
        text: 'Marketing spend efficiency in digital channels is outperforming traditional channels by 3.2x'
      },
      { 
        id: 'i3', 
        text: 'Operational costs in the EMEA region show concerning upward trend (+12% YoY)'
      }
    ]
  }
];

export const mockKPIWidgets: KPIWidget[] = [
  {
    id: 'sales-kpi',
    title: 'Sales Performance',
    value: '$4.8M',
    change: '+12.5%',
    trend: 'up',
    target: '$5.0M',
    progress: 96,
    period: 'This Quarter'
  },
  {
    id: 'revenue-kpi',
    title: 'Revenue Growth',
    value: '$12.3M',
    change: '+8.2%',
    trend: 'up',
    target: '$13.5M',
    progress: 91,
    period: 'YTD'
  },
  {
    id: 'costs-kpi',
    title: 'Operating Costs',
    value: '$3.2M',
    change: '-2.1%',
    trend: 'down',
    target: '$3.0M',
    progress: 93,
    period: 'This Quarter'
  },
  {
    id: 'headcount-kpi',
    title: 'Headcount',
    value: '1,245',
    change: '+3.5%',
    trend: 'up',
    target: '1,300',
    progress: 95,
    period: 'Current'
  },
  {
    id: 'risks-kpi',
    title: 'Open Risks',
    value: '12',
    change: '-25%',
    trend: 'down',
    target: '5',
    progress: 40,
    period: 'Current'
  }
];
