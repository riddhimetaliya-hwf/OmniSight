
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { List, Calendar, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CleaningStep } from './types';
import DataPreview from './DataPreview';

interface CleaningHistoryProps {
  steps: CleaningStep[];
}

const CleaningHistory: React.FC<CleaningHistoryProps> = ({ steps }) => {
  if (steps.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <List className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-1">No cleaning history yet</h3>
        <p>Start cleaning your data to see the cleaning steps here</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {steps.map((step, index) => (
        <AccordionItem key={step.id} value={step.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0">
                {index + 1}
              </Badge>
              <div className="flex-1">
                <span className="text-sm font-medium">{step.command}</span>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(step.timestamp, { addSuffix: true })}
                  </span>
                  <span className="flex items-center">
                    {step.applied ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-green-500" />
                        Applied
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1 text-red-500" />
                        Not applied
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-9 pr-2 pb-2">
              <h4 className="text-sm font-medium mb-2">Changes</h4>
              <DataPreview 
                before={step.changes.before}
                after={step.changes.after}
                columns={Object.keys(step.changes.before[0] || {}).map(name => ({
                  id: name,
                  name,
                  type: 'string',
                  data: []
                }))}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CleaningHistory;
