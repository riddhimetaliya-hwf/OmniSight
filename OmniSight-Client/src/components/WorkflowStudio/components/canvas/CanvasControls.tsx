
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Minus, Plus } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onStartSimulation: () => void;
  showSimulateButton: boolean;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({ 
  onZoomIn, 
  onZoomOut, 
  onStartSimulation,
  showSimulateButton
}) => {
  return (
    <TooltipProvider>
      <div className="flex space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white"
              onClick={onZoomIn}
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white"
              onClick={onZoomOut}
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
        
        {showSimulateButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white text-primary"
                onClick={onStartSimulation}
                aria-label="Start simulation"
              >
                <PlayCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Test Run Workflow</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
