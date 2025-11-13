
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Info, 
  TrendingUp, 
  AlertTriangle, 
  BarChart4, 
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ChartInsight } from './types';

interface InsightsListProps {
  insights: ChartInsight[];
  activeInsight: ChartInsight | null;
  onInsightClick: (insight: ChartInsight) => void;
}

const InsightsList: React.FC<InsightsListProps> = ({ 
  insights, 
  activeInsight,
  onInsightClick
}) => {
  const getInsightIcon = (type: ChartInsight['type']) => {
    switch (type) {
      case 'explanation':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'comparison':
        return <BarChart4 className="h-4 w-4 text-green-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'prediction':
        return <Calendar className="h-4 w-4 text-indigo-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  if (insights.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
        <Info className="h-12 w-12 mb-4 opacity-20" />
        <h3 className="font-medium text-lg mb-1">No insights yet</h3>
        <p className="text-sm">
          Click on chart points or ask questions to generate insights
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 pr-3">
        {insights.map(insight => (
          <div
            key={insight.id}
            className={`
              p-3 border rounded-md cursor-pointer transition-colors
              ${activeInsight?.id === insight.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'}
            `}
            onClick={() => onInsightClick(insight)}
          >
            <div className="flex items-center gap-2 mb-1">
              {getInsightIcon(insight.type)}
              <span className="text-sm font-medium line-clamp-1">{insight.title}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
              {insight.description}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(insight.timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default InsightsList;
