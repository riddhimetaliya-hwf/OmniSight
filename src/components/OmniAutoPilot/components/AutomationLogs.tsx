
import React from 'react';
import { useAutomationContext } from '../context/AutomationContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export const AutomationLogs: React.FC = () => {
  const { logs } = useAutomationContext();

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No logs found</h3>
        <p className="text-muted-foreground max-w-md">
          There are no automation logs to display yet. Logs will appear when automations run.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Showing {logs.length} automation {logs.length === 1 ? 'log' : 'logs'}
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <Card key={log.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="pt-1">{getStatusIcon(log.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{log.automationName}</h4>
                    {getStatusBadge(log.status)}
                  </div>
                  <p className="text-sm mt-1">{log.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(log.timestamp), 'PPp')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
