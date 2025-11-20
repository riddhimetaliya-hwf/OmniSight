
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  DollarSign,
  Clock,
  Zap,
  PlusCircle,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { CostSavingOpportunity } from '../types';

interface CostSavingOpportunityCardProps {
  opportunity: CostSavingOpportunity;
  onImplement?: (id: string) => void;
}

const CostSavingOpportunityCard: React.FC<CostSavingOpportunityCardProps> = ({ 
  opportunity,
  onImplement = () => {} 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return <Zap className="h-4 w-4" />;
      case 'short-term': return <Clock className="h-4 w-4" />;
      case 'long-term': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{opportunity.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Save ${opportunity.potentialSavings.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className={`${getDifficultyColor(opportunity.difficulty)} border-none`}
          >
            {opportunity.difficulty} implementation
          </Badge>
          
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1"
          >
            {getTimeframeIcon(opportunity.timeframe)}
            {opportunity.timeframe} timeframe
          </Badge>
        </div>
        
        <div className="mb-3">
          <p className="text-xs font-medium mb-1">Impacted Services:</p>
          <div className="flex flex-wrap gap-1">
            {opportunity.impactedServices.map((service, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xs font-medium mb-1">Action Steps:</p>
          <ul className="text-xs space-y-1">
            {opportunity.actionSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs gap-1"
            onClick={() => onImplement(opportunity.id)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Implement
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSavingOpportunityCard;
