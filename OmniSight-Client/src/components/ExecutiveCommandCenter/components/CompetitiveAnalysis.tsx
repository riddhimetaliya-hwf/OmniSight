
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Zap,
  Shield,
  Target
} from 'lucide-react';

type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO';

interface CompetitorCardProps {
  name: string;
  description: string;
  marketShare: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  strengths: string[];
  weaknesses: string[];
  threats: string[];
}

const CompetitorCard: React.FC<CompetitorCardProps> = ({
  name,
  description,
  marketShare,
  trend,
  change,
  strengths,
  weaknesses,
  threats
}) => {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge
            variant={trend === 'up' ? 'destructive' : trend === 'down' ? 'default' : 'outline'}
            className="flex items-center gap-1"
          >
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : trend === 'down' ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <BarChart3 className="h-3 w-3" />
            )}
            {change}
          </Badge>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Market Share</span>
            <span className="font-semibold">{marketShare}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${marketShare * 2}%` }} 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <div className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400 mb-1">
              <Zap className="h-4 w-4" />
              <span>Strengths</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-300">
              {strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400 mb-1">
              <Shield className="h-4 w-4" />
              <span>Weaknesses</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-300">
              {weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400 mb-1">
              <Target className="h-4 w-4" />
              <span>Threats to Us</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-300">
              {threats.map((threat, index) => (
                <li key={index}>{threat}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CompetitiveAnalysisProps {
  role: ExecutiveRole;
}

const CompetitiveAnalysis: React.FC<CompetitiveAnalysisProps> = ({ role }) => {
  // Base competitors data, slightly modified based on role
  const baseCompetitors = [
    {
      name: 'TechGiant Inc.',
      description: 'Global technology leader with diverse product portfolio',
      marketShare: 28,
      trend: 'up' as const,
      change: '+2.5%',
      strengths: [
        'Extensive market reach and brand recognition',
        'Diverse product portfolio with strong cross-selling',
        'Superior financial resources for R&D'
      ],
      weaknesses: [
        'Slow innovation cycle due to organizational size',
        'Fragmented customer experience across products',
        'High cost structure'
      ],
      threats: [
        'Aggressive expansion into our core markets',
        'Price undercutting on key product lines',
        'Potential talent poaching from our teams'
      ]
    },
    {
      name: 'InnovateTech',
      description: 'Fast-moving innovator focused on emerging technologies',
      marketShare: 14,
      trend: 'up' as const,
      change: '+4.2%',
      strengths: [
        'Cutting-edge technology with rapid innovation cycles',
        'Strong appeal to early adopters and tech enthusiasts',
        'Agile development methodology and quick product iterations'
      ],
      weaknesses: [
        'Limited enterprise support capabilities',
        'Smaller market penetration in traditional sectors',
        'Less mature processes and governance'
      ],
      threats: [
        'Introducing features faster than our development cycle',
        'Setting new customer expectations for product capabilities',
        'Attracting venture capital funding for rapid scaling'
      ]
    },
    {
      name: 'LegacySystems Corp',
      description: 'Established player with deep industry relationships',
      marketShare: 22,
      trend: 'down' as const,
      change: '-1.8%',
      strengths: [
        'Entrenched customer base with high switching costs',
        'Strong customer relationships and industry reputation',
        'Comprehensive solution portfolio with integrated offerings'
      ],
      weaknesses: [
        'Aging technology infrastructure',
        'Slow adaptation to market changes',
        'High overhead costs affecting pricing flexibility'
      ],
      threats: [
        'Bundling competitive products with their existing solutions',
        'Leveraging long-term contracts to block our sales efforts',
        'Spreading FUD (fear, uncertainty, doubt) about newer solutions'
      ]
    }
  ];
  
  // Role-specific modifications
  const getCompetitorsForRole = () => {
    switch (role) {
      case 'CFO':
        return baseCompetitors.map(comp => ({
          ...comp,
          strengths: comp.name === 'LegacySystems Corp' ? [
            'Lower cost structure due to amortized technology',
            'Predictable revenue streams from maintenance contracts',
            'Strong cash reserves for market disruption tactics'
          ] : comp.strengths,
          weaknesses: comp.name === 'InnovateTech' ? [
            'Cash burn rate exceeding revenue growth',
            'Significant customer acquisition costs',
            'Limited profitability despite growth'
          ] : comp.weaknesses
        }));
      case 'CTO':
        return baseCompetitors.map(comp => ({
          ...comp,
          strengths: comp.name === 'InnovateTech' ? [
            'Microservices architecture enabling rapid feature deployment',
            'Advanced AI/ML capabilities integrated across solutions',
            'Cloud-native infrastructure with superior scalability'
          ] : comp.strengths,
          weaknesses: comp.name === 'LegacySystems Corp' ? [
            'Technical debt from legacy monolithic architecture',
            'Reliance on outdated technology frameworks',
            'Limited cloud capabilities and modern API support'
          ] : comp.weaknesses
        }));
      case 'CMO':
        return baseCompetitors.map(comp => ({
          ...comp,
          strengths: comp.name === 'TechGiant Inc.' ? [
            'Massive marketing budget and media presence',
            'Strong brand recognition driving customer preference',
            'Sophisticated customer data platform for personalization'
          ] : comp.strengths,
          weaknesses: comp.name === 'LegacySystems Corp' ? [
            'Outdated brand perception among younger demographics',
            'Limited digital marketing capabilities',
            'Poor customer experience ratings on review sites'
          ] : comp.weaknesses
        }));
      case 'COO':
        return baseCompetitors.map(comp => ({
          ...comp,
          strengths: comp.name === 'LegacySystems Corp' ? [
            'Optimized supply chain with long-term favorable contracts',
            'Sophisticated logistics network with global reach',
            'Lower production costs through economies of scale'
          ] : comp.strengths,
          weaknesses: comp.name === 'InnovateTech' ? [
            'Unpredictable production capacity affecting deliveries',
            'Limited supplier relationships causing component shortages',
            'Quality control challenges with rapid product iterations'
          ] : comp.weaknesses
        }));
      default:
        return baseCompetitors;
    }
  };

  const competitors = getCompetitorsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {competitors.map((competitor, index) => (
        <CompetitorCard key={index} {...competitor} />
      ))}
    </div>
  );
};

export default CompetitiveAnalysis;
