
import { RoleConfiguration, ExecutiveKPI, ExecutiveInsight, ExecutiveAlert } from '@/types/executive-roles';

// CEO Data
const ceoKPIs: ExecutiveKPI[] = [
  {
    id: 'market-share',
    title: 'Market Share',
    value: '23.4%',
    change: '+2.1%',
    trend: 'up',
    priority: 'high',
    category: 'Strategic',
    description: 'Company market share in primary segments',
    target: '25%'
  },
  {
    id: 'brand-value',
    title: 'Brand Value',
    value: '$2.8B',
    change: '+12%',
    trend: 'up',
    priority: 'high',
    category: 'Strategic',
    description: 'Estimated brand valuation'
  },
  {
    id: 'competitive-position',
    title: 'Competitive Index',
    value: 8.7,
    change: '+0.3',
    trend: 'up',
    priority: 'medium',
    category: 'Strategic',
    description: 'Overall competitive positioning score',
    unit: '/10'
  },
  {
    id: 'stakeholder-sentiment',
    title: 'Stakeholder Sentiment',
    value: '84%',
    change: '+5%',
    trend: 'up',
    priority: 'high',
    category: 'Governance',
    description: 'Combined investor and board sentiment score'
  }
];

const ceoInsights: ExecutiveInsight[] = [
  {
    id: 'ma-opportunity',
    title: 'Strategic Acquisition Opportunity',
    description: 'TechCorp Inc. shows strong alignment with our digital transformation goals. Market cap $450M, 23% revenue growth YoY.',
    type: 'strategic',
    priority: 'critical',
    actionable: true,
    recommendation: 'Schedule due diligence meeting with investment committee',
    impact: 'high',
    timestamp: new Date()
  },
  {
    id: 'market-expansion',
    title: 'Southeast Asia Market Entry',
    description: 'Market analysis indicates 340% ROI potential over 3 years with $50M initial investment.',
    type: 'opportunity',
    priority: 'important',
    actionable: true,
    impact: 'high',
    timestamp: new Date()
  }
];

// CFO Data
const cfoKPIs: ExecutiveKPI[] = [
  {
    id: 'cash-flow',
    title: 'Free Cash Flow',
    value: '$47.2M',
    change: '+18%',
    trend: 'up',
    priority: 'high',
    category: 'Financial',
    description: 'Quarterly free cash flow generation'
  },
  {
    id: 'budget-variance',
    title: 'Budget Variance',
    value: '-2.1%',
    change: 'Improved',
    trend: 'up',
    priority: 'medium',
    category: 'Financial',
    description: 'YTD budget vs actual variance'
  },
  {
    id: 'credit-exposure',
    title: 'Credit Exposure',
    value: '$12.4M',
    change: '-8%',
    trend: 'up',
    priority: 'high',
    category: 'Risk',
    description: 'Total credit risk exposure'
  },
  {
    id: 'roi-tracking',
    title: 'Portfolio ROI',
    value: '24.7%',
    change: '+3.2%',
    trend: 'up',
    priority: 'high',
    category: 'Investment',
    description: 'Weighted average return on investments'
  }
];

// COO Data
const cooKPIs: ExecutiveKPI[] = [
  {
    id: 'process-efficiency',
    title: 'Process Efficiency',
    value: '92.4%',
    change: '+4.1%',
    trend: 'up',
    priority: 'high',
    category: 'Operations',
    description: 'Overall operational process efficiency score'
  },
  {
    id: 'supply-chain-health',
    title: 'Supply Chain Score',
    value: '87%',
    change: '+2%',
    trend: 'up',
    priority: 'high',
    category: 'Operations',
    description: 'Supply chain resilience and performance index'
  },
  {
    id: 'capacity-utilization',
    title: 'Capacity Utilization',
    value: '89.2%',
    change: '+5.3%',
    trend: 'up',
    priority: 'medium',
    category: 'Resources',
    description: 'Production and resource capacity utilization'
  },
  {
    id: 'vendor-performance',
    title: 'Vendor Performance',
    value: '91.5%',
    change: '+1.8%',
    trend: 'up',
    priority: 'medium',
    category: 'Vendors',
    description: 'Average vendor performance score'
  }
];

