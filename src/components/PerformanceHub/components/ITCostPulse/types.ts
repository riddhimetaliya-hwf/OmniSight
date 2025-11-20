
export interface CostItem {
  id: string;
  serviceName: string;
  cost: number;
  budget: number;
  department: string;
  category: 'infrastructure' | 'saas' | 'services' | 'other';
  trend: number;
  startDate: string;
  endDate: string;
  consumptionMetrics?: {
    licenses?: number;
    storage?: number;
    bandwidth?: number;
    computeHours?: number;
    apiCalls?: number;
  };
  history: Array<{ date: string; cost: number }>;
}

export interface Department {
  id: string;
  name: string;
  budget: number;
  actualSpend: number;
  services: string[];
}

export interface CostSavingOpportunity {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  impactedServices: string[];
  actionSteps: string[];
}

export interface BudgetForecast {
  month: string;
  projected: number;
  actual: number;
  variance: number;
}
