
import React from 'react';
import { ProcessDetail } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LightbulbIcon, TrendingUpIcon, ClockIcon } from "lucide-react";
import ProcessStepsList from './ProcessStepsList';
import ProcessTimeline from './ProcessTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProcessDetailsModalProps {
  processDetail: ProcessDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProcessDetailsModal: React.FC<ProcessDetailsModalProps> = ({ 
  processDetail, 
  isOpen, 
  onClose 
}) => {
  if (!processDetail) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{processDetail.name}</DialogTitle>
          <DialogDescription>
            Process ID: {processDetail.id}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="steps" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="steps">Process Steps</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="insights">Insights & Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps" className="mt-0">
            <ProcessStepsList steps={processDetail.steps} />
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-0">
            <ProcessTimeline processDetail={processDetail} />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Cycle Time:</span>
                    <span className="font-medium">{processDetail.metrics.avgCycleTime.toFixed(1)} days</span>
                  </div>
                  <div>
                    <div className="text-sm mb-1">Top Blockers:</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {Object.entries(processDetail.metrics.blockerFrequency)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([blocker, frequency], index) => (
                          <li key={index} className="flex justify-between">
                            <span>{blocker}</span>
                            <span>{frequency} occurrences</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              {processDetail.predictedCompletion && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Predictions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2 items-center">
                      <ClockIcon className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">Predicted Completion:</div>
                        <div className="text-sm">
                          {new Date(processDetail.predictedCompletion).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {processDetail.suggestedImprovements && processDetail.suggestedImprovements.length > 0 && (
              <Alert>
                <LightbulbIcon className="h-4 w-4" />
                <AlertTitle>Suggested Improvements</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                    {processDetail.suggestedImprovements.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessDetailsModal;
