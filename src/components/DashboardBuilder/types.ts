
export type DashboardType = 'general' | 'sales' | 'finance' | 'hr' | 'operations';

export type WidgetType = 
  | 'lineChart' 
  | 'barChart' 
  | 'pieChart' 
  | 'table' 
  | 'kpi' 
  | 'gauge'
  | 'trendIndicator'
  | 'heatmap';

export type WidgetCategory = 
  | 'performance' 
  | 'sales' 
  | 'finance' 
  | 'hr' 
  | 'operations' 
  | 'uncategorized';

export type WidgetPriority = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetConfig {
  height?: number;
  showDataQuality?: boolean;
  showDataLineage?: boolean;
  showAnnotations?: boolean;
  enableInteractions?: boolean;
  thresholds?: {
    [key: string]: number;
  };
  colors?: string[];
}

export interface DataQuality {
  score: number; // 0-100
  completeness: number; // 0-100
  accuracy: number; // 0-100
  consistency: number; // 0-100
  timeliness: number; // 0-100
}

export interface DataLineage {
  source: string;
  lastUpdated: string;
  owner?: string;
  refreshFrequency?: string;
}

export interface Widget {
  id: string;
  title: string;
  description?: string;
  type: WidgetType;
  category?: WidgetCategory;
  priority?: WidgetPriority;
  size?: WidgetSize;
  config?: WidgetConfig;
  columnSpan?: number; // 1, 2, or 3
  rowSpan?: number; // 1 or 2
  data: any; // Chart data or table data
  favorite?: boolean;
  pinnedToAll?: boolean;
  dataQuality?: DataQuality;
  dataLineage?: DataLineage;
}

export interface DashboardFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  showFavoritesOnly?: boolean;
  searchTerm?: string;
  timeRange?: string;
  startDate?: Date;
  endDate?: Date;
  businessUnit?: string[];
  region?: string[];
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  filters: DashboardFilters;
  layout?: {
    widgetIds: string[];
    widgetPositions: Record<string, { x: number; y: number; w: number; h: number }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  type?: DashboardType;
  widgets: Widget[];
  filters?: DashboardFilters;
  savedViews?: SavedView[];
  favorite?: boolean;
  template?: string;
  createdAt: Date;
  updatedAt: Date;
  sharedWith?: { email: string; accessLevel: string }[];
}

export interface DashboardCreationParams {
  name: string;
  description?: string;
  copyFromId?: string;
  initialWidgets?: Widget[];
}

export interface WidgetSizeOptions {
  small: number;
  medium: number;
  large: number;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'uploaded';
  connectionDetails?: Record<string, any>;
  tables?: string[];
  lastSynced?: Date;
}

export interface SharedUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export type AccessLevel = 'view' | 'edit' | 'admin';

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  type: DashboardType;
  widgets?: Widget[];
}
