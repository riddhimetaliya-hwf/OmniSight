
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useWorkflowSimulation = () => {
  const [simulating, setSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationPaused, setSimulationPaused] = useState(false);
  const { toast } = useToast();
  
  const handleStartSimulation = useCallback(() => {
    if (simulationPaused) {
      setSimulationPaused(false);
      toast({
        title: "Simulation resumed",
        description: "Continuing workflow execution"
      });
      return;
    }
    
    toast({
      title: "Simulation started",
      description: "Running workflow simulation..."
    });
    setSimulating(true);
    setSimulationProgress(0);
    setSimulationPaused(false);
    
    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulating(false);
          toast({
            title: "Simulation complete",
            description: "Workflow executed successfully"
          });
          return 100;
        }
        return prev + 5;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [simulationPaused, toast]);

  const handlePauseSimulation = useCallback(() => {
    setSimulationPaused(true);
    toast({
      title: "Simulation paused",
      description: "Workflow execution paused"
    });
  }, [toast]);

  const stopSimulation = useCallback(() => {
    setSimulating(false);
    setSimulationPaused(false);
    setSimulationProgress(0);
    toast({
      title: "Simulation stopped",
      description: "Workflow execution terminated"
    });
  }, [toast]);

  return {
    simulating,
    simulationProgress,
    simulationPaused,
    handleStartSimulation,
    handlePauseSimulation,
    stopSimulation
  };
};
