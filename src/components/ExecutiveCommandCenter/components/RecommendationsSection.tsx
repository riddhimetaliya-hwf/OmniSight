
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Users,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ExecutiveRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO';
type RecommendationType = 'strategic' | 'operational' | 'financial' | 'technology' | 'people';
type RecommendationStatus = 'pending' | 'approved' | 'rejected' | 'in_progress';
type ImpactLevel = 'high' | 'medium' | 'low';

interface RecommendationCardProps {
  title: string;
  description: string;
  type: RecommendationType;
  impact: ImpactLevel;
  status: RecommendationStatus;
  icon?: React.ReactNode;
}

interface RecommendationItem {
  title: string;
  description: string;
  type: RecommendationType;
  impact: ImpactLevel;
  status: RecommendationStatus;
  icon?: React.ReactNode;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  title, 
  description, 
  type, 
  impact, 
  status,
  icon
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'strategic':
        return icon || <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'operational':
        return icon || <BarChart className="h-5 w-5 text-blue-500" />;
      case 'financial':
        return icon || <DollarSign className="h-5 w-5 text-green-500" />;
      case 'technology':
        return icon || <ShieldCheck className="h-5 w-5 text-cyan-500" />;
      case 'people':
        return icon || <Users className="h-5 w-5 text-amber-500" />;
      default:
        return icon || <ClipboardList className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Approved</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs">
            <XCircle className="h-3.5 w-3.5" />
            <span>Rejected</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>In Progress</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>Pending</span>
          </div>
        );
    }
  };

  const getImpactStyles = () => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
      case 'low':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full flex-shrink-0 mt-1">
            {getTypeIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-base">{title}</h3>
              {getStatusBadge()}
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{description}</p>
            
            <div className="flex justify-between items-center">
              <div className={`text-xs px-2 py-1 rounded-full ${getImpactStyles()}`}>
                {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
              </div>
              
              <div className="flex gap-2">
                {status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline" className="text-xs h-7">Decline</Button>
                    <Button size="sm" className="text-xs h-7">Approve</Button>
                  </>
                )}
                
                {status === 'approved' && !['rejected', 'in_progress'].includes(status) && (
                  <Button size="sm" className="text-xs h-7">Implement</Button>
                )}
                
                {status === 'in_progress' && (
                  <Button size="sm" variant="outline" className="text-xs h-7">View Progress</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecommendationsSectionProps {
  role: ExecutiveRole;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ role }) => {
  // Role-specific recommendations
  const recommendationsByRole: Record<ExecutiveRole, RecommendationItem[]> = {
    'CEO': [
      {
        title: 'Expand to APAC Markets',
        description: 'Market analysis indicates strong growth potential in Singapore, Australia and Japan with expected ROI of 24% over 3 years.',
        type: 'strategic' as RecommendationType,
        impact: 'high' as ImpactLevel,
        status: 'pending' as RecommendationStatus,
        icon: <TrendingUp className="h-5 w-5 text-purple-500" />
      },
      {
        title: 'Restructure Sales Organization',
        description: 'Implement industry-focused sales teams to better address vertical-specific customer needs and improve solution selling.',
        type: 'operational' as RecommendationType,
        impact: 'medium' as ImpactLevel,
        status: 'approved' as RecommendationStatus,
        icon: <Users className="h-5 w-5 text-blue-500" />
      },
      {
        title: 'Strategic Acquisition Target',
        description: 'TechInnovate Inc. available at 2.5x revenue multiple, would add complementary product capabilities and 15% market share.',
        type: 'strategic' as RecommendationType,
        impact: 'high' as ImpactLevel,
        status: 'in_progress' as RecommendationStatus,
        icon: <BarChart className="h-5 w-5 text-green-500" />
      }
    ],
    'CFO': [
      {
        title: 'Refinance Long-term Debt',
        description: 'Current market conditions enable refinancing at 2.2% lower rate, saving approximately $340K annually in interest expenses.',
        type: 'financial' as RecommendationType,
        impact: 'medium' as ImpactLevel,
        status: 'pending' as RecommendationStatus,
        icon: <DollarSign className="h-5 w-5 text-green-500" />
      },
      {
        title: 'Implement Zero-Based Budgeting',
        description: 'Transition from incremental to zero-based budgeting to improve cost discipline and resource allocation.',
        type: 'operational' as RecommendationType,
        impact: 'high' as ImpactLevel,
        status: 'approved' as RecommendationStatus,
        icon: <ClipboardList className="h-5 w-5 text-blue-500" />
      },
      {
        title: 'Accounts Receivable Process Improvement',
        description: 'Introduce automated dunning and early payment incentives to reduce DSO by estimated 8 days.',
        type: 'operational' as RecommendationType,
        impact: 'medium' as ImpactLevel,
        status: 'in_progress' as RecommendationStatus,
        icon: <Clock className="h-5 w-5 text-amber-500" />
      }
    ],
    'COO': [
      {
        title: 'Implement Predictive Maintenance',
        description: 'ML-based predictive maintenance could reduce equipment downtime by 35% and maintenance costs by 20%.',
        type: 'operational' as RecommendationType,
        impact: 'high' as ImpactLevel,
        status: 'pending' as RecommendationStatus,
        icon: <BarChart className="h-5 w-5 text-blue-500" />
      },
      {
        title: 'Consolidate Warehouse Operations',
        description: 'Consolidating 3 regional facilities into 1 strategic location would reduce overhead by $1.2M annually.',
        type: 'operational' as RecommendationType,
        impact: 'medium' as ImpactLevel,
        status: 'approved' as RecommendationStatus,
        icon: <DollarSign className="h-5 w-5 text-green-500" />
      },
      {
        title: 'Supplier Consolidation Program',
        description: 'Reduce supplier base by 40% to increase purchasing leverage and reduce procurement overhead.',
        type: 'operational' as RecommendationType,
        impact: 'medium' as ImpactLevel,
        status: 'in_progress' as RecommendationStatus,
        icon: <Users className="h-5 w-5 text-purple-500" />
      }
    ],
    'CTO': [
      {
        title: 'Migrate to Microservices Architecture',
        description: 'Gradual transition from monolith to microservices would improve scalability and development velocity by estimated 35%.',
        type: 'technology' as RecommendationType,
        impact: 'high' as ImpactLevel,
        status: 'pending' as RecommendationStatus,
        icon: <ShieldCheck className="h-5 w-5 text-cyan-500" />
      },
      {
        title: 'Implement Zero Trust Security Model',
        description: 'Modernize security approach to address increasing remote work and third-party integration security challenges.',
        type: 'technology' as RecommendationType,
        impact: 'high' as ImpactLevel,
        status: 'approved' as RecommendationStatus,
        icon: <ShieldCheck className="h-5 w-5 text-red-500" />
      },
      {
        title: 'Dev Team Reorganization',
        description: 'Transition from project-based teams to product-aligned squads to improve ownership and delivery continuity.',
        type: 'people' as RecommendationType,
        impact: 'medium' as ImpactLevel,
        status: 'in_progress' as RecommendationStatus,
        icon: <Users className="h-5 w-5 text-amber-500" />
      }
    ],
    'CMO': [
      {
        title: 'Launch Customer Advocacy Program',
        description: 'Formalize customer advocacy program to generate case studies, references and user-generated content.',
        type: 'strategic' as RecommendationType,
        impact: 'medium' as ImpactLevel,
        status: 'pending' as RecommendationStatus,
        icon: <Users className="h-5 w-5 text-purple-500" />
      },
      {
        title: 'Implement AI-Powered Personalization',
        description: 'Leverage ML algorithms to deliver personalized content and offers, with expected 28% lift in conversion.',
        type: 'technology' as RecommendationType,
        impact: 'high' as ImpactLevel,
        status: 'approved' as RecommendationStatus,
        icon: <BarChart className="h-5 w-5 text-blue-500" />
      },
      {
        title: 'Marketing Attribution Model Overhaul',
        description: 'Implement multi-touch attribution to better understand channel effectiveness and optimize spend allocation.',
        type: 'operational' as RecommendationType,
        impact: 'medium' as ImpactLevel,
        status: 'in_progress' as RecommendationStatus,
        icon: <DollarSign className="h-5 w-5 text-green-500" />
      }
    ]
  };

  const recommendations = recommendationsByRole[role] || recommendationsByRole['CEO'];

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation, index) => (
        <RecommendationCard
          key={index}
          title={recommendation.title}
          description={recommendation.description}
          type={recommendation.type}
          impact={recommendation.impact}
          status={recommendation.status}
          icon={recommendation.icon}
        />
      ))}
    </div>
  );
};

export default RecommendationsSection;
