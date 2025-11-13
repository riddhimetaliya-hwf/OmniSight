export type InsightCategory = 'growth' | 'risk' | 'opportunity' | 'performance' | 'trend';
export type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO';

export interface InsightItem {
  title: string;
  description: string;
  category: InsightCategory;
  date: string;
}

type InsightsByRole = Record<ExecutiveRole, InsightItem[]>;

export const insightsByRole: InsightsByRole = {
  'CEO': [
    {
      title: 'Revenue Growth Accelerating',
      description: 'Quarter-over-quarter revenue growth has increased from 8% to 12%, outpacing industry average by 5 percentage points.',
      category: 'performance',
      date: 'Today'
    },
    {
      title: 'Market Expansion Opportunity',
      description: 'Analysis indicates underserved demand in the APAC region with potential for 18% market share capture within 12 months.',
      category: 'opportunity',
      date: 'Yesterday'
    },
    {
      title: 'Competitor Price Pressure',
      description: 'Main competitor has reduced prices by an average of 7% across their product line, potentially impacting our premium positioning.',
      category: 'risk',
      date: '2 days ago'
    },
    {
      title: 'Digital Transformation Impact',
      description: 'Companies investing over 12% of revenue in digital transformation are seeing 2.5x average growth compared to industry peers.',
      category: 'trend',
      date: '3 days ago'
    }
  ],
  'CFO': [
    {
      title: 'Operating Margin Improvement',
      description: 'Cost optimization initiatives have improved operating margins by 2.3 percentage points this quarter.',
      category: 'performance',
      date: 'Today'
    },
    {
      title: 'Cash Conversion Cycle Opportunity',
      description: 'Reducing DSO by 5 days could free up approximately $2.4M in cash flow based on current revenue volumes.',
      category: 'opportunity',
      date: 'Yesterday'
    },
    {
      title: 'Foreign Exchange Exposure',
      description: 'EUR/USD volatility has increased by 15%, creating potential headwinds for European revenue conversion.',
      category: 'risk',
      date: '2 days ago'
    },
    {
      title: 'Industry Consolidation',
      description: 'M&A activity in our sector has increased 28% YoY, with average valuation multiples expanding from 3.2x to 4.1x revenue.',
      category: 'trend',
      date: '3 days ago'
    }
  ],
  'COO': [
    {
      title: 'Supply Chain Resilience',
      description: 'Diversification of suppliers has reduced single-source dependencies from 28% to 12% of components.',
      category: 'performance',
      date: 'Today'
    },
    {
      title: 'Automation Potential',
      description: 'Process mining identified three workflows with 85%+ automation potential, with estimated annual savings of $340K.',
      category: 'opportunity',
      date: 'Yesterday'
    },
    {
      title: 'Production Quality Variance',
      description: 'East coast facility showing 2.3x higher defect rates than other locations, requiring immediate investigation.',
      category: 'risk',
      date: '2 days ago'
    },
    {
      title: 'Industry Lead Times',
      description: 'Average delivery times across the industry have decreased 18%, setting new customer expectations for fulfillment speed.',
      category: 'trend',
      date: '3 days ago'
    }
  ],
  'CTO': [
    {
      title: 'Technical Debt Reduction',
      description: 'Focused refactoring efforts have reduced critical path technical debt by 22% this quarter.',
      category: 'performance',
      date: 'Today'
    },
    {
      title: 'AI Implementation',
      description: 'Machine learning implementation in customer service could reduce resolution times by 45% based on pilot results.',
      category: 'opportunity',
      date: 'Yesterday'
    },
    {
      title: 'Security Vulnerability',
      description: 'New zero-day vulnerability affecting our authentication framework requires patching within 72 hours.',
      category: 'risk',
      date: '2 days ago'
    },
    {
      title: 'Cloud Migration Trends',
      description: '72% of industry peers have moved mission-critical systems to cloud infrastructure, up from 45% last year.',
      category: 'trend',
      date: '3 days ago'
    }
  ],
  'CMO': [
    {
      title: 'Campaign Performance',
      description: 'Q3 digital campaign achieved 24% higher conversion rates at 12% lower cost-per-acquisition vs. Q2.',
      category: 'performance',
      date: 'Today'
    },
    {
      title: 'Content Engagement',
      description: 'Video content is generating 3.2x more engagement than static content across all platforms.',
      category: 'opportunity',
      date: 'Yesterday'
    },
    {
      title: 'Brand Sentiment Shift',
      description: 'Social listening detected 15% increase in negative sentiment following competitor\'s new feature launch.',
      category: 'risk',
      date: '2 days ago'
    },
    {
      title: 'Marketing Channel Evolution',
      description: 'B2B buyers now consume an average of 7 content pieces before contacting sales, up from 5 last year.',
      category: 'trend',
      date: '3 days ago'
    }
  ]
};
