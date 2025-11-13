
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { KPIStatus } from '../types';
import { cn } from '@/lib/utils';

interface KPIProgressBarProps {
  value: number;
  status: KPIStatus;
  className?: string;
}

const KPIProgressBar: React.FC<KPIProgressBarProps> = ({ value, status, className }) => {
  const getProgressColor = (status: KPIStatus): string => {
    switch (status) {
      case 'exceeded': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'at-risk': return 'bg-amber-500';
      case 'behind': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Apply the indicator color using style instead of indicatorClassName
  return (
    <div className={cn("w-full", className)}>
      <Progress 
        value={value} 
        className="h-2"
        // Custom styling for the indicator is applied with CSS
        style={{
          '--progress-indicator-color': getProgressColorValue(status)
        } as React.CSSProperties}
      />
    </div>
  );
};

// Helper function to get CSS color values
const getProgressColorValue = (status: KPIStatus): string => {
  switch (status) {
    case 'exceeded': return 'rgb(34, 197, 94)'; // green-500
    case 'on-track': return 'rgb(59, 130, 246)'; // blue-500
    case 'at-risk': return 'rgb(245, 158, 11)'; // amber-500
    case 'behind': return 'rgb(239, 68, 68)'; // red-500
    default: return 'rgb(107, 114, 128)'; // gray-500
  }
};

export default KPIProgressBar;
