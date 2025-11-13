
export type AutomationFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'event-based';

export type AutomationStatus = 'active' | 'paused' | 'draft' | 'error';

export type AutomationTriggerType = 'schedule' | 'event' | 'condition';

export type AutomationCategory = 'reports' | 'notifications' | 'data' | 'workflows' | 'other';

export interface AutomationAction {
  id: string;
  type: string;
  params: Record<string, any>;
  description: string;
}

export interface AutomationTrigger {
  id: string;
  type: AutomationTriggerType;
  config: {
    frequency?: AutomationFrequency;
    time?: string;
    days?: string[];
    event?: string;
    condition?: string;
  };
  description: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  category: AutomationCategory;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  status: AutomationStatus;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  nextRun?: string;
  createdBy: string;
  isSystem: boolean;
  suggestedBy?: 'ai' | 'user';
}

export interface AutomationLog {
  id: string;
  automationId: string;
  automationName: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
}

export interface AutomationFilterState {
  status: AutomationStatus[];
  categories: AutomationCategory[];
  search: string;
}
