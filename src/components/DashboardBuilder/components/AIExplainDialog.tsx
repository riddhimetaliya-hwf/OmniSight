
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface AIExplainDialogProps {
  open: boolean;
  onClose: () => void;
  metricId?: string;
  metricName?: string;
}

const AIExplainDialog: React.FC<AIExplainDialogProps> = ({
  open,
  onClose,
  metricId,
  metricName
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Explaining {metricName || "Metric"}</DialogTitle>
          <DialogDescription>
            AI-powered explanation and insights
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <p>This metric represents key performance data that helps you understand your business better.</p>
          <p>AI analysis will appear here with detailed insights about trends, anomalies, and recommendations.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIExplainDialog;
