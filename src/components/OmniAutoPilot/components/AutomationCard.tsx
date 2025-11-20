
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Automation } from '../types';
import { useAutomationContext } from '../context/AutomationContext';
import { Play, Clock, CalendarClock, ChevronsUpDown, MoreHorizontal, Zap, Calendar, Bell, Trash2, Pause } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { automationStatusColors, getTriggerIcon, getActionIcon } from '../utils';
import { AutomationProgress } from './AutomationProgress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AutomationCardProps {
  automation: Automation;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({ automation }) => {
  const { toggleAutomationStatus, runAutomationNow, deleteAutomation } = useAutomationContext();
  const [expanded, setExpanded] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationStatus, setSimulationStatus] = useState<'running' | 'paused' | 'completed' | 'error'>('running');

  const getStatusBadge = () => {
    const { color, label } = automationStatusColors[automation.status];
    return <Badge variant={color}>{label}</Badge>;
  };

  const getNextRunText = () => {
    if (automation.status !== 'active') {
      return 'Not scheduled';
    }
    
    if (!automation.nextRun) {
      return 'Not scheduled';
    }
    
    const nextRunDate = new Date(automation.nextRun);
    return `Next run: ${formatDistanceToNow(nextRunDate, { addSuffix: true })}`;
  };

  const getLastRunText = () => {
    if (!automation.lastRun) {
      return 'Never run';
    }
    
    const lastRunDate = new Date(automation.lastRun);
    return `Last run: ${formatDistanceToNow(lastRunDate, { addSuffix: true })}`;
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    setSimulationStatus('running');
    
    // Simulate progress with intervals
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setSimulationStatus('completed');
          // Reset after 3 seconds
          setTimeout(() => {
            setIsSimulating(false);
          }, 3000);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const handlePauseSimulation = () => {
    setSimulationStatus(prev => prev === 'paused' ? 'running' : 'paused');
  };

  const mockSteps = [
    { name: 'Initialize', status: 'completed' as const },
    { name: 'Fetch Data', status: 'completed' as const },
    { name: 'Process', status: simulationProgress >= 50 ? 'completed' as const : 'pending' as const },
    { name: 'Send Notification', status: simulationProgress >= 80 ? 'completed' as const : 'pending' as const },
    { name: 'Finalize', status: simulationProgress >= 100 ? 'completed' as const : 'pending' as const },
  ];

  return (
    <Card 
      className={`border-l-4 ${automation.status === 'active' ? 'border-l-primary' : 'border-l-muted'} transition-all hover:shadow-md`}
      tabIndex={0}
      aria-label={`Automation: ${automation.name}`}
    >
      <CardContent className="p-4">
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{automation.name}</h3>
                {automation.suggestedBy === 'ai' && (
                  <Badge variant="outline" className="text-xs">AI Suggested</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{automation.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => runAutomationNow(automation.id)}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Now
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRunSimulation}>
                    <Zap className="h-4 w-4 mr-2" />
                    Test Run
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteAutomation(automation.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {isSimulating && (
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Test Run</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePauseSimulation}
                  disabled={simulationStatus === 'completed'}
                  aria-label={simulationStatus === 'paused' ? 'Resume simulation' : 'Pause simulation'}
                >
                  {simulationStatus === 'paused' ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
              </div>
              <AutomationProgress 
                value={simulationProgress} 
                status={simulationStatus}
                steps={mockSteps}
              />
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {getTriggerIcon(automation.trigger.type)}
                    <span className="ml-1">{automation.trigger.description}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Trigger: {automation.trigger.type}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-4">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {getLastRunText()}
              </span>
              <span className="flex items-center">
                <CalendarClock className="h-3 w-3 mr-1" />
                {getNextRunText()}
              </span>
            </div>
          </div>
          
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Actions:</h4>
              <div className="space-y-2">
                {automation.actions.map((action) => (
                  <div key={action.id} className="flex items-start gap-2 text-sm">
                    {getActionIcon(action.type)}
                    <span>{action.description}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Created {formatDistanceToNow(new Date(automation.createdAt), { addSuffix: true })} by {automation.createdBy}</p>
              {automation.lastRun && (
                <p>Last executed: {format(new Date(automation.lastRun), 'PPpp')}</p>
              )}
            </div>
          </CollapsibleContent>
          
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2"
              aria-expanded={expanded}
              aria-controls="automation-details"
            >
              <ChevronsUpDown className="h-3 w-3 mr-2" />
              {expanded ? 'Show Less' : 'Show Details'}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0 border-t">
        <div className="flex items-center">
          <Switch 
            checked={automation.status === 'active'} 
            onCheckedChange={(checked) => 
              toggleAutomationStatus(automation.id, checked ? 'active' : 'paused')
            }
            aria-label={`Toggle automation ${automation.status === 'active' ? 'off' : 'on'}`}
          />
          <span className="ml-2 text-sm">
            {automation.status === 'active' ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => runAutomationNow(automation.id)}
          disabled={automation.status === 'error'}
          aria-label="Run automation now"
        >
          <Play className="h-3 w-3 mr-2" />
          Run Now
        </Button>
      </CardFooter>
    </Card>
  );
};
