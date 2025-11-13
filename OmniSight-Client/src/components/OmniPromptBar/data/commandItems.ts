
import { CommandItem } from '../types';

export const commandItems: CommandItem[] = [
  // Navigation Commands
  {
    id: 'nav-insights',
    name: 'Show Insights',
    description: 'View business insights and analytics',
    type: 'navigation',
    action: '/insights-engine',
    keywords: ['insights', 'analytics', 'data', 'intelligence'],
    category: 'navigation',
    icon: 'lightbulb'
  },
  {
    id: 'nav-kpi',
    name: 'KPI Tracker',
    description: 'Monitor key performance indicators',
    type: 'navigation',
    action: '/kpi-tracker',
    keywords: ['kpi', 'metrics', 'performance', 'tracking'],
    category: 'navigation',
    icon: 'bar-chart'
  },
  {
    id: 'nav-alerts',
    name: 'Alert Manager',
    description: 'Manage system alerts and notifications',
    type: 'navigation',
    action: '/alert-manager',
    keywords: ['alerts', 'notifications', 'warnings', 'issues'],
    category: 'navigation',
    icon: 'alert-circle'
  },
  {
    id: 'nav-reports',
    name: 'Generate Reports',
    description: 'Create and manage business reports',
    type: 'navigation',
    action: '/reports',
    keywords: ['reports', 'documents', 'export', 'pdf'],
    category: 'navigation',
    icon: 'file-text'
  },
  {
    id: 'nav-workflows',
    name: 'Workflow Studio',
    description: 'Design and manage business workflows',
    type: 'navigation',
    action: '/workflow-studio',
    keywords: ['workflow', 'automation', 'process', 'design'],
    category: 'navigation',
    icon: 'workflow'
  },
  {
    id: 'nav-command',
    name: 'Command Center',
    description: 'Executive command and control center',
    type: 'navigation',
    action: '/command-center',
    keywords: ['command', 'executive', 'control', 'overview'],
    category: 'navigation',
    icon: 'command'
  },
  {
    id: 'nav-omni-command',
    name: 'Omni Command',
    description: 'Unified command interface',
    type: 'navigation',
    action: '/omni-command',
    keywords: ['omni', 'unified', 'dashboard', 'command'],
    category: 'navigation',
    icon: 'grid'
  },
  {
    id: 'nav-voice-dashboard',
    name: 'Voice Dashboard',
    description: 'Voice-controlled dashboard interface',
    type: 'navigation',
    action: '/voice-dashboard',
    keywords: ['voice', 'dashboard', 'speech', 'control'],
    category: 'navigation',
    icon: 'mic'
  },

  // AI Query Commands
  {
    id: 'ai-revenue',
    name: 'What is our current revenue?',
    description: 'Get current revenue information',
    type: 'ai-query',
    action: () => console.log('Querying revenue data...'),
    keywords: ['revenue', 'income', 'sales', 'money'],
    category: 'ai-query',
    icon: 'dollar-sign'
  },
  {
    id: 'ai-performance',
    name: 'Show performance metrics',
    description: 'Display key performance indicators',
    type: 'ai-query',
    action: () => console.log('Fetching performance metrics...'),
    keywords: ['performance', 'metrics', 'kpi', 'stats'],
    category: 'ai-query',
    icon: 'trending-up'
  },
  {
    id: 'ai-alerts',
    name: 'Any critical alerts?',
    description: 'Check for critical system alerts',
    type: 'ai-query',
    action: () => console.log('Checking critical alerts...'),
    keywords: ['alerts', 'critical', 'urgent', 'issues'],
    category: 'ai-query',
    icon: 'alert-triangle'
  },

  // Function Commands
  {
    id: 'func-export',
    name: 'Export current view',
    description: 'Export the current dashboard view',
    type: 'function',
    action: () => {
      console.log('Exporting current view...');
      // Export functionality would go here
    },
    keywords: ['export', 'download', 'save', 'pdf'],
    category: 'function',
    icon: 'download'
  },
  {
    id: 'func-refresh',
    name: 'Refresh data',
    description: 'Refresh all dashboard data',
    type: 'function',
    action: () => {
      console.log('Refreshing data...');
      window.location.reload();
    },
    keywords: ['refresh', 'reload', 'update', 'sync'],
    category: 'function',
    icon: 'refresh-cw'
  }
];
