import { 
  SystemNode, 
  SystemEdge, 
  Alert, 
  AIInsight, 
  TimelineEvent, 
  NetworkAnalysis,
  DataLineage,
  SavedView,
  CollaborationSession
} from './types';

export const mockNodes: SystemNode[] = [
  {
    id: 'erp-1',
    type: 'erp',
    label: 'ERP System',
    department: 'operations',
    description: 'Enterprise resource planning system for core business operations',
    status: 'healthy',
    healthScore: 95,
    lastUpdated: '2024-01-15T10:30:00Z',
    owner: 'John Smith',
    tags: ['core', 'critical', 'legacy'],
    version: 'v2.1.4',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'San Francisco, CA',
      region: 'West Coast',
      country: 'USA'
    },
    compliance: {
      standards: ['SOX', 'GDPR', 'ISO 27001'],
      lastAudit: '2024-01-10',
      nextAudit: '2024-07-10',
      complianceScore: 92,
      violations: []
    },
    performance: {
      uptime: 99.8,
      responseTime: 120,
      throughput: 1500,
      errorRate: 0.1,
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 78
    },
    metrics: [
      { 
        name: 'Uptime', 
        value: '99.8%', 
        trend: 'stable',
        unit: '%',
        threshold: { warning: 99.5, critical: 99.0 },
        historicalData: [
          { timestamp: '2024-01-14T00:00:00Z', value: 99.8 },
          { timestamp: '2024-01-13T00:00:00Z', value: 99.9 },
          { timestamp: '2024-01-12T00:00:00Z', value: 99.7 }
        ]
      },
      { 
        name: 'Active Users', 
        value: 342, 
        trend: 'up', 
        change: 5.2,
        unit: 'users',
        threshold: { warning: 300, critical: 250 }
      },
    ],
    annotations: [
      {
        id: 'ann-1',
        author: 'Sarah Johnson',
        content: 'Scheduled maintenance window on Sunday 2-4 AM',
        timestamp: '2024-01-14T15:30:00Z',
        type: 'info'
      }
    ],
    dependencies: ['finance-1', 'operations-1']
  },
  {
    id: 'crm-1',
    type: 'crm',
    label: 'CRM Platform',
    department: 'sales',
    description: 'Customer relationship management system with advanced analytics',
    status: 'healthy',
    healthScore: 98,
    lastUpdated: '2024-01-15T10:25:00Z',
    owner: 'Mike Chen',
    tags: ['customer-facing', 'analytics', 'cloud'],
    version: 'v3.2.1',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY',
      region: 'East Coast',
      country: 'USA'
    },
    compliance: {
      standards: ['GDPR', 'CCPA', 'SOC 2'],
      lastAudit: '2024-01-05',
      nextAudit: '2024-07-05',
      complianceScore: 96,
      violations: []
    },
    performance: {
      uptime: 99.9,
      responseTime: 85,
      throughput: 2200,
      errorRate: 0.05,
      cpuUsage: 38,
      memoryUsage: 55,
      diskUsage: 45
    },
    metrics: [
      { 
        name: 'Deals', 
        value: 128, 
        trend: 'up', 
        change: 12.4,
        unit: 'deals',
        threshold: { warning: 100, critical: 80 }
      },
      { 
        name: 'Conversion Rate', 
        value: '23%', 
        trend: 'up', 
        change: 2.1,
        unit: '%',
        threshold: { warning: 20, critical: 15 }
      },
    ],
    dependencies: ['marketing-1', 'finance-1']
  },
  {
    id: 'hr-1',
    type: 'hr',
    label: 'HR System',
    department: 'hr',
    description: 'Employee management and payroll processing platform',
    status: 'warning',
    healthScore: 78,
    lastUpdated: '2024-01-15T10:20:00Z',
    owner: 'Lisa Wang',
    tags: ['employee-data', 'payroll', 'compliance'],
    version: 'v1.8.3',
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: 'Los Angeles, CA',
      region: 'West Coast',
      country: 'USA'
    },
    compliance: {
      standards: ['HIPAA', 'GDPR', 'FLSA'],
      lastAudit: '2024-01-08',
      nextAudit: '2024-07-08',
      complianceScore: 85,
      violations: [
        {
          id: 'viol-1',
          description: 'Password policy not compliant with new security standards',
          severity: 'medium',
          date: '2024-01-12',
          resolved: false
        }
      ]
    },
    performance: {
      uptime: 98.5,
      responseTime: 200,
      throughput: 800,
      errorRate: 0.8,
      cpuUsage: 65,
      memoryUsage: 78,
      diskUsage: 82
    },
    metrics: [
      { 
        name: 'Employees', 
        value: 512, 
        trend: 'up', 
        change: 3.8,
        unit: 'employees',
        threshold: { warning: 500, critical: 450 }
      },
      { 
        name: 'Open Positions', 
        value: 15, 
        trend: 'down', 
        change: -2.0,
        unit: 'positions',
        threshold: { warning: 20, critical: 30 }
      },
    ],
    annotations: [
      {
        id: 'ann-2',
        author: 'Lisa Wang',
        content: 'Performance degradation detected - investigating',
        timestamp: '2024-01-15T09:45:00Z',
        type: 'warning'
      }
    ],
    dependencies: ['finance-1']
  },
  {
    id: 'marketing-1',
    type: 'marketing',
    label: 'Marketing Platform',
    department: 'marketing',
    description: 'Campaign management and analytics system',
    status: 'healthy',
    healthScore: 92,
    lastUpdated: '2024-01-15T10:28:00Z',
    owner: 'David Kim',
    tags: ['campaigns', 'analytics', 'automation'],
    version: 'v2.5.0',
    location: {
      latitude: 41.8781,
      longitude: -87.6298,
      address: 'Chicago, IL',
      region: 'Midwest',
      country: 'USA'
    },
    compliance: {
      standards: ['GDPR', 'CAN-SPAM', 'CCPA'],
      lastAudit: '2024-01-12',
      nextAudit: '2024-07-12',
      complianceScore: 94,
      violations: []
    },
    performance: {
      uptime: 99.7,
      responseTime: 95,
      throughput: 1800,
      errorRate: 0.2,
      cpuUsage: 42,
      memoryUsage: 58,
      diskUsage: 65
    },
    metrics: [
      { 
        name: 'Active Campaigns', 
        value: 8, 
        trend: 'stable',
        unit: 'campaigns',
        threshold: { warning: 10, critical: 15 }
      },
      { 
        name: 'Lead Generation', 
        value: '12.5K', 
        trend: 'up', 
        change: 8.7,
        unit: 'leads',
        threshold: { warning: 10000, critical: 8000 }
      },
    ],
    dependencies: ['crm-1']
  },
  {
    id: 'finance-1',
    type: 'finance',
    label: 'Finance System',
    department: 'finance',
    description: 'Financial management and reporting suite',
    status: 'healthy',
    healthScore: 96,
    lastUpdated: '2024-01-15T10:32:00Z',
    owner: 'Robert Brown',
    tags: ['financial', 'reporting', 'critical'],
    version: 'v2.0.1',
    location: {
      latitude: 29.7604,
      longitude: -95.3698,
      address: 'Houston, TX',
      region: 'South',
      country: 'USA'
    },
    compliance: {
      standards: ['SOX', 'GAAP', 'IFRS'],
      lastAudit: '2024-01-03',
      nextAudit: '2024-07-03',
      complianceScore: 98,
      violations: []
    },
    performance: {
      uptime: 99.9,
      responseTime: 110,
      throughput: 1200,
      errorRate: 0.05,
      cpuUsage: 35,
      memoryUsage: 48,
      diskUsage: 55
    },
    metrics: [
      { 
        name: 'Monthly Revenue', 
        value: '$2.4M', 
        trend: 'up', 
        change: 5.6,
        unit: 'USD',
        threshold: { warning: 2000000, critical: 1800000 }
      },
      { 
        name: 'Expenses', 
        value: '$1.1M', 
        trend: 'down', 
        change: -2.3,
        unit: 'USD',
        threshold: { warning: 1200000, critical: 1400000 }
      },
    ],
    dependencies: ['erp-1', 'hr-1', 'crm-1']
  },
  {
    id: 'operations-1',
    type: 'operations',
    label: 'Supply Chain System',
    department: 'operations',
    description: 'Inventory and logistics management platform',
    status: 'error',
    healthScore: 45,
    lastUpdated: '2024-01-15T10:15:00Z',
    owner: 'Maria Garcia',
    tags: ['inventory', 'logistics', 'iot'],
    version: 'v1.6.2',
    location: {
      latitude: 33.7490,
      longitude: -84.3880,
      address: 'Atlanta, GA',
      region: 'Southeast',
      country: 'USA'
    },
    compliance: {
      standards: ['ISO 9001', 'FDA', 'DOT'],
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      complianceScore: 72,
      violations: [
        {
          id: 'viol-2',
          description: 'Temperature monitoring system offline for 2 hours',
          severity: 'high',
          date: '2024-01-15',
          resolved: false
        }
      ]
    },
    performance: {
      uptime: 85.2,
      responseTime: 450,
      throughput: 600,
      errorRate: 3.2,
      cpuUsage: 88,
      memoryUsage: 92,
      diskUsage: 95
    },
    metrics: [
      { 
        name: 'Inventory Items', 
        value: 4382, 
        trend: 'down', 
        change: -1.2,
        unit: 'items',
        threshold: { warning: 4000, critical: 3500 }
      },
      { 
        name: 'Delivery Efficiency', 
        value: '92%', 
        trend: 'down', 
        change: -3.5,
        unit: '%',
        threshold: { warning: 95, critical: 90 }
      },
    ],
    annotations: [
      {
        id: 'ann-3',
        author: 'Maria Garcia',
        content: 'Critical system failure - emergency maintenance in progress',
        timestamp: '2024-01-15T09:30:00Z',
        type: 'warning'
      }
    ],
    dependencies: ['erp-1']
  },
];

