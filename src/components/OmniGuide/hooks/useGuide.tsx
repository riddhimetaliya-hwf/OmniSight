
import { useState } from 'react';

interface UseGuideOptions {
  tourId?: string;
  moduleName: string;
  autoStart?: boolean;
}

// Modified hook that returns empty/disabled tour data
export const useGuide = ({ tourId, moduleName, autoStart = false }: UseGuideOptions) => {
  // Return empty arrays and no-op functions
  return {
    isActive: false,
    moduleTours: [],
    activeTour: null,
    currentStep: null,
    startTour: () => {},
    nextStep: () => {},
    prevStep: () => {},
    skipTour: () => {},
    stopTour: () => {}
  };
};
