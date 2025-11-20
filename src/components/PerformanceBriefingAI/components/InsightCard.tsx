
import React from 'react';
import { InsightItem } from '../types';
import { 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  AlertTriangle, 
  Lightbulb, 
  BarChart, 
  TrendingUp,
  Clock,
  Share2,
  MessageSquare,
  Workflow,
  Bell
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface InsightCardProps {
  insight: InsightItem;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getCategoryIcon = () => {
    switch (insight.category) {
      case 'kpi':
        return <BarChart className="h-4 w-4" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity':
        return <Lightbulb className="h-4 w-4" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <BarChart className="h-4 w-4" />;
    }
  };
  
  const getChangeIcon = () => {
    if (!insight.changeDirection) return <Minus className="h-4 w-4" />;
    
    switch (insight.changeDirection) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-emerald-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-pink-500" />;
      case 'neutral':
        return <Minus className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };
  
  const getCategoryBadgeColor = () => {
    switch (insight.category) {
      case 'kpi':
        return "bg-blue-100 text-blue-800";
      case 'risk':
        return "bg-red-100 text-red-800";
      case 'opportunity':
        return "bg-green-100 text-green-800";
      case 'trend':
        return "bg-purple-100 text-purple-800";
      default:
        return "";
    }
  };
  
  const getPriorityBadgeColor = () => {
    switch (insight.priority) {
      case 'high':
        return "bg-red-100 text-red-800";
      case 'medium':
        return "bg-yellow-100 text-yellow-800";
      case 'low':
        return "bg-green-100 text-green-800";
      default:
        return "";
    }
  };
  
  const getTimeSince = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <div className={`rounded-full p-1.5 ${insight.category === 'risk' ? 'bg-red-100' : insight.category === 'opportunity' ? 'bg-green-100' : 'bg-blue-100'}`}>
              {getCategoryIcon()}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-base">{insight.headline}</h3>
              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
            </div>
          </div>
          
          {insight.metric && (
            <div className="mt-3 ml-8">
              <span className="text-sm font-medium">{insight.metric}:</span>{' '}
              <span className="text-sm">{insight.value}</span>
              {insight.change !== undefined && (
                <span className="ml-2 inline-flex items-center">
                  {getChangeIcon()}
                  <span className={`text-xs ml-1 ${insight.changeDirection === 'up' ? 'text-emerald-600' : insight.changeDirection === 'down' ? 'text-pink-600' : ''}`}>
                    {Math.abs(insight.change)}%
                  </span>
                </span>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap mt-3 ml-8 gap-1.5">
            <Badge variant="outline" className={getCategoryBadgeColor()}>
              {insight.category === 'kpi' ? 'KPI' : 
                insight.category === 'risk' ? 'Risk' : 
                insight.category === 'opportunity' ? 'Opportunity' : 'Trend'}
            </Badge>
            
            <Badge variant="outline" className={getPriorityBadgeColor()}>
              {insight.priority} priority
            </Badge>
            
            <Badge variant="outline">{insight.department}</Badge>
            
            <Badge variant="outline" className="bg-slate-100">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeSince(insight.timestamp)}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col gap-2 justify-end shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Set Alert</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Workflow className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create Workflow</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Discuss</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
