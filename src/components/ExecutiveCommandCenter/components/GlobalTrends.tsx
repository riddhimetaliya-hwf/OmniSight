
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO';

interface TrendCardProps {
  title: string;
  description: string;
  relevance: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'near-term' | 'long-term';
  region: string[];
  action?: string;
}

const TrendCard: React.FC<TrendCardProps> = ({
  title,
  description,
  relevance,
  timeframe,
  region,
  action
}) => {
  const getRelevanceBadge = () => {
    switch (relevance) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Impact</Badge>;
      case 'medium':
        return <Badge variant="default" className="text-xs bg-amber-500">Medium Impact</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Low Impact</Badge>;
      default:
        return null;
    }
  };

  const getTimeframeBadge = () => {
    switch (timeframe) {
      case 'immediate':
        return (
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs">
            <Clock className="h-3 w-3" />
            <span>0-6 months</span>
          </div>
        );
      case 'near-term':
        return (
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs">
            <Clock className="h-3 w-3" />
            <span>6-18 months</span>
          </div>
        );
      case 'long-term':
        return (
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs">
            <Clock className="h-3 w-3" />
            <span>18+ months</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {getRelevanceBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-wrap gap-1">
            {region.map((r, index) => (
              <div key={index} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-xs px-2 py-0.5 rounded-full">
                <Globe className="h-3 w-3 text-slate-500" />
                <span>{r}</span>
              </div>
            ))}
          </div>
          {getTimeframeBadge()}
        </div>
        
        {action && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 flex items-center justify-center gap-1"
          >
            <span>{action}</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

interface GlobalTrendsProps {
  role: ExecutiveRole;
}

const GlobalTrends: React.FC<GlobalTrendsProps> = ({ role }) => {
  // Base trends relevant to all executives
  const baseTrends = [
    {
      title: 'Sustainable Business Practices',
      description: 'Growing regulatory pressure and consumer demand for environmental sustainability across global markets.',
      relevance: 'high' as const,
      timeframe: 'near-term' as const,
      region: ['Global', 'EU', 'North America'],
      action: 'Review Sustainability Strategy'
    },
    {
      title: 'Economic Slowdown in Key Markets',
      description: 'Economic indicators suggest slowdown in major economies affecting consumer spending and B2B investments.',
      relevance: 'high' as const,
      timeframe: 'immediate' as const,
      region: ['North America', 'EU', 'APAC'],
      action: 'View Economic Impact Analysis'
    },
    {
      title: 'Remote Work Normalization',
      description: 'Permanent shift to hybrid work models affecting corporate real estate, collaboration tools, and talent acquisition.',
      relevance: 'medium' as const,
      timeframe: 'near-term' as const,
      region: ['Global'],
      action: 'Review Remote Work Strategy'
    }
  ];
  
  // Role-specific trends
  const getTrendsForRole = () => {
    switch (role) {
      case 'CEO':
        return [
          ...baseTrends,
          {
            title: 'Industry Consolidation Wave',
            description: 'Increasing M&A activity with 4 major deals announced in the last quarter as companies seek scale advantages.',
            relevance: 'high' as const,
            timeframe: 'immediate' as const,
            region: ['North America', 'EU'],
            action: 'Review M&A Opportunities'
          },
          {
            title: 'Regulatory Changes in Data Privacy',
            description: 'New regulations similar to GDPR being adopted across multiple regions affecting data strategy and compliance costs.',
            relevance: 'high' as const,
            timeframe: 'near-term' as const,
            region: ['Global', 'APAC', 'South America'],
            action: 'View Compliance Roadmap'
          }
        ];
      case 'CFO':
        return [
          ...baseTrends,
          {
            title: 'Interest Rate Trajectory',
            description: 'Central banks signaling continued rate increases affecting cost of capital and investment strategies.',
            relevance: 'high' as const,
            timeframe: 'immediate' as const,
            region: ['North America', 'EU'],
            action: 'Review Financial Strategy'
          },
          {
            title: 'Tax Regime Changes',
            description: 'Global minimum tax agreement and digital taxation initiatives affecting international tax structures.',
            relevance: 'high' as const,
            timeframe: 'near-term' as const,
            region: ['Global', 'EU', 'APAC'],
            action: 'Review Tax Planning'
          }
        ];
      case 'COO':
        return [
          ...baseTrends,
          {
            title: 'Supply Chain Regionalization',
            description: 'Companies shifting from global to regional supply chains to reduce geopolitical and disruption risks.',
            relevance: 'high' as const,
            timeframe: 'near-term' as const,
            region: ['Global'],
            action: 'Review Supply Chain Strategy'
          },
          {
            title: 'Automation Acceleration',
            description: 'Industries accelerating automation of routine tasks driven by labor shortages and cost pressures.',
            relevance: 'high' as const,
            timeframe: 'near-term' as const,
            region: ['North America', 'EU', 'APAC'],
            action: 'View Automation Opportunities'
          }
        ];
      case 'CTO':
        return [
          ...baseTrends,
          {
            title: 'AI/ML Mainstream Adoption',
            description: 'Artificial intelligence and machine learning moving from experimental to core business applications across industries.',
            relevance: 'high' as const,
            timeframe: 'immediate' as const,
            region: ['Global'],
            action: 'Review AI Strategy'
          },
          {
            title: 'Quantum Computing Progress',
            description: 'Accelerated development in quantum computing with potential disruption to encryption and complex problem solving.',
            relevance: 'medium' as const,
            timeframe: 'long-term' as const,
            region: ['North America', 'EU', 'China'],
            action: 'View Technology Roadmap'
          }
        ];
      case 'CMO':
        return [
          ...baseTrends,
          {
            title: 'Decline of Third-Party Cookies',
            description: 'Major platforms eliminating third-party cookies, disrupting traditional digital advertising and analytics.',
            relevance: 'high' as const,
            timeframe: 'immediate' as const,
            region: ['Global'],
            action: 'Review Marketing Strategy'
          },
          {
            title: 'Metaverse Marketing Emergence',
            description: 'Early adopter brands experimenting with immersive experiences in virtual environments to engage customers.',
            relevance: 'medium' as const,
            timeframe: 'near-term' as const,
            region: ['North America', 'APAC'],
            action: 'Explore Metaverse Opportunities'
          }
        ];
      default:
        return baseTrends;
    }
  };

  const trends = getTrendsForRole();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {trends.map((trend, index) => (
        <TrendCard key={index} {...trend} />
      ))}
    </div>
  );
};

export default GlobalTrends;
