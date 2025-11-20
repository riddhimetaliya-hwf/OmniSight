// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VIEWER: 'viewer',
} as const;

// Alert types
export const ALERT_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

// KPI trends
export const KPI_TRENDS = {
  UP: 'up',
  DOWN: 'down',
  STABLE: 'stable',
} as const;

// Widget types
export const WIDGET_TYPES = {
  CHART: 'chart',
  METRIC: 'metric',
  TABLE: 'table',
  KPI: 'kpi',
  ALERT: 'alert',
  CUSTOM: 'custom',
} as const;

// Chart types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  AREA: 'area',
  PIE: 'pie',
  SCATTER: 'scatter',
} as const;

// Workflow statuses
export const WORKFLOW_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
} as const;

// Workflow triggers
export const WORKFLOW_TRIGGERS = {
  SCHEDULE: 'schedule',
  EVENT: 'event',
  MANUAL: 'manual',
} as const;

// Data source types
export const DATA_SOURCE_TYPES = {
  DATABASE: 'database',
  API: 'api',
  FILE: 'file',
  STREAM: 'stream',
} as const;

// Notification channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    SIGN_OUT: '/auth/signout',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: '/users',
  DASHBOARDS: '/dashboards',
  WIDGETS: '/widgets',
  KPIS: '/kpis',
  ALERTS: '/alerts',
  WORKFLOWS: '/workflows',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'omnisight-theme',
  USER_PREFERENCES: 'omnisight-user-preferences',
  DASHBOARD_LAYOUT: 'omnisight-dashboard-layout',
  SIDEBAR_COLLAPSED: 'omnisight-sidebar-collapsed',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Time periods
export const TIME_PERIODS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom',
} as const;

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['csv', 'xlsx', 'json', 'txt'],
} as const;

// Validation rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully',
  CREATED: 'Item created successfully',
  UPDATED: 'Item updated successfully',
  DELETED: 'Item deleted successfully',
  PASSWORD_RESET: 'Password reset email sent',
} as const;

// Default values
export const DEFAULTS = {
  DASHBOARD_NAME: 'New Dashboard',
  WIDGET_TITLE: 'New Widget',
  KPI_NAME: 'New KPI',
  WORKFLOW_NAME: 'New Workflow',
} as const; 