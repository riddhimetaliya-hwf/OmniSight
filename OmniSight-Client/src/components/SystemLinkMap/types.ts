export type SystemNodeType = 
  | 'erp' 
  | 'crm' 
  | 'hr' 
  | 'marketing' 
  | 'finance' 
  | 'operations' 
  | 'custom';

export type EdgeType = 
  | 'data-flow' 
  | 'integration' 
  | 'dependency' 
  | 'bidirectional';

export type SystemStatus = 'healthy' | 'warning' | 'error' | 'maintenance' | 'offline';

export type MetricTrend = 'up' | 'down' | 'stable';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ViewMode = '2d' | '3d' | 'timeline' | 'hierarchy' | 'geographic';

export interface SystemNode {
  id: string;
  type: SystemNodeType;
  label: string;
  department?: string;
  description?: string;
  metrics?: SystemMetric[];
  status?: SystemStatus;
  location?: GeographicLocation;
  healthScore?: number;
  lastUpdated?: string;
  owner?: string;
  tags?: string[];
  compliance?: ComplianceInfo;
  performance?: PerformanceMetrics;
  annotations?: Annotation[];
  version?: string;
  dependencies?: string[];
  customFields?: Record<string, unknown>;
}

export interface SystemMetric {
  name: string;
  value: string | number;
  trend?: MetricTrend;
  change?: number;
  unit?: string;
  threshold?: {
    warning: number;
    critical: number;
  };
  historicalData?: Array<{
    timestamp: string;
    value: number;
  }>;
}

export interface SystemEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  animated?: boolean;
  dataPoints?: string[];
  volume?: number;
  frequency?: string;
  health?: number;
  lastSync?: string;
  apiEndpoint?: string;
  dataSchema?: string;
  annotations?: Annotation[];
  performance?: EdgePerformance;
}

export interface SystemMapFilter {
  systems?: SystemNodeType[];
  departments?: string[];
  dataFlows?: EdgeType[];
  status?: SystemStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  healthScore?: {
    min: number;
    max: number;
  };
  tags?: string[];
  owners?: string[];
}

export interface GeographicLocation {
  latitude: number;
  longitude: number;
  address?: string;
  region?: string;
  country?: string;
}

export interface ComplianceInfo {
  standards: string[];
  lastAudit?: string;
  nextAudit?: string;
  complianceScore?: number;
  violations?: ComplianceViolation[];
}

export interface ComplianceViolation {
  id: string;
  description: string;
  severity: AlertSeverity;
  date: string;
  resolved: boolean;
}

export interface PerformanceMetrics {
  uptime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface EdgePerformance {
  latency: number;
  throughput: number;
  errorRate: number;
  lastSyncStatus: 'success' | 'failed' | 'pending';
}

export interface Annotation {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'note' | 'warning' | 'info' | 'action';
  position?: {
    x: number;
    y: number;
  };
}

export interface Alert {
  id: string;
  systemId: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  category: 'performance' | 'security' | 'compliance' | 'maintenance';
}

export interface SystemHealth {
  overallScore: number;
  performanceScore: number;
  securityScore: number;
  complianceScore: number;
  lastAssessment: string;
  recommendations: HealthRecommendation[];
}

export interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  impact: string;
  effort: string;
  category: 'performance' | 'security' | 'compliance' | 'architecture';
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  filters: SystemMapFilter;
  layout: {
    nodes: Array<{
      id: string;
      position: { x: number; y: number };
    }>;
  };
  createdAt: string;
  createdBy: string;
  isPublic: boolean;
}

export interface AIInsight {
  id: string;
  type: 'anomaly' | 'optimization' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  affectedSystems: string[];
  timestamp: string;
  actionable: boolean;
  actions?: string[];
}

export interface TimelineEvent {
  id: string;
  systemId: string;
  type: 'deployment' | 'maintenance' | 'incident' | 'upgrade';
  title: string;
  description: string;
  timestamp: string;
  duration?: number;
  impact: 'low' | 'medium' | 'high';
}

export interface NetworkAnalysis {
  centrality: Record<string, number>;
  clusters: Array<{
    id: string;
    systems: string[];
    name: string;
  }>;
  criticalPaths: Array<{
    path: string[];
    importance: number;
  }>;
  bottlenecks: string[];
}

export interface DataLineage {
  source: string;
  target: string;
  transformations: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
  dataQuality: {
    completeness: number;
    accuracy: number;
    consistency: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  defaultView: ViewMode;
  autoRefresh: boolean;
  refreshInterval: number;
  notifications: {
    alerts: boolean;
    systemUpdates: boolean;
    performanceIssues: boolean;
  };
  layout: {
    showMiniMap: boolean;
    showControls: boolean;
    showBackground: boolean;
  };
}

export interface CollaborationSession {
  id: string;
  name: string;
  participants: Array<{
    id: string;
    name: string;
    role: 'viewer' | 'editor' | 'admin';
  }>;
  annotations: Annotation[];
  sharedViews: SavedView[];
  createdAt: string;
  expiresAt?: string;
}
