
import React from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import IntegrationStatus, { StatusType } from "./IntegrationStatus";
import { 
  Clock, 
  MoreHorizontal, 
  Trash, 
  ExternalLink,
  Settings,
  Pause,
  ActivitySquare 
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export interface IntegrationCardProps {
  name: string;
  description: string;
  logoSrc: string;
  status: StatusType;
  lastSync?: string;
  dataPoints?: number;
  connectionType?: string;
  onDisable?: () => void;
  onDelete?: () => void;
  onPause?: () => void;
  onTest?: () => void;
  onConfigure?: () => void;
  onView?: () => void;
  className?: string;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  logoSrc,
  status,
  lastSync,
  dataPoints,
  connectionType,
  onDisable,
  onDelete,
  onPause,
  onTest,
  onConfigure,
  onView,
  className,
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 flex flex-col h-full",
      "hover:shadow-lg hover:border-primary/20 animate-fade-in",
      className
    )}>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-md overflow-hidden flex items-center justify-center bg-gray-50 border">
              <img 
                src={logoSrc} 
                alt={`${name} logo`} 
                className="max-h-9 max-w-9 object-contain"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              {connectionType && (
                <Badge variant="outline" className="text-xs font-normal mt-1">
                  {connectionType}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <IntegrationStatus status={status} showText />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center p-1.5 rounded-full hover:bg-muted transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {onView && (
                  <DropdownMenuItem 
                    onClick={onView}
                    className="cursor-pointer"
                  >
                    <ExternalLink size={14} className="mr-2" />
                    View details
                  </DropdownMenuItem>
                )}
                
                {onConfigure && (
                  <DropdownMenuItem 
                    onClick={onConfigure}
                    className="cursor-pointer"
                  >
                    <Settings size={14} className="mr-2" />
                    Configure
                  </DropdownMenuItem>
                )}
                
                {onTest && (
                  <DropdownMenuItem 
                    onClick={onTest} 
                    className="cursor-pointer"
                  >
                    <ActivitySquare size={14} className="mr-2" />
                    Test connection
                  </DropdownMenuItem>
                )}
                
                {onPause && (
                  <DropdownMenuItem 
                    onClick={onPause} 
                    className="cursor-pointer"
                  >
                    <Pause size={14} className="mr-2" />
                    Pause synchronization
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                {onDisable && (
                  <DropdownMenuItem 
                    onClick={onDisable} 
                    className="cursor-pointer text-amber-500"
                  >
                    Disable integration
                  </DropdownMenuItem>
                )}
                
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={onDelete} 
                    className="cursor-pointer text-destructive"
                  >
                    <Trash size={14} className="mr-2" />
                    Remove integration
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mb-4 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
        </div>
        
        <div className="flex flex-col space-y-1.5">
          {dataPoints !== undefined && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Data points:</span>
              <span className="font-medium">{dataPoints.toLocaleString()}</span>
            </div>
          )}
          
          {lastSync && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1.5" />
                      <span>Last synchronized:</span>
                    </div>
                    <span className="font-medium">{formatTimeAgo(lastSync)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  Last synchronized on {new Date(lastSync).toLocaleString()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </Card>
  );
};

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'Just now';
  }
  
  // Minutes
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  
  // Hours
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  
  // Days
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }
  
  // Weeks
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  }
  
  // Months
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}m ago`;
  }
  
  // Years
  return `${Math.floor(months / 12)}y ago`;
}

export default IntegrationCard;
