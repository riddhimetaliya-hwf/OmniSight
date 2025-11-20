
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Bell } from 'lucide-react';

interface PolicyAlertProps {
  count: number;
  criticalCount: number;
}

const PolicyAlert: React.FC<PolicyAlertProps> = ({ count, criticalCount }) => {
  if (count === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={criticalCount > 0 ? "destructive" : "default"} 
            size="sm" 
            className="relative"
          >
            <Bell className="h-4 w-4 mr-1" />
            <span>{count} {count === 1 ? 'Update' : 'Updates'}</span>
            {criticalCount > 0 && (
              <span className="ml-1">({criticalCount} Critical)</span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>You have {count} unread {count === 1 ? 'update' : 'updates'}</p>
          {criticalCount > 0 && (
            <p className="text-red-500 font-medium">
              Including {criticalCount} critical {criticalCount === 1 ? 'update' : 'updates'}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PolicyAlert;
