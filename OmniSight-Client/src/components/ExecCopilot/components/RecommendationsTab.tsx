
import React from 'react';
import { useCopilotContext } from '../context/CopilotContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowUpRight } from 'lucide-react';
import { CopilotRecommendation, ImportanceLevel } from '../types';

interface RecommendationsTabProps {
  recommendations: CopilotRecommendation[];
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ recommendations }) => {
  const { activeSource, delegateTask } = useCopilotContext();
  
  const filteredRecommendations = recommendations.filter(rec => 
    activeSource === 'all' || rec.source === activeSource
  );

  const getBadgeForImpact = (impact: ImportanceLevel) => {
    switch (impact) {
      case 'critical':
        return <Badge variant="destructive">Critical Impact</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">High Impact</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">Medium Impact</Badge>;
      case 'low':
        return <Badge variant="outline">Low Impact</Badge>;
      default:
        return <Badge variant="outline">Medium Impact</Badge>;
    }
  };

  if (filteredRecommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">No recommendations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredRecommendations.map(recommendation => (
        <Card key={recommendation.id} className="overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Lightbulb className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium truncate">{recommendation.title}</h4>
                  {getBadgeForImpact(recommendation.impact)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {recommendation.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {recommendation.source.toUpperCase()}
                  </Badge>
                  {recommendation.actionable && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => delegateTask(recommendation.title, 'Team')}
                    >
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Action
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecommendationsTab;
