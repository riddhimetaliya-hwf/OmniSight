
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ServiceMetric } from '../types';

interface SLAHeatmapProps {
  metrics: ServiceMetric[];
}

const SLAHeatmap: React.FC<SLAHeatmapProps> = ({ metrics }) => {
  // Filter metrics that have SLA targets
  const metricsWithSLA = metrics.filter(m => m.slaTarget !== undefined);
  
  // Group metrics by category
  const groupedMetrics = metricsWithSLA.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, ServiceMetric[]>);

  const getSLAColor = (compliance: number | undefined) => {
    if (!compliance) return 'bg-gray-200 dark:bg-gray-700';
    if (compliance >= 95) return 'bg-green-500 dark:bg-green-600';
    if (compliance >= 85) return 'bg-amber-400 dark:bg-amber-500';
    if (compliance >= 75) return 'bg-orange-500 dark:bg-orange-600';
    return 'bg-red-500 dark:bg-red-600';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">SLA Performance Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium capitalize">
                {category.replace('_', ' ')}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {categoryMetrics.map(metric => (
                  <div 
                    key={metric.id} 
                    className="flex items-center p-2 rounded border"
                  >
                    <div className="grow">
                      <div className="text-sm font-medium">{metric.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Target: {metric.slaTarget}{metric.unit}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-16 h-8 rounded flex items-center justify-center text-white text-sm font-medium ${getSLAColor(metric.slaCompliance)}`}
                      >
                        {metric.slaCompliance}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SLAHeatmap;

