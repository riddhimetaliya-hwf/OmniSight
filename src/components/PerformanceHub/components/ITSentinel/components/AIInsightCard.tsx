
import React from 'react';
import { AIInsight } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Calendar, ChevronsRight, Lightbulb, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIInsightCardProps {
  insight: AIInsight;
  onViewDetails?: (insight: AIInsight) => void;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, onViewDetails }) => {
  const getCategoryIcon = () => {
    switch (insight.category) {
      case 'anomaly':
        return <Zap className="h-4 w-4 text-amber-500" />;
      case 'trend':
        return <Search className="h-4 w-4 text-blue-500" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-green-500" />;
      default:
        return <Bot className="h-4 w-4 text-purple-500" />;
    }
  };

  const getSeverityBadge = () => {
    switch (insight.severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge variant="default">Warning</Badge>;
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            {getCategoryIcon()}
            <h3 className="font-medium">{insight.title}</h3>
          </div>
          <div>
            {getSeverityBadge()}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">{insight.description}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(insight.timestamp).toLocaleString()}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8"
            onClick={() => onViewDetails?.(insight)}
          >
            View Details
            <ChevronsRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;

