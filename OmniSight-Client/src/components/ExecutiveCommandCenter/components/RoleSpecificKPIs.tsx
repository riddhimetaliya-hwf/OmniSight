
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Target } from 'lucide-react';
import { ExecutiveKPI } from '@/types/executive-roles';

interface RoleSpecificKPIsProps {
  kpis: ExecutiveKPI[];
  roleColor: string;
}

const RoleSpecificKPIs: React.FC<RoleSpecificKPIsProps> = ({ kpis, roleColor }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'warning',
      low: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'secondary'} size="sm">
        {priority}
      </Badge>
    );
  };

  const getProgressValue = (kpi: ExecutiveKPI) => {
    if (!kpi.target) return undefined;
    
    const value = typeof kpi.value === 'string' 
      ? parseFloat(kpi.value.replace(/[^0-9.-]/g, ''))
      : kpi.value;
    const target = typeof kpi.target === 'string'
      ? parseFloat(kpi.target.replace(/[^0-9.-]/g, ''))
      : kpi.target;
    
    return (value / target) * 100;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpis.map((kpi) => {
        const progressValue = getProgressValue(kpi);
        
        return (
          <Card key={kpi.id} className="card-glass hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Badge variant="outline" size="sm" className="text-xs">
                    {kpi.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(kpi.priority)}
                  {getTrendIcon(kpi.trend)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold" style={{ color: roleColor }}>
                      {kpi.value}{kpi.unit}
                    </span>
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 
                      kpi.trend === 'down' ? 'text-red-600' : 
                      'text-muted-foreground'
                    }`}>
                      {kpi.change}
                    </span>
                  </div>
                  
                  {kpi.target && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      Target: {kpi.target}
                    </div>
                  )}
                </div>
                
                {progressValue !== undefined && (
                  <div className="space-y-2">
                    <Progress 
                      value={Math.min(progressValue, 100)} 
                      className="h-2"
                      style={{ 
                        '--progress-foreground': roleColor 
                      } as React.CSSProperties}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{Math.round(progressValue)}%</span>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {kpi.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoleSpecificKPIs;
