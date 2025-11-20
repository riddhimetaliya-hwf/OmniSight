
import React from 'react';
import { ProcessInsight } from '../types';
import { ProcessInsightCard } from './ProcessInsightCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProcessInsightsListProps {
  insights: ProcessInsight[];
  isLoading: boolean;
}

const ProcessInsightsList: React.FC<ProcessInsightsListProps> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No insights available yet. Try asking a question about process performance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <ProcessInsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};

export default ProcessInsightsList;
