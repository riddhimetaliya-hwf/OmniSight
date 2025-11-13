
import React from 'react';
import { useAlertContext } from '../context/AlertContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Bell, CheckCircle, Clock } from 'lucide-react';

const AlertSummary: React.FC = () => {
  const { alerts } = useAlertContext();

  // Count alerts by severity and status
  const newAlerts = alerts.filter(alert => alert.status === 'new').length;
  const highSeverity = alerts.filter(alert => alert.severity === 'high').length;
  const acknowledged = alerts.filter(alert => alert.status === 'acknowledged').length;
  const escalated = alerts.filter(alert => alert.status === 'escalated').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="rounded-omni shadow-omni-card hover:shadow-omni-hover transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Alerts</p>
              <p className="text-3xl font-bold">{newAlerts}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-omni shadow-omni-card hover:shadow-omni-hover transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Severity</p>
              <p className="text-3xl font-bold">{highSeverity}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-omni-error/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-omni-error" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-omni shadow-omni-card hover:shadow-omni-hover transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Acknowledged</p>
              <p className="text-3xl font-bold">{acknowledged}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-omni shadow-omni-card hover:shadow-omni-hover transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Escalated</p>
              <p className="text-3xl font-bold">{escalated}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-omni-amber/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-omni-amber" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSummary;
