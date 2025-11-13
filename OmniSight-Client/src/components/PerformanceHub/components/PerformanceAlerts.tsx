
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, Clock, ExternalLink } from 'lucide-react';
import { mockAlerts } from '../data/mockData';

const PerformanceAlerts: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Performance Alerts</span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAlerts.map((alert) => (
          <Alert key={alert.id} variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
            <div className="flex justify-between items-start">
              <div>
                <AlertTitle className="font-medium flex items-center gap-2">
                  {alert.title}
                  <Badge 
                    variant={alert.severity === 'critical' ? 'destructive' : 'outline'}
                    className="ml-2"
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="text-sm">{alert.description}</AlertDescription>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{alert.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.timestamp}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <span>Investigate</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};

export default PerformanceAlerts;
