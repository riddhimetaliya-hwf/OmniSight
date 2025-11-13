
export interface ProcessMetric {
  id: string;
  name: string;
  status: 'on-track' | 'delayed' | 'at-risk';
  cycleTime: number;
  expectedCycleTime: number;
  satisfactionScore?: number;
  currentStep: string;
  blockers: string[];
  owner: string;
  lastUpdated: string;
  category: 'order-management' | 'talent-onboarding' | 'client-services';
}

export interface ProcessStep {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  startTime?: string;
  endTime?: string;
  owner?: string;
  notes?: string[];
  dependencies?: string[];
}

export interface ProcessDetail {
  id: string;
  name: string;
  steps: ProcessStep[];
  timeline: Array<{date: string; event: string}>;
  metrics: {
    avgCycleTime: number;
    blockerFrequency: {[key: string]: number};
    satisfactionTrend: Array<{date: string; score: number}>;
  };
  predictedCompletion?: string;
  suggestedImprovements: string[];
}

export interface ProcessAlert {
  id: string;
  processId: string;
  type: 'delay' | 'satisfaction-drop' | 'blocker' | 'prediction';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  actionRequired: boolean;
}