export const mockEdges: SystemEdge[] = [
  {
    id: 'edge-1',
    source: 'erp-1',
    target: 'finance-1',
    type: 'data-flow',
    label: 'Financial Data',
    dataPoints: ['Revenue', 'Expenses', 'Inventory Value'],
    volume: 5000,
    frequency: 'real-time',
    health: 95,
    lastSync: '2024-01-15T10:30:00Z',
    apiEndpoint: '/api/erp/financial-data',
    dataSchema: 'financial-transaction-v1',
    performance: {
      latency: 45,
      throughput: 1200,
      errorRate: 0.1,
      lastSyncStatus: 'success'
    }
  },
  {
    id: 'edge-2',
    source: 'crm-1',
    target: 'marketing-1',
    type: 'bidirectional',
    label: 'Lead & Campaign Data',
    animated: true,
    dataPoints: ['Customer Profiles', 'Campaign Performance', 'Conversion Analytics'],
    volume: 8000,
    frequency: 'near-real-time',
    health: 98,
    lastSync: '2024-01-15T10:25:00Z',
    apiEndpoint: '/api/crm/marketing-sync',
    dataSchema: 'customer-campaign-v2',
    performance: {
      latency: 30,
      throughput: 2000,
      errorRate: 0.05,
      lastSyncStatus: 'success'
    }
  },
  {
    id: 'edge-3',
    source: 'hr-1',
    target: 'finance-1',
    type: 'data-flow',
    label: 'Payroll Data',
    dataPoints: ['Salary Info', 'Bonuses', 'Benefits Costs'],
    volume: 2000,
    frequency: 'daily',
    health: 78,
    lastSync: '2024-01-15T06:00:00Z',
    apiEndpoint: '/api/hr/payroll-data',
    dataSchema: 'payroll-v1',
    performance: {
      latency: 120,
      throughput: 500,
      errorRate: 0.8,
      lastSyncStatus: 'success'
    }
  },
  {
    id: 'edge-4',
    source: 'crm-1',
    target: 'finance-1',
    type: 'dependency',
    label: 'Deal Values',
    dataPoints: ['Contract Values', 'Opportunity Pipeline', 'Revenue Forecasts'],
    volume: 3000,
    frequency: 'hourly',
    health: 92,
    lastSync: '2024-01-15T10:00:00Z',
    apiEndpoint: '/api/crm/deal-data',
    dataSchema: 'deal-value-v1',
    performance: {
      latency: 60,
      throughput: 800,
      errorRate: 0.2,
      lastSyncStatus: 'success'
    }
  },
  {
    id: 'edge-5',
    source: 'operations-1',
    target: 'erp-1',
    type: 'integration',
    label: 'Supply Chain Data',
    animated: true,
    dataPoints: ['Inventory Levels', 'Order Status', 'Shipment Tracking'],
    volume: 1500,
    frequency: 'real-time',
    health: 45,
    lastSync: '2024-01-15T09:45:00Z',
    apiEndpoint: '/api/operations/supply-chain',
    dataSchema: 'inventory-v1',
    performance: {
      latency: 200,
      throughput: 300,
      errorRate: 3.2,
      lastSyncStatus: 'failed'
    }
  },
  {
    id: 'edge-6',
    source: 'marketing-1',
    target: 'crm-1',
    type: 'data-flow',
    label: 'Lead Generation',
    dataPoints: ['New Leads', 'Campaign Attribution', 'Engagement Metrics'],
    volume: 6000,
    frequency: 'near-real-time',
    health: 94,
    lastSync: '2024-01-15T10:28:00Z',
    apiEndpoint: '/api/marketing/leads',
    dataSchema: 'lead-v2',
    performance: {
      latency: 40,
      throughput: 1500,
      errorRate: 0.2,
      lastSyncStatus: 'success'
    }
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    systemId: 'operations-1',
    title: 'Critical System Failure',
    description: 'Supply chain system experiencing critical performance issues',
    severity: 'critical',
    timestamp: '2024-01-15T09:30:00Z',
    acknowledged: true,
    resolved: false,
    category: 'performance'
  },
  {
    id: 'alert-2',
    systemId: 'hr-1',
    title: 'Performance Degradation',
    description: 'HR system response time increased by 150%',
    severity: 'high',
    timestamp: '2024-01-15T09:45:00Z',
    acknowledged: false,
    resolved: false,
    category: 'performance'
  },
  {
    id: 'alert-3',
    systemId: 'hr-1',
    title: 'Compliance Violation',
    description: 'Password policy not compliant with new security standards',
    severity: 'medium',
    timestamp: '2024-01-12T14:20:00Z',
    acknowledged: true,
    resolved: false,
    category: 'compliance'
  }
];

