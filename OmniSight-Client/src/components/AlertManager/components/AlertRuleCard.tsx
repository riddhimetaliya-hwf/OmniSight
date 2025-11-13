
import React, { useState } from 'react';
import { AlertRule } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useAlertContext } from '../context/AlertContext';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Mail,
  MessageSquare,
  Phone,
  Slack,
  Trash2,
  Users,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AlertRuleCardProps {
  rule: AlertRule;
}

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'teams':
      return <Users className="h-4 w-4" />;
    case 'slack':
      return <Slack className="h-4 w-4" />;
    case 'sms':
      return <Phone className="h-4 w-4" />;
    case 'in-app':
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const AlertRuleCard: React.FC<AlertRuleCardProps> = ({ rule }) => {
  const { updateRule, deleteRule } = useAlertContext();
  const [expanded, setExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleActive = () => {
    updateRule(rule.id, { enabled: !rule.enabled });
  };

  const handleDeleteRule = () => {
    deleteRule(rule.id);
    setIsDeleting(false);
  };

  const createdAt = formatDistanceToNow(new Date(rule.createdAt), { addSuffix: true });

  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow duration-200 ${!rule.enabled ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{rule.name}</CardTitle>
              {!rule.enabled && (
                <Badge variant="outline" className="text-muted-foreground">
                  Inactive
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {rule.description}
            </p>
          </div>
          <Switch 
            checked={rule.enabled} 
            onCheckedChange={handleToggleActive}
            aria-label={rule.enabled ? "Disable rule" : "Enable rule"}
          />
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            {rule.department.charAt(0).toUpperCase() + rule.department.slice(1)}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            Escalate: {rule.escalationMinutes}m
          </Badge>
          <div className="flex gap-1">
            {rule.channels.map(channel => (
              <TooltipProvider key={channel}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center">
                      {getChannelIcon(channel)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{channel}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground border-l-2 border-blue-300 pl-3 py-1 italic bg-blue-50/50 rounded-sm">
          "{rule.naturalLanguage}"
        </div>
        
        {expanded && (
          <div className="mt-4 space-y-3">
            <div className="bg-muted/50 p-3 rounded">
              <h4 className="text-sm font-medium mb-2">Recipients:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rule.recipients.map(recipient => (
                  <div key={recipient.id} className="flex items-center text-sm">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <Users className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">{recipient.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {recipient.type === 'user' ? 'User' : 
                         recipient.type === 'group' ? 'Group' : 'Role'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded">
              <h4 className="text-sm font-medium mb-2">Technical Details:</h4>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition:</span>
                  <span className="font-mono">{rule.condition}</span>
                </div>
                {rule.threshold !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Threshold:</span>
                    <span className="font-mono">{rule.threshold}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1" />
          Created {createdAt}
        </div>
        
        <div className="flex gap-2">
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
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Alert Rule</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the "{rule.name}" rule? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRule} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AlertRuleCard;
