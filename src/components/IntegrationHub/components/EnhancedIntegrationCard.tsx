
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { 
  Check, 
  AlertCircle, 
  Clock, 
  Loader2, 
  Activity,
  TrendingUp,
  Settings,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { StatusType } from '../IntegrationStatus';

interface EnhancedIntegrationCardProps {
  name: string;
  description: string;
  logoSrc?: string;
  status: StatusType;
  lastSync?: string;
  dataPoints?: number;
  connectionType?: string;
  healthScore?: number;
  syncProgress?: number;
  dataFlow?: {
    incoming: number;
    outgoing: number;
  };
  onConfigure?: () => void;
  onView?: () => void;
  onPause?: () => void;
  onSync?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const EnhancedIntegrationCard: React.FC<EnhancedIntegrationCardProps> = ({
  name,
  description,
  logoSrc,
  status,
  lastSync,
  dataPoints,
  connectionType,
  healthScore = 85,
  syncProgress,
  dataFlow,
  onConfigure,
  onView,
  onPause,
  onSync,
  onDelete,
  className
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const configs = {
      active: { label: 'Active', variant: 'default' as const, color: 'bg-green-100 text-green-700' },
      syncing: { label: 'Syncing', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-700' },
      failed: { label: 'Failed', variant: 'destructive' as const, color: 'bg-red-100 text-red-700' },
      inactive: { label: 'Inactive', variant: 'outline' as const, color: 'bg-gray-100 text-gray-700' }
    };
    
    const config = configs[status];
    return (
      <Badge className={`${config.color} border-0`}>
        {getStatusIcon()}
        <span className="ml-1">{config.label}</span>
      </Badge>
    );
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 h-full flex flex-col ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border flex items-center justify-center">
                <img 
                  src={logoSrc || '/placeholder.svg'} 
                  alt={`${name} logo`} 
                  className="max-h-8 max-w-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              {status === 'active' && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              {connectionType && (
                <Badge variant="outline" className="text-xs mt-1">
                  {connectionType}
                </Badge>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3 flex-shrink-0">{description}</p>

        <div className="flex-1 space-y-4">
          {/* Health Score and Sync Progress */}
          {status === 'active' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Health Score</span>
                <Tooltip>
                  <TooltipTrigger>
                    <span className={`font-medium ${getHealthColor(healthScore)}`}>
                      {healthScore}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Connection quality and data accuracy metrics
                  </TooltipContent>
                </Tooltip>
              </div>
              <Progress value={healthScore} className="h-2" />
            </div>
          )}

          {/* Sync Progress for syncing status */}
          {status === 'syncing' && syncProgress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sync Progress</span>
                <span className="font-medium">{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}

          {/* Data Flow Metrics */}
          {dataFlow && status === 'active' && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {(dataFlow.incoming / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-muted-foreground">Incoming</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {(dataFlow.outgoing / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-muted-foreground">Outgoing</div>
              </div>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {dataPoints && (
              <div>
                <div className="text-muted-foreground">Data Points</div>
                <div className="font-medium">{dataPoints.toLocaleString()}</div>
              </div>
            )}
            {lastSync && (
              <div>
                <div className="text-muted-foreground">Last Sync</div>
                <div className="font-medium">{formatTimeAgo(lastSync)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {onView && (
            <Button variant="ghost" size="sm" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onConfigure && (
            <Button variant="ghost" size="sm" onClick={onConfigure}>
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {onSync && status !== 'syncing' && (
            <Button variant="ghost" size="sm" onClick={onSync}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onPause && status === 'active' && (
            <Button variant="ghost" size="sm" onClick={onPause}>
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default EnhancedIntegrationCard;
