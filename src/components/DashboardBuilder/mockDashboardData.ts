
import { Dashboard, Widget, WidgetType } from "./types";
import { v4 as uuidv4 } from "uuid";

// Helper function to generate random data
const generateRandomData = (type: WidgetType, category?: string) => {
  switch (type) {
    case 'lineChart':
      return [
        { month: 'Jan', value: Math.floor(Math.random() * 1000) },
        { month: 'Feb', value: Math.floor(Math.random() * 1000) },
        { month: 'Mar', value: Math.floor(Math.random() * 1000) },
        { month: 'Apr', value: Math.floor(Math.random() * 1000) },
        { month: 'May', value: Math.floor(Math.random() * 1000) },
        { month: 'Jun', value: Math.floor(Math.random() * 1000) },
      ];
    case 'barChart':
      if (category === 'sales') {
        return [
          { product: 'Product A', sales: Math.floor(Math.random() * 500) + 100 },
          { product: 'Product B', sales: Math.floor(Math.random() * 500) + 100 },
          { product: 'Product C', sales: Math.floor(Math.random() * 500) + 100 },
          { product: 'Product D', sales: Math.floor(Math.random() * 500) + 100 },
        ];
      } else if (category === 'finance') {
        return [
          { department: 'Sales', budget: Math.floor(Math.random() * 50000) + 10000 },
          { department: 'Marketing', budget: Math.floor(Math.random() * 50000) + 10000 },
          { department: 'R&D', budget: Math.floor(Math.random() * 50000) + 10000 },
          { department: 'Operations', budget: Math.floor(Math.random() * 50000) + 10000 },
        ];
      } else if (category === 'hr') {
        return [
          { department: 'Sales', headcount: Math.floor(Math.random() * 50) + 10 },
          { department: 'Marketing', headcount: Math.floor(Math.random() * 50) + 10 },
          { department: 'R&D', headcount: Math.floor(Math.random() * 50) + 10 },
          { department: 'Operations', headcount: Math.floor(Math.random() * 50) + 10 },
        ];
      } else if (category === 'operations') {
        return [
          { process: 'Process A', efficiency: Math.floor(Math.random() * 50) + 50 },
          { process: 'Process B', efficiency: Math.floor(Math.random() * 50) + 50 },
          { process: 'Process C', efficiency: Math.floor(Math.random() * 50) + 50 },
          { process: 'Process D', efficiency: Math.floor(Math.random() * 50) + 50 },
        ];
      }
      return [
        { category: 'Category A', value: Math.floor(Math.random() * 500) + 100 },
        { category: 'Category B', value: Math.floor(Math.random() * 500) + 100 },
        { category: 'Category C', value: Math.floor(Math.random() * 500) + 100 },
        { category: 'Category D', value: Math.floor(Math.random() * 500) + 100 },
      ];
    case 'pieChart':
      return [
        { name: 'Group A', value: Math.floor(Math.random() * 500) + 100 },
        { name: 'Group B', value: Math.floor(Math.random() * 500) + 100 },
        { name: 'Group C', value: Math.floor(Math.random() * 500) + 100 },
        { name: 'Group D', value: Math.floor(Math.random() * 500) + 100 },
      ];
    case 'table':
      if (category === 'sales') {
        return [
          { product: 'Product A', sales: Math.floor(Math.random() * 5000) + 1000, growth: `+${Math.floor(Math.random() * 20)}%` },
          { product: 'Product B', sales: Math.floor(Math.random() * 5000) + 1000, growth: `+${Math.floor(Math.random() * 20)}%` },
          { product: 'Product C', sales: Math.floor(Math.random() * 5000) + 1000, growth: `+${Math.floor(Math.random() * 20)}%` },
          { product: 'Product D', sales: Math.floor(Math.random() * 5000) + 1000, growth: `+${Math.floor(Math.random() * 20)}%` },
        ];
      } else if (category === 'finance') {
        return [
          { department: 'Sales', budget: `$${Math.floor(Math.random() * 50000) + 10000}`, actual: `$${Math.floor(Math.random() * 50000) + 10000}`, variance: `${Math.floor(Math.random() * 10)}%` },
          { department: 'Marketing', budget: `$${Math.floor(Math.random() * 50000) + 10000}`, actual: `$${Math.floor(Math.random() * 50000) + 10000}`, variance: `${Math.floor(Math.random() * 10)}%` },
          { department: 'R&D', budget: `$${Math.floor(Math.random() * 50000) + 10000}`, actual: `$${Math.floor(Math.random() * 50000) + 10000}`, variance: `${Math.floor(Math.random() * 10)}%` },
          { department: 'Operations', budget: `$${Math.floor(Math.random() * 50000) + 10000}`, actual: `$${Math.floor(Math.random() * 50000) + 10000}`, variance: `${Math.floor(Math.random() * 10)}%` },
        ];
      }
      return [
        { id: 1, name: 'Item A', value: Math.floor(Math.random() * 1000), status: 'Active' },
        { id: 2, name: 'Item B', value: Math.floor(Math.random() * 1000), status: 'Inactive' },
        { id: 3, name: 'Item C', value: Math.floor(Math.random() * 1000), status: 'Active' },
        { id: 4, name: 'Item D', value: Math.floor(Math.random() * 1000), status: 'Active' },
      ];
    case 'kpi':
      const value = Math.floor(Math.random() * 10000);
      const trend = Math.random() > 0.5 ? 'up' : 'down';
      const changePercentage = Math.floor(Math.random() * 20) + 1;
      
      return {
        value: category === 'finance' ? `$${value}` : value.toString(),
        trend,
        change: `${changePercentage}%`
      };
    default:
      return [];
  }
};

