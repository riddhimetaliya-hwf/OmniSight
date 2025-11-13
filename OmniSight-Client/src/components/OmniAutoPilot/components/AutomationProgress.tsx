
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AutomationProgressProps {
  value: number;
  status: 'running' | 'paused' | 'completed' | 'error';
  steps?: {
    name: string;
    status: 'completed' | 'pending' | 'error' | 'running';
  }[];
}

export const AutomationProgress: React.FC<AutomationProgressProps> = ({ 
  value, 
  status,
  steps 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'var(--primary)';
      case 'completed':
        return '#10b981'; // green
      case 'error':
        return '#ef4444'; // red
      case 'paused':
        return '#f59e0b'; // amber
      default:
        return 'var(--primary)';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{status === 'completed' ? 'Completed' : `${Math.round(value)}% complete`}</span>
        {status === 'running' && <span>Running...</span>}
        {status === 'paused' && <span>Paused</span>}
        {status === 'error' && <span>Error</span>}
      </div>
      
      <div style={{ "--progress-indicator-color": getStatusColor() } as React.CSSProperties}>
        <Progress value={value} className="h-2" />
      </div>
      
      {steps && steps.length > 0 && (
        <div className="flex mt-2 overflow-x-auto pb-1 gap-1">
          {steps.map((step, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      step.status === 'completed' ? 'bg-green-500' :
                      step.status === 'running' ? 'bg-blue-500' :
                      step.status === 'error' ? 'bg-red-500' : 'bg-gray-200'
                    }`}
                    aria-label={`Step ${index + 1}: ${step.name}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{step.name} - {step.status}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
};
