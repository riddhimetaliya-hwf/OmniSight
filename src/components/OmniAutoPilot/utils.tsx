
import { AutomationStatus, AutomationTriggerType } from './types';
import { Clock, Calendar, Zap, Filter, Mail, Bell, Database, FileText, RefreshCw, Server, Plus } from 'lucide-react';
import React from 'react';

export const automationStatusColors: Record<AutomationStatus, { color: 'default' | 'destructive' | 'secondary' | 'outline', label: string }> = {
  active: { color: 'default', label: 'Active' },
  paused: { color: 'secondary', label: 'Paused' },
  draft: { color: 'outline', label: 'Draft' },
  error: { color: 'destructive', label: 'Error' },
};

export const getTriggerIcon = (type: AutomationTriggerType) => {
  switch (type) {
    case 'schedule':
      return <Calendar className="h-4 w-4" />;
    case 'event':
      return <Zap className="h-4 w-4" />;
    case 'condition':
      return <Filter className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export const getActionIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'notification':
      return <Bell className="h-4 w-4" />;
    case 'data-query':
    case 'data-processing':
    case 'data-check':
      return <Database className="h-4 w-4" />;
    case 'generate-report':
      return <FileText className="h-4 w-4" />;
    case 'workflow':
      return <RefreshCw className="h-4 w-4" />;
    case 'generate-dashboard':
      return <Server className="h-4 w-4" />;
    case 'distribute':
      return <Plus className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};