export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'anomaly',
    title: 'Unusual Data Flow Pattern Detected',
    description: 'Data transfer volume between CRM and Marketing systems increased by 40% in the last hour',
    confidence: 0.89,
    affectedSystems: ['crm-1', 'marketing-1'],
    timestamp: '2024-01-15T10:15:00Z',
    actionable: true,
    actions: ['Investigate data flow', 'Check for system issues', 'Review recent deployments']
  },
  {
    id: 'insight-2',
    type: 'optimization',
    title: 'Performance Optimization Opportunity',
    description: 'HR system can be optimized by implementing connection pooling',
    confidence: 0.92,
    affectedSystems: ['hr-1'],
    timestamp: '2024-01-15T09:30:00Z',
    actionable: true,
    actions: ['Implement connection pooling', 'Update database configuration', 'Monitor performance']
  },
  {
    id: 'insight-3',
    type: 'prediction',
    title: 'Potential System Failure Prediction',
    description: 'Operations system showing signs of impending failure within 24-48 hours',
    confidence: 0.76,
    affectedSystems: ['operations-1'],
    timestamp: '2024-01-15T08:45:00Z',
    actionable: true,
    actions: ['Schedule preventive maintenance', 'Backup critical data', 'Prepare failover systems']
  }
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'event-1',
    systemId: 'operations-1',
    type: 'incident',
    title: 'Critical System Failure',
    description: 'Supply chain system experiencing critical performance issues',
    timestamp: '2024-01-15T09:30:00Z',
    duration: 120,
    impact: 'high'
  },
  {
    id: 'event-2',
    systemId: 'crm-1',
    type: 'deployment',
    title: 'CRM Platform Update v3.2.1',
    description: 'Deployed new version with enhanced analytics features',
    timestamp: '2024-01-14T02:00:00Z',
    duration: 45,
    impact: 'low'
  },
  {
    id: 'event-3',
    systemId: 'hr-1',
    type: 'maintenance',
    title: 'Scheduled Database Maintenance',
    description: 'Routine database optimization and cleanup',
    timestamp: '2024-01-13T23:00:00Z',
    duration: 180,
    impact: 'medium'
  }
];

