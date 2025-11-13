
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGuide } from '@/components/OmniGuide/hooks/useGuide';

export const useTour = () => {
  const [isTourActive, setIsTourActive] = useState(false);
  const { toast } = useToast();
  
  // Use the OmniGuide hook
  const { startTour, isActive } = useGuide({
    moduleName: 'workflow',
    autoStart: false
  });

  // Update local state based on guide state
  useEffect(() => {
    setIsTourActive(isActive);
  }, [isActive]);

  const startWorkflowTour = () => {
    startTour();
    setIsTourActive(true);
    
    toast({
      title: "Workflow Studio Tour",
      description: "Starting the interactive tour of workflow studio features.",
    });
  };

  return {
    isTourActive,
    startTour: startWorkflowTour,
  };
};
