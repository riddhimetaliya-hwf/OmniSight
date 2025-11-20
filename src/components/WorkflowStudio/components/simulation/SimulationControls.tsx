
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, PauseCircle, AlertTriangle } from 'lucide-react';

interface SimulationControlsProps {
  simulationProgress: number;
  simulationPaused: boolean;
  handleTogglePause: () => void;
  stopSimulation: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  simulationProgress,
  simulationPaused,
  handleTogglePause,
  stopSimulation,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b p-3 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex-1 w-full">
        <div className="flex justify-between text-sm mb-1">
          <span>Simulation progress</span>
          <span>{simulationProgress}%</span>
        </div>
        <Progress value={simulationProgress} className="h-2" />
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={handleTogglePause}
          aria-label={simulationPaused ? "Resume simulation" : "Pause simulation"}
        >
          {simulationPaused ? (
            <PlayCircle className="h-4 w-4 mr-1" />
          ) : (
            <PauseCircle className="h-4 w-4 mr-1" />
          )}
          {simulationPaused ? "Resume" : "Pause"}
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={stopSimulation}
          aria-label="Stop simulation"
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Stop
        </Button>
      </div>
    </div>
  );
};
