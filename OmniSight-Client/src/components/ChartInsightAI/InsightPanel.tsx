
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  TrendingUp, 
  AlertTriangle, 
  BarChart4, 
  Calendar
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartInsight, ChartDataset } from './types';
import { formatDistanceToNow } from 'date-fns';

interface InsightPanelProps {
  insight: ChartInsight;
  dataset: ChartDataset;
  isLoading?: boolean;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ 
  insight, 
  dataset,
  isLoading = false
}) => {
  const getInsightIcon = () => {
    switch (insight.type) {
      case 'explanation':
        return <Info className="h-5 w-5 mr-2 text-blue-500" />;
      case 'comparison':
        return <BarChart4 className="h-5 w-5 mr-2 text-green-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />;
      case 'prediction':
        return <Calendar className="h-5 w-5 mr-2 text-indigo-500" />;
      default:
        return <Info className="h-5 w-5 mr-2 text-gray-500" />;
    }
  };

  const getInsightTypeColor = () => {
    switch (insight.type) {
      case 'explanation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'comparison': return 'bg-green-100 text-green-800 border-green-200';
      case 'anomaly': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'trend': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'prediction': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-3">
      <div className="space-y-4">
        <div>
          <div className="flex items-center mb-2">
            {getInsightIcon()}
            <h3 className="font-medium">{insight.title}</h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={getInsightTypeColor()}>
              {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
            </Badge>
            
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(insight.timestamp, { addSuffix: true })}
            </span>
            
            {!insight.confident && (
              <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/30">
                Low confidence
              </Badge>
            )}
          </div>
        </div>
        
        <Card className="bg-muted/40 p-4">
          <p className="text-sm leading-relaxed">{insight.description}</p>
        </Card>
        
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Additional context</h4>
          
          {insight.chartPoints && insight.chartPoints.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This insight relates to the following data points:
              </p>
              
              <div className="space-y-1">
                {insight.chartPoints.map(pointId => {
                  const point = dataset.data.find(p => p.id === pointId);
                  if (!point) return null;
                  
                  return (
                    <div key={pointId} className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-sm">
                      <span>{point.label || point.x.toString()}</span>
                      <span className="font-medium">{point.y}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This insight is related to the overall dataset.
            </p>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="w-full">
            Export insight
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Ask followup
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default InsightPanel;
