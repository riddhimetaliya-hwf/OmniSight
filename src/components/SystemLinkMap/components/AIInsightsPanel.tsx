import React from 'react';
import { AIInsight } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Zap,
  Clock,
  Target,
  CheckCircle
} from 'lucide-react';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  onAction: (insightId: string, action: string) => void;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, onAction }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'optimization':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'prediction':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default:
        return <Brain className="h-4 w-4 text-purple-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'anomaly':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'optimization':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'prediction':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'recommendation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const sortedInsights = [...insights].sort((a, b) => {
    // Sort by confidence (highest first), then by timestamp (newest first)
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center">
          <Brain className="h-4 w-4 mr-2" />
          AI Insights
        </h3>
        <Badge variant="secondary" className="text-xs">
          {insights.length} insights
        </Badge>
      </div>

      {sortedInsights.length > 0 ? (
        <div className="space-y-3">
          {sortedInsights.map((insight) => (
            <Card key={insight.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <CardTitle className="text-sm">{insight.title}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getInsightColor(insight.type)}`}
                    >
                      {insight.type}
                    </Badge>
                    {insight.actionable && (
                      <Zap className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(insight.timestamp)}
                  </span>
                </div>

                {insight.affectedSystems && insight.affectedSystems.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs text-muted-foreground">Affected Systems:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {insight.affectedSystems.map((systemId) => (
                        <Badge key={systemId} variant="outline" className="text-xs">
                          {systemId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {insight.actionable && insight.actions && insight.actions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Recommended Actions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {insight.actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          onClick={() => onAction(insight.id, action)}
                          className="h-6 text-xs"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No AI insights available</p>
          <p className="text-xs text-muted-foreground mt-1">
            AI will generate insights as it analyzes system patterns
          </p>
        </div>
      )}

      {/* Insight Summary */}
      {insights.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="text-xs font-medium mb-2">Insight Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span>Anomalies: {insights.filter(i => i.type === 'anomaly').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>Optimizations: {insights.filter(i => i.type === 'optimization').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3 text-blue-500" />
              <span>Predictions: {insights.filter(i => i.type === 'prediction').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-3 w-3 text-yellow-500" />
              <span>Recommendations: {insights.filter(i => i.type === 'recommendation').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel; 