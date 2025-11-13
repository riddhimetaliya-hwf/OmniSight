import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { Badge } from './badge';
import { Progress } from './progress';

interface DataPoint {
  label: string;
  value: number;
  change?: number;
  target?: number;
  category?: 'primary' | 'success' | 'warning' | 'critical';
}

interface DataVisualizationProps {
  data: DataPoint[];
  type?: 'bar' | 'progress' | 'metric';
  animated?: boolean;
  className?: string;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  type = 'metric',
  animated = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [animated]);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'success': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'critical': return 'text-critical bg-critical/10 border-critical/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getCategoryAccent = (category?: string) => {
    switch (category) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'critical': return 'bg-critical';
      default: return 'bg-primary';
    }
  };

  const getTrendIcon = (change?: number) => {
    if (!change) return <Minus className="h-3 w-3" />;
    if (change > 0) return <TrendingUp className="h-3 w-3 text-success" />;
    return <TrendingDown className="h-3 w-3 text-critical" />;
  };

  const getTrendColor = (change?: number) => {
    if (!change) return 'text-muted-foreground';
    return change > 0 ? 'text-success' : 'text-critical';
  };

  const renderMetricType = () => (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
      {data.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            'relative p-3 rounded-2xl border border-border/30 bg-white/90 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col gap-2',
            isVisible && animated ? 'animate-fade-in-up' : '',
            'hover:-translate-y-0.5',
            getCategoryColor(item.category)
          )}
          style={{
            animationDelay: animated ? `${index * 100}ms` : '0ms',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm text-gray-800">{item.label}</h4>
            <div className="flex items-center gap-1">
              {getTrendIcon(item.change)}
              {item.change !== undefined && (
                <span className={cn('text-xs font-medium', getTrendColor(item.change))}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </span>
              )}
            </div>
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-xl font-bold text-gray-900 leading-tight">{item.value.toLocaleString()}</span>
            {item.target && (
              <span className="text-xs text-muted-foreground">/ {item.target.toLocaleString()}</span>
            )}
          </div>
          {item.target && (
            <Progress
              value={(item.value / item.target) * 100}
              variant={item.category === 'critical' ? 'critical' :
                      item.category === 'warning' ? 'warning' :
                      item.category === 'success' ? 'success' : 'default'}
              className="h-1.5 rounded-full bg-gray-100"
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderProgressType = () => (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            'relative flex flex-col gap-1 p-2 rounded-xl bg-white/90 border border-border/30 shadow-sm hover:shadow-md transition-all duration-200',
            'hover:-translate-y-0.5'
          )}
          style={{
            animationDelay: animated ? `${index * 150}ms` : '0ms',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-semibold text-xs text-gray-800">{item.label}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm" className="bg-gray-100 text-gray-700 border-none">
                {item.value}%
              </Badge>
              {item.change !== undefined && (
                <Badge
                  variant={item.change > 0 ? 'success' : item.change < 0 ? 'critical' : 'outline'}
                  size="sm"
                  className={cn(item.change === 0 && 'bg-muted/50 text-muted-foreground border-none')}
                >
                  {item.change > 0 ? '+' : ''}{item.change}%
                </Badge>
              )}
            </div>
          </div>
          <Progress
            value={item.value}
            variant={item.category === 'critical' ? 'critical' :
                    item.category === 'warning' ? 'warning' :
                    item.category === 'success' ? 'success' : 'gradient'}
            className="h-1.5 rounded-full bg-gray-100"
          />
        </div>
      ))}
    </div>
  );

  const renderBarType = () => (
    <div className="flex items-end gap-3 h-32">
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d.value));
        const height = (item.value / maxValue) * 100;
        
        return (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={cn(
                'w-full rounded-t-lg transition-all duration-1000 relative overflow-hidden',
                getCategoryColor(item.category)
              )}
              style={{
                height: isVisible ? `${height}%` : '0%',
                transitionDelay: animated ? `${index * 100}ms` : '0ms'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-xs">{item.value}</div>
              <div className="text-xs text-muted-foreground truncate w-16">
                {item.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={cn('p-4', className)}>
      {type === 'progress' && (
        <div className="flex items-center mb-4">
          <BarChart3 className="h-5 w-5 mr-2 text-black" />
          <h3 className="text-2xl font-bold text-black">Data Visualization</h3>
        </div>
      )}
      {type === 'metric' && renderMetricType()}
      {type === 'progress' && renderProgressType()}
      {type === 'bar' && renderBarType()}
    </div>
  );
};

export default DataVisualization;
