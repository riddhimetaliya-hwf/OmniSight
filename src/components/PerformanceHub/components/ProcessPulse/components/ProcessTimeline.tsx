
import React from 'react';
import { ProcessDetail } from '../types';
import { Separator } from '@/components/ui/separator';
import { ClockIcon } from 'lucide-react';

interface ProcessTimelineProps {
  processDetail: ProcessDetail;
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ processDetail }) => {
  // Sort timeline events chronologically
  const sortedTimeline = [...processDetail.timeline].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Process Timeline</h3>
      <div className="space-y-3">
        {sortedTimeline.map((event, index) => (
          <div key={index} className="relative">
            {index !== 0 && (
              <div className="absolute left-[9px] top-[-16px] w-[2px] h-[16px] bg-border"></div>
            )}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-1">
                <ClockIcon className="h-3 w-3 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{event.event}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
            </div>
            {index !== sortedTimeline.length - 1 && (
              <div className="absolute left-[9px] bottom-[-16px] w-[2px] h-[16px] bg-border"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessTimeline;