export const mockNetworkAnalysis: NetworkAnalysis = {
  centrality: {
    'erp-1': 0.85,
    'crm-1': 0.92,
    'finance-1': 0.78,
    'hr-1': 0.45,
    'marketing-1': 0.67,
    'operations-1': 0.38
  },
  clusters: [
    {
      id: 'cluster-1',
      systems: ['erp-1', 'finance-1', 'operations-1'],
      name: 'Core Business Systems'
    },
    {
      id: 'cluster-2',
      systems: ['crm-1', 'marketing-1'],
      name: 'Customer-Facing Systems'
    },
    {
      id: 'cluster-3',
      systems: ['hr-1'],
      name: 'Support Systems'
    }
  ],
  criticalPaths: [
    {
      path: ['crm-1', 'marketing-1', 'finance-1'],
      importance: 0.95
    },
    {
      path: ['operations-1', 'erp-1', 'finance-1'],
      importance: 0.88
    }
  ],
  bottlenecks: ['hr-1', 'operations-1']
};

export const mockDataLineage: DataLineage[] = [
  {
    source: 'crm-1',
    target: 'finance-1',
    transformations: [
      {
        type: 'aggregation',
        description: 'Sum deal values by month',
        timestamp: '2024-01-15T10:00:00Z'
      },
      {
        type: 'validation',
        description: 'Validate deal status and amounts',
        timestamp: '2024-01-15T10:00:00Z'
      }
    ],
    dataQuality: {
      completeness: 98.5,
      accuracy: 99.2,
      consistency: 97.8
    }
  }
];

export const mockSavedViews: SavedView[] = [
  {
    id: 'view-1',
    name: 'Critical Systems Overview',
    description: 'View of all critical business systems',
    filters: {
      systems: ['erp', 'crm', 'finance'],
      status: ['healthy', 'warning']
    },
    layout: {
      nodes: [
        { id: 'erp-1', position: { x: 100, y: 100 } },
        { id: 'crm-1', position: { x: 300, y: 100 } },
        { id: 'finance-1', position: { x: 200, y: 300 } }
      ]
    },
    createdAt: '2024-01-10T14:30:00Z',
    createdBy: 'admin',
    isPublic: true
  }
];

export const mockCollaborationSessions: CollaborationSession[] = [
  {
    id: 'session-1',
    name: 'System Architecture Review',
    participants: [
      { id: 'user-1', name: 'John Smith', role: 'admin' },
      { id: 'user-2', name: 'Sarah Johnson', role: 'editor' },
      { id: 'user-3', name: 'Mike Chen', role: 'viewer' }
    ],
    annotations: [],
    sharedViews: [],
    createdAt: '2024-01-15T09:00:00Z',
    expiresAt: '2024-01-16T09:00:00Z'
  }
];
