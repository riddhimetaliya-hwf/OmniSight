import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { SystemNode, SystemMetric } from './types';
import { X, ArrowUp, ArrowDown, ArrowRight, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';

interface SystemNodeDetailProps {
  node: SystemNode;
  onClose: () => void;
}

// Add this style block to hide the default close button
const dialogCloseButtonStyle = `
  button.absolute.right-4.top-4[data-state="open"] {
    display: none !important;
  }
`;

const SystemNodeDetail: React.FC<SystemNodeDetailProps> = ({ node, onClose }) => {
  const getStatusIcon = () => {
    switch (node.status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getDepartmentColor = () => {
    switch (node.department) {
      case 'sales':
        return 'bg-blue-100 text-blue-800';
      case 'marketing':
        return 'bg-orange-100 text-orange-800';
      case 'hr':
        return 'bg-purple-100 text-purple-800';
      case 'finance':
        return 'bg-yellow-100 text-yellow-800';
      case 'operations':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderMetricTrend = (metric: SystemMetric) => {
    if (!metric.trend) return null;
    
    switch (metric.trend) {
      case 'up':
        return (
          <div className="flex items-center text-green-600">
            <ArrowUp className="h-3 w-3 mr-1" />
            {metric.change && <span>{metric.change}%</span>}
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-red-600">
            <ArrowDown className="h-3 w-3 mr-1" />
            {metric.change && <span>{Math.abs(metric.change)}%</span>}
          </div>
        );
      case 'stable':
        return (
          <div className="flex items-center text-gray-600">
            <ArrowRight className="h-3 w-3 mr-1" />
            <span>Stable</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Only one close button (DialogClose) and stop propagation on close
  const handleDialogClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      <style>{dialogCloseButtonStyle}</style>
      <Dialog open={!!node} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center">
                {node.label}
                <Badge variant="outline" className="ml-2">
                  {node.type.toUpperCase()}
                </Badge>
              </div>
              <DialogClose onClick={handleDialogClose} className="rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge className={getDepartmentColor()}>
                {node.department ? node.department.charAt(0).toUpperCase() + node.department.slice(1) : 'Unknown'}
              </Badge>
              
              <div className="flex items-center">
                {getStatusIcon()}
                <span className="ml-2 text-sm font-medium capitalize">{node.status}</span>
              </div>
            </div>
            
            {node.description && (
              <p className="text-sm text-muted-foreground">{node.description}</p>
            )}
            
            {node.metrics && node.metrics.length > 0 && (
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm font-medium">System Metrics</div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  {node.metrics.map((metric, idx) => (
                    <div key={idx} className="border rounded-md p-3 bg-card">
                      <div className="text-xs text-muted-foreground mb-1">{metric.name}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">{metric.value}</div>
                        {renderMetricTrend(metric)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SystemNodeDetail;
