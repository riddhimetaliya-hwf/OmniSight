
import React from 'react';
import { ServiceMetric } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Check, Clock, Database, Shield, Ticket, TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface ServiceMetricCardProps {
  metric: ServiceMetric;
  onClick?: (metric: ServiceMetric) => void;
}

const ServiceMetricCard: React.FC<ServiceMetricCardProps> = ({ metric, onClick }) => {
  const getMetricIcon = () => {
    switch (metric.category) {
      case 'service_desk':
        return <Ticket className="h-5 w-5 text-blue-500" />;
      case 'security':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'infrastructure':
        return <Database className="h-5 w-5 text-purple-500" />;
      case 'itil':
        return <Clock className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (metric.status) {
      case 'healthy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTrendIcon = () => {
    if (metric.trend > 0) {
      // For some metrics like response time, upward trend is bad
      const isBadTrendUp = ['service_desk', 'security', 'infrastructure'].includes(metric.category) && 
                           (metric.name.toLowerCase().includes('time') || 
                            metric.name.toLowerCase().includes('latency') ||
                            metric.name.toLowerCase().includes('incidents') ||
                            metric.name.toLowerCase().includes('aging'));
      
      return (
        <span className={`flex items-center gap-1 ${isBadTrendUp ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          <TrendingUp className="h-4 w-4" />
          <span>{Math.abs(metric.trend)}%</span>
        </span>
      );
    } else if (metric.trend < 0) {
      // For some metrics like uptime, downward trend is bad
      const isBadTrendDown = metric.category === 'infrastructure' && 
                            (metric.name.toLowerCase().includes('uptime') || 
                             metric.name.toLowerCase().includes('compliance')) ||
                            metric.name.toLowerCase().includes('success');
      
      return (
        <span className={`flex items-center gap-1 ${isBadTrendDown ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
          <TrendingDown className="h-4 w-4" />
          <span>{Math.abs(metric.trend)}%</span>
        </span>
      );
    }
    return <span className="text-gray-500">No change</span>;
  };

  return (
    <Card 
      className={`overflow-hidden border-l-4 ${
        metric.status === 'healthy' ? 'border-l-green-500' :
        metric.status === 'warning' ? 'border-l-amber-500' : 'border-l-red-500'
      } hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => onClick?.(metric)}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getMetricIcon()}
            <CardTitle className="text-base font-medium">{metric.name}</CardTitle>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
            {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-2xl font-semibold mr-1">{metric.value}</span>
            <span className="text-sm text-muted-foreground">{metric.unit}</span>
          </div>
          <div className="text-sm">{getTrendIcon()}</div>
        </div>
        
        {/* Spark line chart */}
        <div className="h-12 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metric.history}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={
                  metric.status === 'healthy' ? '#22c55e' :
                  metric.status === 'warning' ? '#f59e0b' : '#ef4444'
                } 
                strokeWidth={2}
                dot={false}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-2 border rounded shadow-sm text-xs">
                        <p>{new Date(payload[0].payload.date).toLocaleDateString()}</p>
                        <p className="font-semibold">{payload[0].value} {metric.unit}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* SLA target */}
        {metric.slaTarget && (
          <div className="mt-3">
            <div className="flex justify-between mb-1 text-xs">
              <span>SLA: {metric.slaTarget}{metric.unit}</span>
              <span className={metric.slaCompliance >= 90 ? 'text-green-600' : metric.slaCompliance >= 75 ? 'text-amber-600' : 'text-red-600'}>
                {metric.slaCompliance}%
              </span>
            </div>
            <Progress 
              value={metric.slaCompliance} 
              className="h-1" 
              indicatorClassName={
                metric.slaCompliance >= 90 ? 'bg-green-500' : 
                metric.slaCompliance >= 75 ? 'bg-amber-500' : 'bg-red-500'
              } 
            />
          </div>
        )}
        
        {/* Metric metadata */}
        <div className="mt-3 text-xs text-muted-foreground flex justify-between">
          {metric.owner ? (
            <span>Owner: {metric.owner}</span>
          ) : (
            <span>Updated: {new Date(metric.lastUpdated).toLocaleTimeString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceMetricCard;

