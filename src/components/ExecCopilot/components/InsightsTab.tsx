
import React from 'react';
import { useCopilotContext } from '../context/CopilotContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, TrendingUp, AlertTriangle, CheckCircle, BarChart } from 'lucide-react';
import { CopilotInsight, InsightType, ImportanceLevel } from '../types';

interface InsightsTabProps {
  insights: CopilotInsight[];
}

const InsightsTab: React.FC<InsightsTabProps> = ({ insights }) => {
  const { activeSource, createAlert } = useCopilotContext();
  
  const filteredInsights = insights.filter(insight => 
    activeSource === 'all' || insight.source === activeSource
  );

  const getIconForType = (type: InsightType) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'win':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'anomaly':
        return <TrendingUp className="h-4 w-4 text-amber-500" />;
      case 'summary':
        return <BarChart className="h-4 w-4 text-blue-500" />;
      case 'action':
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <BarChart className="h-4 w-4 text-blue-500" />;
    }
  };

  const getBadgeForImportance = (importance: ImportanceLevel) => {
    switch (importance) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Medium</Badge>;
    }
  };

  if (filteredInsights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">No insights available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredInsights.map(insight => (
        <Card key={insight.id} className="overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIconForType(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium truncate">{insight.title}</h4>
                  {getBadgeForImportance(insight.importance)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <Badge variant="secondary" className="text-xs">
                      {insight.source.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(insight.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {!insight.hasAlert && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => createAlert(insight.id)}
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      Alert
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

export default InsightsTab;
