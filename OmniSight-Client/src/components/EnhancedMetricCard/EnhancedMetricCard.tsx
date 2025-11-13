import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface EnhancedMetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
    timeframe?: string;
  };
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'critical' | 'info';
  subtitle?: string;
  loading?: boolean;
  className?: string;
}

export const EnhancedMetricCard: React.FC<EnhancedMetricCardProps> = ({
  title,
  value,
  change,
  trend,
  status,
  subtitle,
  loading = false,
  className
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-l-success bg-success/5';
      case 'warning':
        return 'border-l-4 border-l-warning bg-warning/5';
      case 'critical':
        return 'border-l-4 border-l-critical bg-critical/5';
      case 'info':
        return 'border-l-4 border-l-info bg-info/5';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Card className={cn("metric-card", className)}>
        <CardHeader className="pb-3">
          <div className="skeleton-text w-2/3"></div>
        </CardHeader>
        <CardContent>
          <div className="skeleton-metric w-1/2 mb-2"></div>
          <div className="skeleton-text w-1/3"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "compact-metric-card bg-white/90 shadow-sm hover:shadow-lg rounded-2xl border border-border/40 transition-all duration-200 hover:-translate-y-0.5",
        className
      )}
      style={{ minHeight: 120, padding: 0 }}
    >
      <CardHeader className="pb-1 pt-3 px-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold tracking-tight mb-0.5 text-gray-800 flex items-center gap-2 leading-tight">
            {/* Colored dot for status */}
            {status && (
              <span
                className={cn(
                  "inline-block w-2 h-2 rounded-full",
                  status === 'success' && 'bg-success',
                  status === 'warning' && 'bg-warning',
                  status === 'critical' && 'bg-critical',
                  status === 'info' && 'bg-info'
                )}
              />
            )}
            {title}
          </CardTitle>
          {subtitle && (
            <p className="text-xs text-muted-foreground font-normal leading-snug mt-0.5">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium",
            trend === 'up' && "text-success bg-success/10",
            trend === 'down' && "text-critical bg-critical/10",
            trend === 'neutral' && "text-muted-foreground bg-muted/50"
          )}>
            {getTrendIcon()}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0.5">
        <div className="flex items-end justify-between">
          <span className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{value}</span>
          {change && (
            <div className="flex flex-col items-end ml-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[11px] px-2 py-0.5 font-medium border-none bg-gray-100/80 text-gray-700",
                  change.type === 'increase' && "bg-success/10 text-success",
                  change.type === 'decrease' && "bg-critical/10 text-critical",
                  change.type === 'neutral' && "bg-muted/50 text-muted-foreground"
                )}
              >
                {change.type === 'increase' && <TrendingUp className="h-3 w-3 mr-1" />}
                {change.type === 'decrease' && <TrendingDown className="h-3 w-3 mr-1" />}
                {change.value}
              </Badge>
              {change.timeframe && (
                <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{change.timeframe}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMetricCard;
