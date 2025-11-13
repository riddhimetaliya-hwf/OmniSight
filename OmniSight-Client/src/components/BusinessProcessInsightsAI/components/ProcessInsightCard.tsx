
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProcessInsight } from '../types';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Lightbulb, 
  Share, 
  Bookmark,
  TrendingDown,
  TrendingUp,
  Pin,
  MessageSquare
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

interface ProcessInsightCardProps {
  insight: ProcessInsight;
}

export const ProcessInsightCard: React.FC<ProcessInsightCardProps> = ({ insight }) => {
  const [expanded, setExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(insight.isPinned);

  const getTypeIcon = () => {
    switch (insight.type) {
      case 'explanation':
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'recommendation':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'trend':
        return insight.trend === 'up' ? 
          <TrendingUp className="h-4 w-4 text-green-500" /> : 
          <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    // In a real implementation, this would persist the pin status
  };

  return (
    <Card className={`transition-all ${isPinned ? 'border-l-4 border-l-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <h3 className="font-semibold">{insight.title}</h3>
          </div>
          <Badge variant="outline" className={
            insight.importance === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
            insight.importance === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          }>
            {insight.importance === 'high' ? 'High Impact' : 
             insight.importance === 'medium' ? 'Medium Impact' : 'Low Impact'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{insight.description}</p>
        
        {expanded && (
          <div className="mt-4 space-y-4">
            {insight.analysis && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Detailed Analysis</h4>
                <p className="text-sm text-muted-foreground">{insight.analysis}</p>
              </div>
            )}
            
            {insight.recommendations && insight.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {insight.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Related Metrics</h4>
                <div className="flex flex-wrap gap-2">
                  {insight.relatedMetrics.map((metric, index) => (
                    <Badge key={index} variant="secondary">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs px-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              <span>More</span>
            </>
          )}
        </Button>
        
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(insight.timestamp))} ago</span>
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={togglePin}>
            <Pin className={`h-4 w-4 ${isPinned ? 'text-primary' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
