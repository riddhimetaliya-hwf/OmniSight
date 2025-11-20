
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWorkflow } from '../context/WorkflowContext';
import { Save, Play, Pause, StopCircle, RefreshCw, Plus, Download } from 'lucide-react';

interface WorkflowActionsProps {
  simulating: boolean;
  simulationPaused: boolean;
  simulationProgress: number;
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onStopSimulation: () => void;
  onSaveWorkflow: () => void;
  onRefresh: () => void;
  onAddNode: () => void;
}

export const WorkflowActions: React.FC<WorkflowActionsProps> = ({
  simulating,
  simulationPaused,
  simulationProgress,
  onStartSimulation,
  onPauseSimulation,
  onStopSimulation,
  onSaveWorkflow,
  onRefresh,
  onAddNode
}) => {
  const { workflow } = useWorkflow();
  
  return (
    <div className="h-12 flex items-center justify-between px-4 border-b bg-muted/30">
      <div className="flex items-center gap-2">
        <Button 
          size="sm"
          variant="ghost" 
          className="gap-1"
          onClick={onAddNode}
        >
          <Plus className="h-4 w-4" />
          <span>Add Node</span>
        </Button>
        
        <Button 
          size="sm"
          variant="ghost" 
          className="gap-1"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {simulating ? (
          <>
            <div className="w-40 mr-2">
              <Progress value={simulationProgress} className="h-2" />
            </div>
            
            {simulationPaused ? (
              <Button 
                size="sm"
                variant="outline" 
                className="gap-1"
                onClick={onStartSimulation}
              >
                <Play className="h-4 w-4" />
                <span>Resume</span>
              </Button>
            ) : (
              <Button 
                size="sm"
                variant="outline" 
                className="gap-1"
                onClick={onPauseSimulation}
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </Button>
            )}
            
            <Button 
              size="sm"
              variant="outline" 
              className="gap-1"
              onClick={onStopSimulation}
            >
              <StopCircle className="h-4 w-4" />
              <span>Stop</span>
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="sm"
              variant="outline" 
              className="gap-1"
              onClick={onStartSimulation}
              disabled={workflow.nodes.length === 0}
            >
              <Play className="h-4 w-4" />
              <span>Simulate</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => {}}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            
            <Button 
              size="sm"
              variant={workflow.isModified ? "default" : "outline"}
              className="gap-1"
              onClick={onSaveWorkflow}
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