// Generate widgets for each dashboard type
const generateSalesWidgets = (): Widget[] => {
  return [
    {
      id: `sales-w-${uuidv4()}`,
      title: 'Monthly Sales Trend',
      type: 'lineChart',
      category: 'sales',
      columnSpan: 3,
      data: [
        { month: 'Jan', sales: 45000 },
        { month: 'Feb', sales: 52000 },
        { month: 'Mar', sales: 49000 },
        { month: 'Apr', sales: 63000 },
        { month: 'May', sales: 59000 },
        { month: 'Jun', sales: 67000 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 95
      },
      dataLineage: {
        source: 'CRM Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Sales Team'
      }
    },
    {
      id: `sales-w-${uuidv4()}`,
      title: 'Revenue by Product',
      type: 'barChart',
      category: 'sales',
      columnSpan: 2,
      data: [
        { product: 'Product A', revenue: 120000 },
        { product: 'Product B', revenue: 80000 },
        { product: 'Product C', revenue: 175000 },
        { product: 'Product D', revenue: 60000 },
        { product: 'Product E', revenue: 95000 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 95,
        completeness: 98,
        accuracy: 95,
        consistency: 94,
        timeliness: 92
      },
      dataLineage: {
        source: 'Sales Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Data Team'
      }
    },
    {
      id: `sales-w-${uuidv4()}`,
      title: 'Sales by Region',
      type: 'pieChart',
      category: 'sales',
      data: [
        { name: 'North America', value: 42 },
        { name: 'Europe', value: 28 },
        { name: 'Asia', value: 18 },
        { name: 'Other', value: 12 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 100,
        accuracy: 97,
        consistency: 95,
        timeliness: 96
      },
      dataLineage: {
        source: 'Regional Sales Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Regional Managers'
      }
    },
    {
      id: `sales-w-${uuidv4()}`,
      title: 'Total Revenue',
      type: 'kpi',
      category: 'sales',
      data: {
        value: '$1,234,567',
        trend: 'up',
        change: '12.5%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 99,
        completeness: 100,
        accuracy: 99,
        consistency: 99,
        timeliness: 98
      },
      dataLineage: {
        source: 'Financial Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Finance Team'
      }
    },
    {
      id: `sales-w-${uuidv4()}`,
      title: 'Customer Acquisition Cost',
      type: 'kpi',
      category: 'sales',
      data: {
        value: '$125',
        trend: 'down',
        change: '8.3%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 96,
        completeness: 98,
        accuracy: 95,
        consistency: 96,
        timeliness: 94
      },
      dataLineage: {
        source: 'Marketing Analytics',
        lastUpdated: new Date().toISOString(),
        owner: 'Marketing Team'
      }
    },
    {
      id: `sales-w-${uuidv4()}`,
      title: 'Conversion Rate',
      type: 'kpi',
      category: 'sales',
      data: {
        value: '3.8%',
        trend: 'up',
        change: '0.5%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 99,
        accuracy: 96,
        consistency: 97,
        timeliness: 95
      },
      dataLineage: {
        source: 'Website Analytics',
        lastUpdated: new Date().toISOString(),
        owner: 'Digital Team'
      }
    },
    {
      id: `sales-w-${uuidv4()}`,
      title: 'Top Performing Products',
      type: 'table',
      category: 'sales',
      columnSpan: 3,
      data: [
        { product: 'Product A', revenue: '$320,450', units: '2,345', growth: '+12%' },
        { product: 'Product B', revenue: '$250,320', units: '1,890', growth: '+8%' },
        { product: 'Product C', revenue: '$180,780', units: '1,456', growth: '+15%' },
        { product: 'Product D', revenue: '$145,620', units: '1,123', growth: '+5%' },
        { product: 'Product E', revenue: '$120,450', units: '987', growth: '+3%' },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 98,
        timeliness: 97
      },
      dataLineage: {
        source: 'Product Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Product Team'
      }
    },
  ];
};

const generateFinanceWidgets = (): Widget[] => {
  return [
    {
      id: `finance-w-${uuidv4()}`,
      title: 'Revenue vs Expenses',
      type: 'lineChart',
      category: 'finance',
      columnSpan: 3,
      data: [
        { month: 'Jan', revenue: 425000, expenses: 320000 },
        { month: 'Feb', revenue: 470000, expenses: 340000 },
        { month: 'Mar', revenue: 520000, expenses: 360000 },
        { month: 'Apr', revenue: 580000, expenses: 380000 },
        { month: 'May', revenue: 620000, expenses: 400000 },
        { month: 'Jun', revenue: 690000, expenses: 420000 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 99,
        completeness: 100,
        accuracy: 99,
        consistency: 99,
        timeliness: 98
      },
      dataLineage: {
        source: 'Financial Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Finance Team'
      }
    },
    {
      id: `finance-w-${uuidv4()}`,
      title: 'Department Budget Allocation',
      type: 'pieChart',
      category: 'finance',
      columnSpan: 2,
      data: [
        { name: 'Sales & Marketing', value: 35 },
        { name: 'R&D', value: 25 },
        { name: 'Operations', value: 20 },
        { name: 'Admin', value: 10 },
        { name: 'IT', value: 10 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'Budget Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Finance Team'
      }
    },
    {
      id: `finance-w-${uuidv4()}`,
      title: 'Quarterly Revenue',
      type: 'barChart',
      category: 'finance',
      data: [
        { quarter: 'Q1', revenue: 1250000 },
        { quarter: 'Q2', revenue: 1450000 },
        { quarter: 'Q3', revenue: 1320000 },
        { quarter: 'Q4', revenue: 1680000 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 99,
        accuracy: 97,
        consistency: 95,
        timeliness: 96
      },
      dataLineage: {
        source: 'Financial Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Finance Team'
      }
    },
    {
      id: `finance-w-${uuidv4()}`,
      title: 'Cash Position',
      type: 'kpi',
      category: 'finance',
      data: {
        value: '$4,567,890',
        trend: 'up',
        change: '8.2%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 99,
        completeness: 100,
        accuracy: 99,
        consistency: 99,
        timeliness: 98
      },
      dataLineage: {
        source: 'Banking Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Treasury Team'
      }
    },
    {
      id: `finance-w-${uuidv4()}`,
      title: 'Gross Margin',
      type: 'kpi',
      category: 'finance',
      data: {
        value: '38.5%',
        trend: 'up',
        change: '1.2%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 99,
        accuracy: 97,
        consistency: 95,
        timeliness: 96
      },
      dataLineage: {
        source: 'Financial Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Finance Team'
      }
    },
    {
      id: `finance-w-${uuidv4()}`,
      title: 'Operating Expenses',
      type: 'kpi',
      category: 'finance',
      data: {
        value: '$876,543',
        trend: 'down',
        change: '3.4%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'Expense Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Finance Team'
      }
    },
    {
      id: `finance-w-${uuidv4()}`,
      title: 'Budget vs Actual by Department',
      type: 'table',
      category: 'finance',
      columnSpan: 3,
      data: [
        { department: 'Sales', budget: '$450,000', actual: '$437,890', variance: '-2.7%', status: 'On Track' },
        { department: 'Marketing', budget: '$320,000', actual: '$345,670', variance: '+8.0%', status: 'Over Budget' },
        { department: 'R&D', budget: '$550,000', actual: '$523,450', variance: '-4.8%', status: 'On Track' },
        { department: 'Operations', budget: '$380,000', actual: '$372,560', variance: '-2.0%', status: 'On Track' },
        { department: 'Admin', budget: '$180,000', actual: '$176,780', variance: '-1.8%', status: 'On Track' },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'Budget Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Finance Team'
      }
    },
  ];
};

const generateHRWidgets = (): Widget[] => {
  return [
    {
      id: `hr-w-${uuidv4()}`,
      title: 'Employee Headcount Trend',
      type: 'lineChart',
      category: 'hr',
      columnSpan: 3,
      data: [
        { month: 'Jan', headcount: 245 },
        { month: 'Feb', headcount: 252 },
        { month: 'Mar', headcount: 258 },
        { month: 'Apr', headcount: 263 },
        { month: 'May', headcount: 270 },
        { month: 'Jun', headcount: 278 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 99,
        completeness: 100,
        accuracy: 99,
        consistency: 99,
        timeliness: 98
      },
      dataLineage: {
        source: 'HRIS Database',
        lastUpdated: new Date().toISOString(),
        owner: 'HR Team'
      }
    },
    {
      id: `hr-w-${uuidv4()}`,
      title: 'Department Distribution',
      type: 'pieChart',
      category: 'hr',
      columnSpan: 2,
      data: [
        { name: 'Sales', value: 68 },
        { name: 'Engineering', value: 85 },
        { name: 'Marketing', value: 42 },
        { name: 'Operations', value: 56 },
        { name: 'Finance', value: 27 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'HRIS Database',
        lastUpdated: new Date().toISOString(),
        owner: 'HR Team'
      }
    },
    {
      id: `hr-w-${uuidv4()}`,
      title: 'Time-to-Hire by Department',
      type: 'barChart',
      category: 'hr',
      data: [
        { department: 'Sales', days: 35 },
        { department: 'Engineering', days: 48 },
        { department: 'Marketing', days: 32 },
        { department: 'Operations', days: 28 },
        { department: 'Finance', days: 42 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 95,
        completeness: 97,
        accuracy: 95,
        consistency: 94,
        timeliness: 93
      },
      dataLineage: {
        source: 'Recruitment Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Talent Acquisition'
      }
    },
    {
      id: `hr-w-${uuidv4()}`,
      title: 'Employee Satisfaction',
      type: 'kpi',
      category: 'hr',
      data: {
        value: '4.2/5',
        trend: 'up',
        change: '0.3'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 98,
        accuracy: 96,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'Employee Survey',
        lastUpdated: new Date().toISOString(),
        owner: 'HR Team'
      }
    },
    {
      id: `hr-w-${uuidv4()}`,
      title: 'Retention Rate',
      type: 'kpi',
      category: 'hr',
      data: {
        value: '91.5%',
        trend: 'up',
        change: '2.3%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'HRIS Database',
        lastUpdated: new Date().toISOString(),
        owner: 'HR Team'
      }
    },
    {
      id: `hr-w-${uuidv4()}`,
      title: 'Open Positions',
      type: 'kpi',
      category: 'hr',
      data: {
        value: '24',
        trend: 'down',
        change: '3'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 99,
        completeness: 100,
        accuracy: 99,
        consistency: 99,
        timeliness: 98
      },
      dataLineage: {
        source: 'Recruitment Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Talent Acquisition'
      }
    },
    {
      id: `hr-w-${uuidv4()}`,
      title: 'Recruitment Pipeline',
      type: 'table',
      category: 'hr',
      columnSpan: 3,
      data: [
        { position: 'Senior Developer', applications: 48, interviews: 12, offers: 3, status: 'In Progress' },
        { position: 'Sales Representative', applications: 67, interviews: 15, offers: 5, status: 'In Progress' },
        { position: 'Marketing Manager', applications: 52, interviews: 8, offers: 2, status: 'Offer Accepted' },
        { position: 'Financial Analyst', applications: 39, interviews: 6, offers: 1, status: 'In Progress' },
        { position: 'Operations Coordinator', applications: 28, interviews: 7, offers: 2, status: 'Filled' },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 99,
        accuracy: 97,
        consistency: 96,
        timeliness: 95
      },
      dataLineage: {
        source: 'Recruitment Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Talent Acquisition'
      }
    },
  ];
};

const generateOperationsWidgets = (): Widget[] => {
  return [
    {
      id: `ops-w-${uuidv4()}`,
      title: 'Production Efficiency Trend',
      type: 'lineChart',
      category: 'operations',
      columnSpan: 3,
      data: [
        { month: 'Jan', efficiency: 82 },
        { month: 'Feb', efficiency: 84 },
        { month: 'Mar', efficiency: 87 },
        { month: 'Apr', efficiency: 89 },
        { month: 'May', efficiency: 91 },
        { month: 'Jun', efficiency: 93 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 99,
        accuracy: 97,
        consistency: 96,
        timeliness: 95
      },
      dataLineage: {
        source: 'Operations Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Operations Team'
      }
    },
    {
      id: `ops-w-${uuidv4()}`,
      title: 'Defect Rate by Product Line',
      type: 'barChart',
      category: 'operations',
      columnSpan: 2,
      data: [
        { product: 'Product Line A', defectRate: 1.2 },
        { product: 'Product Line B', defectRate: 0.8 },
        { product: 'Product Line C', defectRate: 1.5 },
        { product: 'Product Line D', defectRate: 0.5 },
        { product: 'Product Line E', defectRate: 1.0 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 96,
        completeness: 98,
        accuracy: 96,
        consistency: 95,
        timeliness: 94
      },
      dataLineage: {
        source: 'Quality Control Database',
        lastUpdated: new Date().toISOString(),
        owner: 'QA Team'
      }
    },
    {
      id: `ops-w-${uuidv4()}`,
      title: 'Inventory Distribution',
      type: 'pieChart',
      category: 'operations',
      data: [
        { name: 'Raw Materials', value: 35 },
        { name: 'WIP', value: 15 },
        { name: 'Finished Goods', value: 50 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'Inventory Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Warehouse Team'
      }
    },
    {
      id: `ops-w-${uuidv4()}`,
      title: 'On-Time Delivery',
      type: 'kpi',
      category: 'operations',
      data: {
        value: '94.8%',
        trend: 'up',
        change: '2.1%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 99,
        accuracy: 97,
        consistency: 96,
        timeliness: 95
      },
      dataLineage: {
        source: 'Logistics Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Shipping Team'
      }
    },
    {
      id: `ops-w-${uuidv4()}`,
      title: 'Equipment Uptime',
      type: 'kpi',
      category: 'operations',
      data: {
        value: '98.2%',
        trend: 'up',
        change: '0.8%'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'Maintenance Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Maintenance Team'
      }
    },
    {
      id: `ops-w-${uuidv4()}`,
      title: 'Inventory Turnover',
      type: 'kpi',
      category: 'operations',
      data: {
        value: '12.3x',
        trend: 'up',
        change: '1.2x'
      },
      config: {
        height: 150,
        showDataQuality: true
      },
      dataQuality: {
        score: 95,
        completeness: 97,
        accuracy: 95,
        consistency: 94,
        timeliness: 93
      },
      dataLineage: {
        source: 'Inventory Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Warehouse Team'
      }
    },
    {
      id: `ops-w-${uuidv4()}`,
      title: 'Quality Control Metrics',
      type: 'table',
      category: 'operations',
      columnSpan: 3,
      data: [
        { checkpoint: 'Initial Inspection', passRate: '98.2%', defectRate: '1.8%', trend: 'Improving' },
        { checkpoint: 'Mid-Process Check', passRate: '96.5%', defectRate: '3.5%', trend: 'Stable' },
        { checkpoint: 'Final QA', passRate: '99.1%', defectRate: '0.9%', trend: 'Improving' },
        { checkpoint: 'Packaging', passRate: '99.8%', defectRate: '0.2%', trend: 'Stable' },
        { checkpoint: 'Shipping Prep', passRate: '99.5%', defectRate: '0.5%', trend: 'Stable' },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'Quality Control Database',
        lastUpdated: new Date().toISOString(),
        owner: 'QA Team'
      }
    },
  ];
};

const generatePerformanceWidgets = (): Widget[] => {
  return [
    {
      id: `performance-w-${uuidv4()}`,
      title: 'Overall Business Performance',
      type: 'lineChart',
      category: 'performance',
      columnSpan: 3,
      data: [
        { month: 'Jan', revenue: 425000, profit: 120000, target: 400000 },
        { month: 'Feb', revenue: 470000, profit: 135000, target: 450000 },
        { month: 'Mar', revenue: 520000, profit: 155000, target: 500000 },
        { month: 'Apr', revenue: 580000, profit: 175000, target: 550000 },
        { month: 'May', revenue: 620000, profit: 190000, target: 600000 },
        { month: 'Jun', revenue: 690000, profit: 215000, target: 650000 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 99,
        completeness: 100,
        accuracy: 99,
        consistency: 99,
        timeliness: 98
      },
      dataLineage: {
        source: 'Business Intelligence',
        lastUpdated: new Date().toISOString(),
        owner: 'BI Team'
      }
    },
    {
      id: `performance-w-${uuidv4()}`,
      title: 'Key Performance Indicators',
      type: 'table',
      category: 'performance',
      columnSpan: 3,
      data: [
        { metric: 'Revenue Growth', value: '12.5%', status: 'Above Target', trend: 'Increasing' },
        { metric: 'Profit Margin', value: '28.2%', status: 'On Target', trend: 'Stable' },
        { metric: 'Customer Retention', value: '94.3%', status: 'Above Target', trend: 'Increasing' },
        { metric: 'Market Share', value: '23.5%', status: 'Below Target', trend: 'Increasing' },
        { metric: 'Employee Productivity', value: '102.8%', status: 'Above Target', trend: 'Increasing' },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 98,
        completeness: 100,
        accuracy: 98,
        consistency: 97,
        timeliness: 96
      },
      dataLineage: {
        source: 'Business Intelligence',
        lastUpdated: new Date().toISOString(),
        owner: 'BI Team'
      }
    },
    {
      id: `performance-w-${uuidv4()}`,
      title: 'Department Performance',
      type: 'barChart',
      category: 'performance',
      columnSpan: 2,
      data: [
        { department: 'Sales', performance: 110, target: 100 },
        { department: 'Marketing', performance: 95, target: 100 },
        { department: 'Operations', performance: 105, target: 100 },
        { department: 'R&D', performance: 98, target: 100 },
        { department: 'Customer Service', performance: 115, target: 100 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 96,
        completeness: 98,
        accuracy: 96,
        consistency: 95,
        timeliness: 94
      },
      dataLineage: {
        source: 'Department KPIs',
        lastUpdated: new Date().toISOString(),
        owner: 'Management Team'
      }
    },
    {
      id: `performance-w-${uuidv4()}`,
      title: 'Revenue Distribution',
      type: 'pieChart',
      category: 'performance',
      data: [
        { name: 'Product A', value: 35 },
        { name: 'Product B', value: 25 },
        { name: 'Product C', value: 20 },
        { name: 'Product D', value: 15 },
        { name: 'Other', value: 5 },
      ],
      config: {
        height: 300,
        showDataQuality: true
      },
      dataQuality: {
        score: 97,
        completeness: 99,
        accuracy: 97,
        consistency: 96,
        timeliness: 95
      },
      dataLineage: {
        source: 'Sales Database',
        lastUpdated: new Date().toISOString(),
        owner: 'Sales Team'
      }
    },
  ];
};

// Generate Dashboard Data
export const generateMockDashboards = (): Dashboard[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Combine widgets from all categories
  const generalDashboardWidgets = [
    ...generatePerformanceWidgets(),
    ...generateSalesWidgets().slice(0, 2),
    ...generateFinanceWidgets().slice(0, 2),
    ...generateHRWidgets().slice(0, 2),
    ...generateOperationsWidgets().slice(0, 2),
  ];
  
  return [
    {
      id: 'd1',
      name: 'Executive Overview',
      description: 'Key metrics across all departments',
      type: 'general',
      widgets: generalDashboardWidgets,
      favorite: true,
      createdAt: yesterday,
      updatedAt: now,
      savedViews: [
        {
          id: 'sv1',
          name: 'Default View',
          filters: {},
          createdAt: yesterday,
          updatedAt: yesterday
        },
        {
          id: 'sv2',
          name: 'Performance Focus',
          filters: {
            categories: ['performance'],
            showFavoritesOnly: false
          },
          createdAt: yesterday,
          updatedAt: yesterday
        }
      ]
    },
    {
      id: 'd2',
      name: 'Sales Overview',
      description: 'Sales KPIs and metrics',
      type: 'sales',
      widgets: generateSalesWidgets(),
      favorite: false,
      createdAt: yesterday,
      updatedAt: now
    },
    {
      id: 'd3',
      name: 'Financial Performance',
      description: 'Financial metrics and KPIs',
      type: 'finance',
      widgets: generateFinanceWidgets(),
      favorite: false,
      createdAt: yesterday,
      updatedAt: now
    },
    {
      id: 'd4',
      name: 'HR Dashboard',
      description: 'Human Resources metrics',
      type: 'hr',
      widgets: generateHRWidgets(),
      favorite: false,
      createdAt: yesterday,
      updatedAt: now
    },
    {
      id: 'd5',
      name: 'Operations Overview',
      description: 'Operational performance metrics',
      type: 'operations',
      widgets: generateOperationsWidgets(),
      favorite: false,
      createdAt: yesterday,
      updatedAt: now
    }
  ];
};
