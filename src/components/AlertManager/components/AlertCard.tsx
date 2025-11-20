
import React, { useState } from 'react';
import { Alert } from '../types';
import { useAlertContext } from '../context/AlertContext';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Hammer,
  MessageSquare,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AlertCardProps {
  alert: Alert;
}

const getSeverityIcon = (severity: Alert['severity']) => {
  switch (severity) {
    case 'high':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'medium':
      return <Bell className="h-4 w-4 text-amber-500" />;
    case 'low':
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getSeverityBadgeColor = (severity: Alert['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-red-500 hover:bg-red-600';
    case 'medium':
      return 'bg-amber-500 hover:bg-amber-600';
    case 'low':
      return 'bg-green-500 hover:bg-green-600';
    default:
      return '';
  }
};

const getStatusBadgeColor = (status: Alert['status']) => {
  switch (status) {
    case 'new':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'acknowledged':
      return 'bg-purple-500 hover:bg-purple-600';
    case 'snoozed':
      return 'bg-gray-500 hover:bg-gray-600';
    case 'escalated':
      return 'bg-red-500 hover:bg-red-600';
    case 'resolved':
      return 'bg-green-500 hover:bg-green-600';
    default:
      return '';
  }
};

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const { updateAlertStatus } = useAlertContext();
  const [expanded, setExpanded] = useState(false);

  const handleAcknowledge = () => {
    updateAlertStatus(alert.id, 'acknowledged');
  };

  const handleEscalate = () => {
    updateAlertStatus(alert.id, 'escalated');
  };

  const handleSnooze = () => {
    updateAlertStatus(alert.id, 'snoozed');
  };

  const handleResolve = () => {
    updateAlertStatus(alert.id, 'resolved');
  };

  const timeSince = formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true });

  return (
    <Card className={`
      shadow-sm hover:shadow-md transition-shadow duration-200
      ${alert.severity === 'high' ? 'border-l-4 border-l-red-500' : ''}
      ${alert.severity === 'medium' ? 'border-l-4 border-l-amber-500' : ''}
      ${alert.severity === 'low' ? 'border-l-4 border-l-green-500' : ''}
    `}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              {getSeverityIcon(alert.severity)}
              <CardTitle className="text-lg">{alert.title}</CardTitle>
            </div>
            <CardDescription className="mt-1">
              {alert.message}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1">
              <Badge className={getSeverityBadgeColor(alert.severity)}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </Badge>
              <Badge className={getStatusBadgeColor(alert.status)}>
                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {timeSince}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between mt-3 text-sm">
          <span className="text-muted-foreground">
            Source: {alert.source.charAt(0).toUpperCase() + alert.source.slice(1)}
          </span>
          <span className="text-muted-foreground">
            Dept: {alert.department.charAt(0).toUpperCase() + alert.department.slice(1).replace('-', ' ')}
          </span>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pb-2 pt-0">
          <div className="bg-muted/50 p-3 rounded-md">
            {alert.metadata && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-1">Alert Details:</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {Object.entries(alert.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}:</span>
                      <span className="font-medium">{value.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {alert.suggestedActions && alert.suggestedActions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Suggested Actions:</h4>
                <ul className="text-sm space-y-1">
                  {alert.suggestedActions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <Hammer className="h-3.5 w-3.5 mr-1 text-blue-500 mt-0.5" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="p-0 h-8"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Less Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> More Details
            </>
          )}
        </Button>
        
        <div className="flex gap-2">
          {alert.status === 'new' && (
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={handleAcknowledge}
            >
              <Check className="h-4 w-4 mr-1" />
              Acknowledge
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {alert.status !== 'resolved' && (
                <DropdownMenuItem onClick={handleResolve}>
                  <Check className="h-4 w-4 mr-2" />
                  Resolve
                </DropdownMenuItem>
              )}
              {alert.status !== 'escalated' && alert.status !== 'resolved' && (
                <DropdownMenuItem onClick={handleEscalate}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Escalate
                </DropdownMenuItem>
              )}
              {alert.status !== 'snoozed' && alert.status !== 'resolved' && (
                <DropdownMenuItem onClick={handleSnooze}>
                  <Clock className="h-4 w-4 mr-2" />
                  Snooze (1 hour)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AlertCard;
