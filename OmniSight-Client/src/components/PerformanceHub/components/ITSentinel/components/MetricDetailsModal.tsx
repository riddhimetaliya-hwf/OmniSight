
import React from 'react';
import { ServiceMetric } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Database, LineChart as LineChartIcon, Shield, Ticket, Clock } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricDetailsModalProps {
  metric: ServiceMetric | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MetricDetailsModal: React.FC<MetricDetailsModalProps> = ({ metric, open, onOpenChange }) => {
  if (!metric) return null;

  const getCategoryIcon = () => {
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
        return null;
    }
  };

  // Format the date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // For the bar chart that compares current value to target
  const comparisonData = [
    { name: 'Current', value: metric.value },
    ...(metric.slaTarget ? [{ name: 'Target', value: metric.slaTarget }] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getCategoryIcon()}
            <DialogTitle>{metric.name}</DialogTitle>
          </div>
          <DialogDescription>
            {metric.category.replace('_', ' ')} metric • Last updated: {new Date(metric.lastUpdated).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="trend">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trend" className="flex items-center gap-1">
              <LineChartIcon className="h-4 w-4" />
              <span>Trend Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>Target Comparison</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trend">
            <Card>
              <CardContent className="pt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metric.history}
                      margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value) => [`${value} ${metric.unit}`, metric.name]}
                        labelFormatter={(label) => formatDate(label as string)}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 text-sm">
                  <h3 className="font-medium mb-1">Trend Analysis</h3>
                  <p className="text-muted-foreground">
                    This metric has {metric.trend > 0 ? 'increased' : 'decreased'} by {Math.abs(metric.trend)}% over the tracked period.
                    {metric.slaTarget && (
                      <span>
                        {' '}The current compliance with the SLA target is <span className={
                          metric.slaCompliance >= 90 ? 'text-green-600 font-medium' : 
                          metric.slaCompliance >= 75 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'
                        }>{metric.slaCompliance}%</span>.
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison">
            <Card>
              <CardContent className="pt-4">
                {metric.slaTarget ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={comparisonData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value) => [`${value} ${metric.unit}`, '']}
                        />
                        <Bar 
                          dataKey="value" 
                          fill={
                            metric.name === 'Current' ? 
                              (metric.status === 'healthy' ? '#22c55e' : 
                               metric.status === 'warning' ? '#f59e0b' : '#ef4444') : 
                              '#8b5cf6'
                          }
                          radius={[4, 4, 0, 0]}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    No SLA target defined for this metric
                  </div>
                )}
                
                <div className="mt-4 text-sm">
                  <h3 className="font-medium mb-1">Target Analysis</h3>
                  {metric.slaTarget ? (
                    <p className="text-muted-foreground">
                      Current value ({metric.value}{metric.unit}) is {
                        metric.value >= metric.slaTarget ? 
                          'meeting or exceeding' : 
                          'below'
                      } the target of {metric.slaTarget}{metric.unit}.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No target has been set for this metric. Consider defining an SLA target for better performance tracking.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-sm text-muted-foreground mt-2">
          {metric.owner && (
            <p>Metric Owner: <span className="font-medium">{metric.owner}</span></p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetricDetailsModal;

