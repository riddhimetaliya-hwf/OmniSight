
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, StopCircle } from 'lucide-react';

interface WorkflowSimulationControlsProps {
  simulating: boolean;
  progress: number;
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const WorkflowSimulationControls: React.FC<WorkflowSimulationControlsProps> = ({
  simulating,
  progress,
  paused,
  onPause,
  onResume,
  onStop
}) => {
  if (!simulating) return null;
  
  return (
    <div className="flex flex-col gap-2 min-w-[240px]">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Simulation</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {Math.round(progress)}%
        </span>
      </div>

      <Progress value={progress} className="h-2" />
      
      <div className="flex gap-2 mt-1">
        {paused ? (
          <Button 
            size="sm" 
            className="h-7 gap-1" 
            onClick={onResume}
          >
            <Play className="h-3.5 w-3.5" />
            <span className="text-xs">Resume</span>
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="h-7 gap-1" 
            onClick={onPause}
          >
            <Pause className="h-3.5 w-3.5" />
            <span className="text-xs">Pause</span>
          </Button>
        )}
        
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 gap-1 ml-auto" 
          onClick={onStop}
        >
          <StopCircle className="h-3.5 w-3.5" />
          <span className="text-xs">Stop</span>
        </Button>
      </div>
    </div>
  );
};
