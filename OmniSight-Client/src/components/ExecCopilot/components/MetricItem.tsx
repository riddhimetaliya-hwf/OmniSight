
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricItemProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  progress: number;
  target: string;
  comparison?: boolean;
  invertProgress?: boolean;
}

const MetricItem: React.FC<MetricItemProps> = ({ 
  label, 
  value, 
  change, 
  trend, 
  progress, 
  target,
  comparison = false,
  invertProgress = false
}) => {
  return (
    <div className="space-y-2 p-4 rounded-omni-sm bg-card border border-border transition-all duration-300 hover:shadow-omni-card">
      <div className="flex justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Badge 
          variant={trend === 'up' ? 'success' : trend === 'down' ? 'destructive' : 'secondary'}
          className="flex items-center gap-1"
        >
          {trend === 'up' ? (
            <TrendingUp className="h-3 w-3" />
          ) : trend === 'down' ? (
            <TrendingDown className="h-3 w-3" />
          ) : null}
          {change}
        </Badge>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xl font-semibold">{value}</span>
        <span className="text-xs text-muted-foreground">{target}</span>
      </div>
      <Progress 
        value={invertProgress ? 100 - progress : progress} 
        className="h-1.5" 
        indicatorClassName={
          comparison 
            ? (progress > 80 ? "bg-omni-emerald" : progress > 60 ? "bg-omni-amber" : "bg-omni-error")
            : undefined
        }
      />
    </div>
  );
};

export default MetricItem;
