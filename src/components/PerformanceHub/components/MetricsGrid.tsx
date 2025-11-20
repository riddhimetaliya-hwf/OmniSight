
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  LineChart, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Metric } from '../types';
import { ViewMode, TimeFrame } from '../PerformanceHub';
import MetricTrendChart from './MetricTrendChart';

interface MetricsGridProps {
  metrics: Metric[];
  viewMode: ViewMode;
  timeFrame: TimeFrame;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, viewMode, timeFrame }) => {
  // Helper function to get the appropriate icon for a metric
  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'cycle_time':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'volume':
        return <Activity className="h-5 w-5 text-purple-500" />;
      case 'sla':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'cost':
        return <DollarSign className="h-5 w-5 text-amber-500" />;
      case 'escalations':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <LineChart className="h-5 w-5 text-slate-500" />;
    }
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) {
      return <TrendingUp className={`h-4 w-4 ${value > 0 ? 'text-green-500' : 'text-red-500'}`} />;
    } else if (value < 0) {
      return <TrendingDown className={`h-4 w-4 ${value < 0 ? 'text-red-500' : 'text-green-500'}`} />;
    }
    return null;
  };

  // Determine if the trend is good or bad based on metric type and value
  const isTrendGood = (metric: Metric) => {
    // For metrics where lower is better (cycle time, cost, escalations)
    if (['cycle_time', 'cost', 'escalations'].includes(metric.type)) {
      return metric.trend < 0;
    }
    // For metrics where higher is better (SLA compliance)
    return metric.trend > 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getMetricIcon(metric.type)}
                <CardTitle className="text-base">{metric.name}</CardTitle>
              </div>
              
              {metric.alert && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Alert</span>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-2">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-semibold">{metric.value}</span>
              <span className="text-sm text-muted-foreground">{metric.unit}</span>
              
              <div className={`ml-auto flex items-center gap-1 text-xs ${isTrendGood(metric) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {getTrendIcon(metric.trend)}
                <span>{Math.abs(metric.trend)}%</span>
              </div>
            </div>
            
            {viewMode === 'explore' && (
              <div className="mt-4">
                <MetricTrendChart data={metric.history} timeFrame={timeFrame} />
              </div>
            )}
            
            <div className="mt-4">
              <div className="flex justify-between mb-1 text-xs">
                <span>vs Target: {metric.target}{metric.unit}</span>
                <span className={`${metric.value >= metric.target ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {Math.round((metric.value / metric.target) * 100)}%
                </span>
              </div>
              <Progress 
                value={(metric.value / metric.target) * 100} 
                className="h-1" 
                indicatorClassName={metric.value >= metric.target ? 'bg-green-500' : 'bg-amber-500'} 
              />
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground flex justify-between">
              <span>{metric.department}</span>
              <span>{metric.owner}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsGrid;