// CTO Data
const ctoKPIs: ExecutiveKPI[] = [
  {
    id: 'system-uptime',
    title: 'System Uptime',
    value: '99.97%',
    change: '+0.02%',
    trend: 'up',
    priority: 'high',
    category: 'Technology',
    description: 'Overall system availability and uptime'
  },
  {
    id: 'security-posture',
    title: 'Security Score',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up',
    priority: 'high',
    category: 'Security',
    description: 'Comprehensive cybersecurity posture score'
  },
  {
    id: 'tech-debt',
    title: 'Technical Debt',
    value: '$2.1M',
    change: '-12%',
    trend: 'up',
    priority: 'high',
    category: 'Technology',
    description: 'Estimated technical debt value'
  },
  {
    id: 'innovation-pipeline',
    title: 'Innovation Index',
    value: '8.4',
    change: '+0.6',
    trend: 'up',
    priority: 'high',
    category: 'Innovation',
    description: 'R&D and innovation pipeline strength',
    unit: '/10'
  }
];

// CMO Data
const cmoKPIs: ExecutiveKPI[] = [
  {
    id: 'brand-awareness',
    title: 'Brand Awareness',
    value: '67%',
    change: '+8%',
    trend: 'up',
    priority: 'high',
    category: 'Brand',
    description: 'Unaided brand awareness in target markets'
  },
  {
    id: 'customer-sentiment',
    title: 'Customer Sentiment',
    value: '4.2',
    change: '+0.3',
    trend: 'up',
    priority: 'high',
    category: 'Brand',
    description: 'Average customer sentiment score',
    unit: '/5'
  },
  {
    id: 'marketing-roi',
    title: 'Marketing ROI',
    value: '340%',
    change: '+45%',
    trend: 'up',
    priority: 'high',
    category: 'Performance',
    description: 'Return on marketing investment'
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    value: '3.8%',
    change: '+0.4%',
    trend: 'up',
    priority: 'medium',
    category: 'Performance',
    description: 'Overall marketing-to-sales conversion rate'
  }
];

export const roleConfigurations: Record<string, RoleConfiguration> = {
  CEO: {
    role: 'CEO',
    displayName: 'Chief Executive Officer',
    description: 'Strategic oversight and stakeholder management',
    primaryColor: '#6366f1',
    icon: 'TrendingUp',
    kpis: ceoKPIs,
    insights: ceoInsights,
    alerts: [],
    focusAreas: ['Strategic Planning', 'Stakeholder Relations', 'Market Position', 'Board Governance']
  },
  CFO: {
    role: 'CFO',
    displayName: 'Chief Financial Officer',
    description: 'Financial performance and risk management',
    primaryColor: '#059669',
    icon: 'DollarSign',
    kpis: cfoKPIs,
    insights: [],
    alerts: [],
    focusAreas: ['Financial Planning', 'Risk Management', 'Investment Strategy', 'Compliance']
  },
  COO: {
    role: 'COO',
    displayName: 'Chief Operating Officer',
    description: 'Operational excellence and efficiency',
    primaryColor: '#dc2626',
    icon: 'BarChart3',
    kpis: cooKPIs,
    insights: [],
    alerts: [],
    focusAreas: ['Process Optimization', 'Supply Chain', 'Resource Management', 'Vendor Relations']
  },
  CTO: {
    role: 'CTO',
    displayName: 'Chief Technology Officer',
    description: 'Technology strategy and innovation',
    primaryColor: '#7c3aed',
    icon: 'Monitor',
    kpis: ctoKPIs,
    insights: [],
    alerts: [],
    focusAreas: ['Technology Infrastructure', 'Innovation Pipeline', 'Digital Transformation', 'Cybersecurity']
  },
  CMO: {
    role: 'CMO',
    displayName: 'Chief Marketing Officer',
    description: 'Brand management and customer acquisition',
    primaryColor: '#ea580c',
    icon: 'Megaphone',
    kpis: cmoKPIs,
    insights: [],
    alerts: [],
    focusAreas: ['Brand Strategy', 'Customer Experience', 'Market Analysis', 'Campaign Performance']
  }
};
