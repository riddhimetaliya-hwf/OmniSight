
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Zap,
  ChevronRight,
  Clock
} from 'lucide-react';
import { ExecutiveInsight } from '@/types/executive-roles';

interface ExecutiveInsightsProps {
  insights: ExecutiveInsight[];
  roleColor: string;
}

const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({ insights, roleColor }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strategic':
        return <TrendingUp className="h-5 w-5" />;
      case 'risk':
        return <Shield className="h-5 w-5" />;
      case 'opportunity':
        return <Zap className="h-5 w-5" />;
      case 'operational':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'important':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (insights.length === 0) {
    return (
      <Card className="card-glass">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No insights available at the moment</p>
            <Button variant="outline" size="sm">
              Generate Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="card-glass hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${roleColor}20`, color: roleColor }}
                >
                  {getInsightIcon(insight.type)}
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">{insight.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(insight.priority)} size="sm">
                      {insight.priority}
                    </Badge>
                    <Badge variant="outline" size="sm" className="capitalize">
                      {insight.type}
                    </Badge>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getImpactColor(insight.impact)}`}>
                      {insight.impact} impact
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(insight.timestamp)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
              
              {insight.recommendation && (
                <div className="p-3 rounded-lg bg-muted/50 border-l-4" style={{ borderLeftColor: roleColor }}>
                  <p className="text-sm font-medium mb-1">Recommended Action:</p>
                  <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {insight.actionable && (
                    <Badge variant="success" size="sm">
                      Actionable
                    </Badge>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs gap-1 hover:gap-2 transition-all"
                  style={{ color: roleColor }}
                >
                  View Details
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExecutiveInsights;
