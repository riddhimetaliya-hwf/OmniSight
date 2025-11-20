import React from 'react';
import { KPI } from './types';
import { useKPIContext } from './context/KPIContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Edit, MoreHorizontal, Share2, Star, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import KPIProgressBar from './components/KPIProgressBar';
import KPITrend from './components/KPITrend';

interface KPICardProps {
  kpi: KPI;
}

const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const { toggleFavoriteKPI, deleteKPI } = useKPIContext();

  const formatValue = (value: number): string => {
    if (kpi.unit === 'percentage') {
      return value.toFixed(kpi.formatDecimals ?? 1) + '%';
    } else if (kpi.unit === 'currency') {
      return (kpi.prefix || '') + value.toLocaleString('en-US', {
        minimumFractionDigits: kpi.formatDecimals ?? 0,
        maximumFractionDigits: kpi.formatDecimals ?? 0
      });
    }
    return value.toString();
  };

  const getProgressColor = (status: KPI['status']): string => {
    switch (status) {
      case 'exceeded': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'at-risk': return 'bg-amber-500';
      case 'behind': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: KPI['status']): string => {
    switch (status) {
      case 'exceeded': return 'bg-green-100 text-green-800 border-green-300';
      case 'on-track': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'at-risk': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'behind': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getFormattedDelta = (): string => {
    const delta = kpi.actual - kpi.target;
    const percentDelta = (delta / kpi.target) * 100;
    
    if (kpi.unit === 'percentage') {
      return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`;
    } else if (kpi.unit === 'currency') {
      return `${delta >= 0 ? '+' : ''}${kpi.prefix || ''}${Math.abs(delta).toLocaleString('en-US')} (${percentDelta >= 0 ? '+' : ''}${percentDelta.toFixed(1)}%)`;
    }
    
    return `${delta >= 0 ? '+' : ''}${delta} (${percentDelta >= 0 ? '+' : ''}${percentDelta.toFixed(1)}%)`;
  };

  const progress = Math.min(Math.round((kpi.actual / kpi.target) * 100), 100);

  return (
    <Card className="card-glass shadow-xl hover:shadow-2xl transition-all duration-300 border-0 relative overflow-visible group">
      {/* Gradient Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-pink-400 animate-gradient-x rounded-t-2xl z-10" />
      {/* Floating Accent Icon */}
      <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-br from-pink-400 via-primary to-secondary rounded-full p-2 shadow-lg animate-bounce-gentle">
        <Star className="h-6 w-6 text-white opacity-80" />
      </div>
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg text-primary drop-shadow-md">{kpi.name}</CardTitle>
              {kpi.alerts && kpi.alerts.some(alert => !alert.read) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-amber-500 animate-pulse">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{kpi.alerts.find(alert => !alert.read)?.message}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <CardDescription className="text-xs text-muted-foreground/80 italic">
              {kpi.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-yellow-100/60"
                    onClick={() => toggleFavoriteKPI(kpi.id)}
                  >
                    <Star className={`h-4 w-4 ${kpi.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {kpi.favorite ? "Remove from favorites" : "Add to favorites"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit KPI
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center text-red-600" 
                  onClick={() => deleteKPI(kpi.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline" className={getStatusBadgeColor(kpi.status) + " shadow status-indicator text-xs px-3 py-1.5 font-semibold"}>
            {kpi.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <span className="text-xs text-muted-foreground/70 font-semibold">
            {kpi.timeframe.charAt(0).toUpperCase() + kpi.timeframe.slice(1)} Goal
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 relative z-10">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Actual</p>
            <div className="flex items-baseline">
              <h3 className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-primary via-secondary to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                {formatValue(kpi.actual)}
              </h3>
              <KPITrend trend={kpi.trend} className="ml-2" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Target</p>
            <h3 className="text-2xl font-bold text-secondary drop-shadow-md">
              {formatValue(kpi.target)}
            </h3>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-muted-foreground/80">Progress</span>
            <span className="font-bold text-primary/90">{progress}%</span>
          </div>
          <KPIProgressBar value={progress} status={kpi.status} />
          <div className="text-sm text-right">
            <span className={kpi.actual >= kpi.target ? "text-green-500 bg-green-100 px-2 py-0.5 rounded-full font-semibold shadow metric-change positive" : "text-red-500 bg-red-100 px-2 py-0.5 rounded-full font-semibold shadow metric-change negative"}>
              {getFormattedDelta()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground/80 italic relative z-10">
        {kpi.commentary || "No AI commentary available."}
      </CardFooter>
      {/* Optional: Subtle background pattern for extra flair */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-pattern-dots opacity-10" />
      {/* Animated border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-primary via-secondary to-pink-400 opacity-0 group-hover:opacity-80 transition-all duration-500 blur-sm pointer-events-none" />
    </Card>
  );
};

export default KPICard;
