
import React from 'react';
import { ProcessMetric } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProcessMetricCardProps {
  process: ProcessMetric;
  onClick: (processId: string) => void;
}

const ProcessMetricCard: React.FC<ProcessMetricCardProps> = ({ process, onClick }) => {
  const statusColors = {
    'on-track': 'bg-green-500',
    'delayed': 'bg-amber-500',
    'at-risk': 'bg-red-500'
  };

  const statusIcons = {
    'on-track': <CheckCircle className="h-5 w-5 text-green-500" />,
    'delayed': <Clock className="h-5 w-5 text-amber-500" />,
    'at-risk': <AlertTriangle className="h-5 w-5 text-red-500" />
  };

  const progressPercentage = Math.min(
    (process.cycleTime / process.expectedCycleTime) * 100, 
    100
  );

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'order-management':
        return 'Order Management';
      case 'talent-onboarding':
        return 'Talent Onboarding';
      case 'client-services':
        return 'Client Services';
      default:
        return category;
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(process.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium truncate">{process.name}</CardTitle>
          <Badge variant={process.status === 'on-track' ? 'default' : 'destructive'}>
            {statusIcons[process.status]} <span className="ml-1">{process.status.replace('-', ' ')}</span>
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {getCategoryLabel(process.category)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm mb-1 flex justify-between">
            <span>Current Step: {process.currentStep}</span>
            <span className="font-medium">Owner: {process.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Progress value={progressPercentage} className="h-2" 
                style={{ 
                  backgroundColor: process.status === 'on-track' ? 'rgb(34 197 94 / 0.2)' : 
                                  process.status === 'delayed' ? 'rgb(245 158 11 / 0.2)' : 
                                  'rgb(239 68 68 / 0.2)' 
                }}
              />
            </div>
            <span className="text-xs whitespace-nowrap">{process.cycleTime.toFixed(1)} / {process.expectedCycleTime} days</span>
          </div>
        </div>
        
        {process.blockers.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-1">Blockers ({process.blockers.length})</div>
            <ul className="text-xs text-muted-foreground">
              {process.blockers.map((blocker, index) => (
                <li key={index} className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span>{blocker}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {process.satisfactionScore && (
          <div className="text-sm flex justify-between">
            <span>Satisfaction Score:</span>
            <span className={`font-medium ${
              process.satisfactionScore >= 4 ? 'text-green-500' :
              process.satisfactionScore >= 3 ? 'text-amber-500' :
              'text-red-500'
            }`}>
              {process.satisfactionScore.toFixed(1)} / 5.0
            </span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date(process.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessMetricCard;
