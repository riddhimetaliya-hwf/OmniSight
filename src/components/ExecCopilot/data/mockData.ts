
import { CopilotInsight, CopilotRecommendation } from '../types';

export const mockInsights: CopilotInsight[] = [
  {
    id: 'insight-1',
    title: 'Q2 Sales Target Exceeded by 15%',
    description: 'The sales team has exceeded their quarterly target by 15%, primarily driven by the new product line launched in April.',
    type: 'win',
    importance: 'high',
    source: 'crm',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-2',
    title: 'Cash Flow Risk Identified',
    description: 'Projected cash flow for next quarter shows potential shortfall due to delayed payments from two enterprise clients.',
    type: 'risk',
    importance: 'critical',
    source: 'finance',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-3',
    title: 'Competitor Price Cut Detected',
    description: 'Main competitor has reduced prices by 12% on their enterprise offering effective next month.',
    type: 'anomaly',
    importance: 'high',
    source: 'market-intel',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-4',
    title: 'High Employee Turnover in Engineering',
    description: 'Engineering department seeing 22% turnover rate in Q2, significantly above company average of 8%.',
    type: 'risk',
    importance: 'medium',
    source: 'hr',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'insight-5',
    title: 'Supply Chain Optimization Success',
    description: 'Recent supply chain optimization has reduced delivery times by 31% and decreased costs by 14%.',
    type: 'win',
    importance: 'medium',
    source: 'operations',
    timestamp: new Date().toISOString(),
  }
];

export const mockRecommendations: CopilotRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Reallocate Marketing Budget',
    description: 'Consider shifting 30% of print marketing budget to digital channels based on recent campaign performance data.',
    impact: 'high',
    source: 'finance',
    actionable: true,
  },
  {
    id: 'rec-2',
    title: 'Implement Exit Interviews',
    description: 'Formalize exit interview process in engineering team to identify retention opportunities.',
    impact: 'medium',
    source: 'hr',
    actionable: true,
  },
  {
    id: 'rec-3',
    title: 'Accelerate Enterprise Client Payments',
    description: 'Offer 2% discount for early payment to address projected cash flow constraints.',
    impact: 'high',
    source: 'finance',
    actionable: true,
  },
  {
    id: 'rec-4',
    title: 'Prepare Competitive Response',
    description: 'Develop response strategy to competitor price changes before their effective date.',
    impact: 'critical',
    source: 'market-intel',
    actionable: true,
  }
];
